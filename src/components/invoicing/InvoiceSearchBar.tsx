
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Bell, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface InvoiceSearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const InvoiceSearchBar: React.FC<InvoiceSearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  const { toast } = useToast();

  const handleGenerateInvoice = () => {
    toast({
      title: "AI Invoice Generation Started",
      description: "AI is analyzing your data to generate new invoices. This may take a few moments.",
      duration: 5000,
    });
  };

  const handleSendReminders = () => {
    toast({
      title: "Payment Reminders Sent",
      description: "Automated payment reminders have been sent to clients with pending invoices.",
      duration: 3000,
    });
  };

  return (
    <div className="flex justify-between items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search invoices..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={handleSendReminders}>
          <Bell className="mr-2 h-4 w-4" />
          Send Reminders
        </Button>
        <Button variant="default" size="sm" onClick={handleGenerateInvoice}>
          <Brain className="mr-2 h-4 w-4" />
          Generate AI Invoice
        </Button>
      </div>
    </div>
  );
};

export default InvoiceSearchBar;
