
import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText, 
  Receipt, 
  UserCheck, 
  Building2, 
  PiggyBank
} from "lucide-react";

const documentItems = [
  {
    id: 1,
    title: "Bank Statements",
    status: "complete" as const,
    category: "financial",
    icon: FileText,
    dueDate: null
  },
  {
    id: 2,
    title: "Business Expense Receipts",
    status: "complete" as const,
    category: "financial",
    icon: Receipt,
    dueDate: null
  },
  {
    id: 3,
    title: "Quarterly Tax Payments",
    status: "complete" as const,
    category: "tax",
    icon: PiggyBank,
    dueDate: null
  },
  {
    id: 4,
    title: "Payroll Documentation",
    status: "pending" as const,
    category: "employees",
    icon: UserCheck,
    dueDate: "2024-06-30"
  },
  {
    id: 5,
    title: "Business Formation Documents",
    status: "complete" as const,
    category: "legal",
    icon: Building2,
    dueDate: null
  },
  {
    id: 6,
    title: "Investment Documentation",
    status: "missing" as const,
    category: "financial",
    icon: FileText,
    dueDate: "2024-06-15"
  },
  {
    id: 7,
    title: "Prior Year Tax Returns",
    status: "complete" as const,
    category: "tax",
    icon: FileText,
    dueDate: null
  },
  {
    id: 8,
    title: "Vehicle Expense Records",
    status: "pending" as const,
    category: "financial",
    icon: Receipt,
    dueDate: "2024-06-25"
  }
];

const DocumentationChecklist = () => {
  const getCompletionStatus = () => {
    const complete = documentItems.filter(item => item.status === "complete").length;
    return {
      complete,
      total: documentItems.length,
      percentage: Math.round((complete / documentItems.length) * 100)
    };
  };
  
  const { complete, total, percentage } = getCompletionStatus();
  
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-sm font-medium">Documentation Checklist</CardTitle>
          <div className="flex items-center text-xs">
            <span className="font-medium">{complete} of {total}</span>
            <span className="mx-2 text-muted-foreground">|</span>
            <span className="text-green-600 font-medium">{percentage}% Complete</span>
          </div>
        </div>
        
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {documentItems.map(item => (
            <div key={item.id} className="flex items-center space-x-3 bg-muted/30 border border-border rounded-lg p-2.5">
              <DocumentIcon category={item.category} Icon={item.icon} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <StatusBadge status={item.status} dueDate={item.dueDate} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface DocumentIconProps {
  category: string;
  Icon: React.ElementType;
}

const DocumentIcon: React.FC<DocumentIconProps> = ({ category, Icon }) => {
  const getColorByCategory = () => {
    switch (category) {
      case "financial":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "tax":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "employees":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
      case "legal":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };
  
  return (
    <div className={`p-1.5 rounded-full ${getColorByCategory()}`}>
      <Icon className="h-3.5 w-3.5" />
    </div>
  );
};

interface StatusBadgeProps {
  status: "complete" | "pending" | "missing";
  dueDate: string | null;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, dueDate }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  switch (status) {
    case "complete":
      return (
        <Badge className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 flex items-center">
          <CheckCircle className="h-3 w-3 mr-1" />
          Complete
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Due {dueDate ? formatDate(dueDate) : 'Soon'}
        </Badge>
      );
    case "missing":
      return (
        <Badge className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 flex items-center">
          <XCircle className="h-3 w-3 mr-1" />
          Missing
        </Badge>
      );
    default:
      return null;
  }
};

export default DocumentationChecklist;
