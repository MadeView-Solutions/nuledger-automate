
import React from "react";
import FormSearchFilters from "./FormSearchFilters";
import AvailableFormsTable from "./AvailableFormsTable";

interface TaxForm {
  id: string;
  name: string;
  category: string;
}

interface AvailableFormsContentProps {
  searchTerm: string;
  selectedCategory: string;
  isFetchingForms: boolean;
  availableForms: TaxForm[];
  filteredForms: TaxForm[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onFilter: () => void;
}

const AvailableFormsContent: React.FC<AvailableFormsContentProps> = ({
  searchTerm,
  selectedCategory,
  isFetchingForms,
  availableForms,
  filteredForms,
  onSearchChange,
  onCategoryChange,
  onFilter
}) => {
  return (
    <div className="space-y-4">
      <FormSearchFilters
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onSearchChange={onSearchChange}
        onCategoryChange={onCategoryChange}
        onFilter={onFilter}
      />
      
      <AvailableFormsTable
        isFetching={isFetchingForms}
        forms={availableForms}
        filteredForms={filteredForms}
      />
    </div>
  );
};

export default AvailableFormsContent;
