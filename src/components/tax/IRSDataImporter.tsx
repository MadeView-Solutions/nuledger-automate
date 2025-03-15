
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, List, Loader2, Filter } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { importIRSData, fetchAllAvailableTaxForms, getTaxFormCategories } from "@/services/tax/irsDataService";

interface IRSDataImporterProps {
  onImportStart: (clientId: string) => void;
  onImportComplete: (success: boolean, formCount: number) => void;
  isImporting: boolean;
}

const IRSDataImporter: React.FC<IRSDataImporterProps> = ({ 
  onImportStart, 
  onImportComplete,
  isImporting 
}) => {
  const [taxId, setTaxId] = useState("");
  const [clientId, setClientId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("import");
  const [isFetchingForms, setIsFetchingForms] = useState(false);
  const [availableForms, setAvailableForms] = useState<Array<{id: string; name: string; category: string}>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const categories = getTaxFormCategories();

  const handleImport = async () => {
    onImportStart(clientId);
    
    try {
      const result = await importIRSData(taxId, clientId);
      onImportComplete(true, result.formCount);
      setDialogOpen(false);
      // Reset form
      setTaxId("");
      setClientId("");
    } catch (error) {
      console.error("Error importing IRS data:", error);
      onImportComplete(false, 0);
    }
  };

  const handleFetchAllForms = async () => {
    setIsFetchingForms(true);
    
    try {
      const result = await fetchAllAvailableTaxForms(selectedCategory !== "all" ? selectedCategory : undefined);
      setAvailableForms(result.forms);
    } catch (error) {
      console.error("Error fetching available forms:", error);
    } finally {
      setIsFetchingForms(false);
    }
  };

  const filteredForms = availableForms.filter(form => 
    form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="flex gap-2">
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" onClick={() => setActiveTab("import")}>
            <Download className="h-4 w-4 mr-2" />
            Import IRS Data
          </Button>
        </DialogTrigger>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" onClick={() => {
            setActiveTab("available");
            handleFetchAllForms();
          }}>
            <List className="h-4 w-4 mr-2" />
            Available Forms
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>IRS Tax Forms</DialogTitle>
          <DialogDescription>
            Import client tax data or browse available tax forms.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="import">Import Client Data</TabsTrigger>
            <TabsTrigger value="available">Available Forms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client-id" className="text-right">
                  Client ID
                </Label>
                <Input
                  id="client-id"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tax-id" className="text-right">
                  Tax ID / EIN
                </Label>
                <Input
                  id="tax-id"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <DialogFooter className="mt-4">
                <Button 
                  type="submit" 
                  onClick={handleImport} 
                  disabled={!taxId.trim() || !clientId.trim() || isImporting}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    "Import Data"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
          
          <TabsContent value="available">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search forms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleFetchAllForms} size="sm" variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
              
              {isFetchingForms ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="border rounded-md">
                  <div className="max-h-[300px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="text-left p-3 text-sm">Form ID</th>
                          <th className="text-left p-3 text-sm">Name</th>
                          <th className="text-left p-3 text-sm">Category</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredForms.length > 0 ? (
                          filteredForms.map((form) => (
                            <tr key={form.id} className="hover:bg-muted/40">
                              <td className="p-3 text-sm font-medium">{form.id}</td>
                              <td className="p-3 text-sm">{form.name}</td>
                              <td className="p-3 text-sm capitalize">{form.category}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="p-8 text-center text-muted-foreground">
                              {availableForms.length === 0 
                                ? "Click 'Filter' to load available forms" 
                                : "No forms match your search criteria"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default IRSDataImporter;
