
import React from "react";
import { Loader2 } from "lucide-react";
import { 
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaxForm {
  id: string;
  name: string;
  category: string;
}

interface AvailableFormsTableProps {
  isFetching: boolean;
  forms: TaxForm[];
  filteredForms: TaxForm[];
}

const AvailableFormsTable: React.FC<AvailableFormsTableProps> = ({
  isFetching,
  forms,
  filteredForms
}) => {
  if (isFetching) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px]">Form ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px]">Category</TableHead>
          </TableRow>
        </TableHeader>
        <ScrollArea className="h-[300px]">
          <TableBody>
            {filteredForms.length > 0 ? (
              filteredForms.map((form) => (
                <TableRow key={form.id} className="hover:bg-muted/40">
                  <td className="p-3 text-sm font-medium">{form.id}</td>
                  <td className="p-3 text-sm">{form.name}</td>
                  <td className="p-3 text-sm capitalize">{form.category}</td>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td colSpan={3} className="p-8 text-center text-muted-foreground">
                  {forms.length === 0 
                    ? "Click 'Filter' to load available forms" 
                    : "No forms match your search criteria"}
                </td>
              </TableRow>
            )}
          </TableBody>
        </ScrollArea>
      </Table>
    </div>
  );
};

export default AvailableFormsTable;
