
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TransactionSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const TransactionSearch = ({ searchTerm, onSearchChange }: TransactionSearchProps) => {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search transactions..."
        className="pl-9"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default TransactionSearch;
