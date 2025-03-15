
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { importIRSData, fetchAllAvailableTaxForms } from "@/services/tax/irsDataService";
import IRSDataImportButtons from "./irs/IRSDataImportButtons";
import ImportClientDataForm from "./irs/ImportClientDataForm";
import AvailableFormsContent from "./irs/AvailableFormsContent";

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
  
  const handleImport = async () => {
    onImportStart(clientId);
    
    try {
      const result = await importIRSData(taxId, clientId);
      onImportComplete(true, result.formCount);
      setDialogOpen(false);
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
      <IRSDataImportButtons
        onImportClick={() => setActiveTab("import")}
        onAvailableFormsClick={() => {
          setActiveTab("available");
          handleFetchAllForms();
        }}
      />

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
            <ImportClientDataForm
              clientId={clientId}
              taxId={taxId}
              isImporting={isImporting}
              onClientIdChange={setClientId}
              onTaxIdChange={setTaxId}
              onImport={handleImport}
            />
          </TabsContent>
          
          <TabsContent value="available">
            <AvailableFormsContent
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              isFetchingForms={isFetchingForms}
              availableForms={availableForms}
              filteredForms={filteredForms}
              onSearchChange={setSearchTerm}
              onCategoryChange={setSelectedCategory}
              onFilter={handleFetchAllForms}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default IRSDataImporter;
