import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, FileText, Download, Eye, Edit } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const SettlementDisbursement = () => {
  const [templateName, setTemplateName] = useState("");
  const [attorneyFeePercent, setAttorneyFeePercent] = useState("33");
  const [description, setDescription] = useState("");

  // Mock data for settlement templates
  const templates = [
    {
      id: "T001",
      name: "Standard Personal Injury",
      attorneyFee: "33%",
      description: "Standard contingency fee structure for PI cases",
      lastUsed: "2024-07-20",
      status: "Active"
    },
    {
      id: "T002", 
      name: "Medical Malpractice",
      attorneyFee: "40%",
      description: "Higher contingency for complex medical cases",
      lastUsed: "2024-07-18",
      status: "Active"
    },
    {
      id: "T003",
      name: "Workers Compensation",
      attorneyFee: "25%",
      description: "Standard WC settlement distribution",
      lastUsed: "2024-07-15",
      status: "Active"
    },
    {
      id: "T004",
      name: "Class Action",
      attorneyFee: "30%",
      description: "Class action settlement template",
      lastUsed: "2024-07-10",
      status: "Draft"
    }
  ];

  // Mock recent settlements
  const recentSettlements = [
    {
      id: "S001",
      clientName: "John Smith",
      templateUsed: "Standard Personal Injury",
      totalAmount: 150000,
      clientPortion: 95000,
      attorneyFee: 49500,
      expenses: 5500,
      date: "2024-07-22"
    },
    {
      id: "S002",
      clientName: "Jane Doe", 
      templateUsed: "Medical Malpractice",
      totalAmount: 500000,
      clientPortion: 285000,
      attorneyFee: 200000,
      expenses: 15000,
      date: "2024-07-20"
    }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settlement Disbursement Templates</h1>
            <p className="text-muted-foreground">
              Create and manage standardized settlement distribution templates
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create New Template Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Create New Template</CardTitle>
              <CardDescription>
                Set up a reusable settlement distribution template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  placeholder="e.g., Standard Personal Injury"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="attorneyFee">Attorney Fee (%)</Label>
                <Input
                  id="attorneyFee"
                  type="number"
                  placeholder="33"
                  value={attorneyFeePercent}
                  onChange={(e) => setAttorneyFeePercent(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe when to use this template..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </CardContent>
          </Card>

          {/* Templates List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Disbursement Templates</CardTitle>
              <CardDescription>
                Manage your settlement distribution templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Attorney Fee</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {template.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{template.attorneyFee}</TableCell>
                      <TableCell>{template.lastUsed}</TableCell>
                      <TableCell>
                        <Badge variant={template.status === "Active" ? "default" : "secondary"}>
                          {template.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Recent Settlements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Settlement Disbursements</CardTitle>
            <CardDescription>
              View recently processed settlements using your templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Template Used</TableHead>
                  <TableHead>Total Settlement</TableHead>
                  <TableHead>Client Portion</TableHead>
                  <TableHead>Attorney Fee</TableHead>
                  <TableHead>Expenses</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSettlements.map((settlement) => (
                  <TableRow key={settlement.id}>
                    <TableCell className="font-medium">{settlement.clientName}</TableCell>
                    <TableCell>{settlement.templateUsed}</TableCell>
                    <TableCell>${settlement.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600">
                      ${settlement.clientPortion.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-blue-600">
                      ${settlement.attorneyFee.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-orange-600">
                      ${settlement.expenses.toLocaleString()}
                    </TableCell>
                    <TableCell>{settlement.date}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettlementDisbursement;