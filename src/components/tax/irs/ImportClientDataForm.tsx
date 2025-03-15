
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface ImportClientDataFormProps {
  clientId: string;
  taxId: string;
  isImporting: boolean;
  onClientIdChange: (value: string) => void;
  onTaxIdChange: (value: string) => void;
  onImport: () => void;
}

const ImportClientDataForm: React.FC<ImportClientDataFormProps> = ({
  clientId,
  taxId,
  isImporting,
  onClientIdChange,
  onTaxIdChange,
  onImport
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="client-id" className="text-right">
          Client ID
        </Label>
        <Input
          id="client-id"
          value={clientId}
          onChange={(e) => onClientIdChange(e.target.value)}
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
          onChange={(e) => onTaxIdChange(e.target.value)}
          className="col-span-3"
        />
      </div>
      <DialogFooter className="mt-4">
        <Button 
          type="submit" 
          onClick={onImport} 
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
  );
};

export default ImportClientDataForm;
