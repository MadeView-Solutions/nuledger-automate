
import React from "react";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileCheck, 
  FilePlus, 
  FileWarning, 
  Download, 
  Send, 
  Eye, 
  Brain,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const forms = [
  {
    id: "1040",
    name: "Form 1040",
    description: "U.S. Individual Income Tax Return",
    dueDate: "April 15, 2024",
    status: "ready",
    completed: true,
    aiGenerated: true
  },
  {
    id: "scheduleA",
    name: "Schedule A",
    description: "Itemized Deductions",
    dueDate: "April 15, 2024",
    status: "ready",
    completed: true,
    aiGenerated: true
  },
  {
    id: "scheduleB",
    name: "Schedule B",
    description: "Interest and Ordinary Dividends",
    dueDate: "April 15, 2024",
    status: "ready",
    completed: true,
    aiGenerated: true
  },
  {
    id: "scheduleC",
    name: "Schedule C",
    description: "Profit or Loss From Business",
    dueDate: "April 15, 2024",
    status: "in-progress",
    completed: false,
    aiGenerated: false
  },
  {
    id: "scheduleD",
    name: "Schedule D",
    description: "Capital Gains and Losses",
    dueDate: "April 15, 2024",
    status: "in-progress",
    completed: false,
    aiGenerated: false
  },
  {
    id: "schedule8812",
    name: "Schedule 8812",
    description: "Credits for Qualifying Children and Other Dependents",
    dueDate: "April 15, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "form8949",
    name: "Form 8949",
    description: "Sales and Other Dispositions of Capital Assets",
    dueDate: "April 15, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "stateIT40",
    name: "State IT-40",
    description: "State Income Tax Return",
    dueDate: "April 15, 2024",
    status: "ready",
    completed: true,
    aiGenerated: true
  }
];

const TaxForms = () => {
  const { toast } = useToast();
  
  const handleGenerateForm = (formId: string) => {
    toast({
      title: "Generating Form",
      description: `AI is now auto-filling ${formId} with your financial data`,
    });
  };
  
  const handleFileForm = (formId: string) => {
    toast({
      title: "Form Filed Successfully",
      description: `${formId} has been electronically filed with the appropriate agency`,
    });
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "not-started":
        return <FileWarning className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "ready":
        return "Ready to File";
      case "in-progress":
        return "In Progress";
      case "not-starte

d":
        return "Not Started";
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Forms</CardTitle>
        <CardDescription>
          AI-powered form generation and e-filing system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Form</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{form.name}</span>
                    {form.aiGenerated && (
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950">
                        <Brain className="h-3 w-3 mr-1" />
                        AI
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{form.description}</TableCell>
                <TableCell>{form.dueDate}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(form.status)}
                    <span>{getStatusText(form.status)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    {form.completed ? (
                      <>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleFileForm(form.name)}>
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => handleGenerateForm(form.name)}>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TaxForms;
