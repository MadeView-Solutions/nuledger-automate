
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
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
import { importIRSData } from "@/services/tax/irsDataService";

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

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Import IRS Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Tax Data from IRS</DialogTitle>
          <DialogDescription>
            Enter client and tax information to automatically retrieve and populate tax forms.
          </DialogDescription>
        </DialogHeader>
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
        </div>
        <DialogFooter>
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
      </DialogContent>
    </Dialog>
  );
};

export default IRSDataImporter;
