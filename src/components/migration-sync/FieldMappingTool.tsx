import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, AlertTriangle, Settings, Save, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FieldMapping {
  id: string;
  filevine_field: string;
  nuledger_field: string;
  mapping_status: 'mapped' | 'manual_required' | 'unmapped';
  data_type: string;
  is_required: boolean;
  transformation_rule?: string;
}

const FieldMappingTool: React.FC = () => {
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMapping, setNewMapping] = useState({
    filevine_field: '',
    nuledger_field: '',
    data_type: 'text',
    is_required: false,
    mapping_status: 'unmapped' as const
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const nuledgerFields = [
    'Total Settlement',
    'Fee Allocation',
    'Client Name',
    'Case Number',
    'Date of Loss',
    'Date Settled',
    'Case Manager',
    'Attorney Name',
    'Policy Limits',
    'Negotiated By',
    'Lien Amount',
    'Medical Expenses',
    'Lost Wages',
    'Pain and Suffering',
    'Property Damage',
    'Case Status',
    'Settlement Type',
    'Court Jurisdiction'
  ];

  useEffect(() => {
    loadFieldMappings();
  }, []);

  const loadFieldMappings = async () => {
    try {
      const { data, error } = await supabase
        .from('field_mappings')
        .select('*')
        .order('filevine_field');
      
      if (error) throw error;
      setFieldMappings((data || []) as FieldMapping[]);
    } catch (error) {
      toast.error('Failed to load field mappings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMapping = async (id: string, updates: Partial<FieldMapping>) => {
    try {
      const { error } = await supabase
        .from('field_mappings')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      setFieldMappings(prev => 
        prev.map(mapping => 
          mapping.id === id ? { ...mapping, ...updates } : mapping
        )
      );
      
      setEditingId(null);
      toast.success('Mapping updated successfully');
    } catch (error) {
      toast.error('Failed to update mapping');
    }
  };

  const handleDeleteMapping = async (id: string) => {
    try {
      const { error } = await supabase
        .from('field_mappings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setFieldMappings(prev => prev.filter(mapping => mapping.id !== id));
      toast.success('Mapping deleted successfully');
    } catch (error) {
      toast.error('Failed to delete mapping');
    }
  };

  const handleAddMapping = async () => {
    if (!newMapping.filevine_field || !newMapping.nuledger_field) {
      toast.error('Please fill in both fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('field_mappings')
        .insert(newMapping)
        .select()
        .single();
      
      if (error) throw error;
      
      setFieldMappings(prev => [...prev, data as FieldMapping]);
      setNewMapping({
        filevine_field: '',
        nuledger_field: '',
        data_type: 'text',
        is_required: false,
        mapping_status: 'unmapped'
      });
      setShowAddForm(false);
      toast.success('Mapping added successfully');
    } catch (error) {
      toast.error('Failed to add mapping');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'mapped':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Mapped
          </Badge>
        );
      case 'manual_required':
        return (
          <Badge variant="secondary">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Manual Mapping Needed
          </Badge>
        );
      case 'unmapped':
        return (
          <Badge variant="outline">
            Unmapped
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return <div className="p-6">Loading field mappings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Field Mapping Configuration
            </CardTitle>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Mapping
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Add New Mapping Form */}
          {showAddForm && (
            <div className="p-4 border rounded-lg mb-6 space-y-4">
              <h4 className="font-medium">Add New Field Mapping</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Filevine Field</Label>
                  <Input
                    value={newMapping.filevine_field}
                    onChange={(e) => setNewMapping(prev => ({
                      ...prev,
                      filevine_field: e.target.value
                    }))}
                    placeholder="e.g., SettlementAmount"
                  />
                </div>
                <div className="space-y-2">
                  <Label>NuLedger Field</Label>
                  <Select
                    value={newMapping.nuledger_field}
                    onValueChange={(value) => setNewMapping(prev => ({
                      ...prev,
                      nuledger_field: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select NuLedger field" />
                    </SelectTrigger>
                    <SelectContent>
                      {nuledgerFields.map((field) => (
                        <SelectItem key={field} value={field}>{field}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data Type</Label>
                  <Select
                    value={newMapping.data_type}
                    onValueChange={(value) => setNewMapping(prev => ({
                      ...prev,
                      data_type: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMapping}>
                  <Save className="w-4 h-4 mr-2" />
                  Add Mapping
                </Button>
              </div>
            </div>
          )}

          {/* Field Mappings Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filevine Field</TableHead>
                  <TableHead>NuLedger Field</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fieldMappings.map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell className="font-mono font-medium">
                      {mapping.filevine_field}
                    </TableCell>
                    <TableCell>
                      {editingId === mapping.id ? (
                        <Select
                          defaultValue={mapping.nuledger_field}
                          onValueChange={(value) => 
                            handleUpdateMapping(mapping.id, { 
                              nuledger_field: value,
                              mapping_status: 'mapped'
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {nuledgerFields.map((field) => (
                              <SelectItem key={field} value={field}>{field}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span 
                          className="cursor-pointer hover:underline"
                          onClick={() => setEditingId(mapping.id)}
                        >
                          {mapping.nuledger_field}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(mapping.mapping_status)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{mapping.data_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {mapping.is_required ? (
                        <Badge variant="destructive">Required</Badge>
                      ) : (
                        <Badge variant="outline">Optional</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(mapping.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMapping(mapping.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {fieldMappings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No field mappings found. Add your first mapping to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mapping Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Mapping Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {fieldMappings.filter(m => m.mapping_status === 'mapped').length}
              </p>
              <p className="text-sm text-muted-foreground">Mapped Fields</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {fieldMappings.filter(m => m.mapping_status === 'manual_required').length}
              </p>
              <p className="text-sm text-muted-foreground">Needs Manual Mapping</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">
                {fieldMappings.filter(m => m.mapping_status === 'unmapped').length}
              </p>
              <p className="text-sm text-muted-foreground">Unmapped Fields</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldMappingTool;