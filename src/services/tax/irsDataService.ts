
// Mock service that simulates fetching data from the IRS
import { allTaxForms, taxFormCategories } from "@/components/tax/taxFormsData";

// Get all available tax form categories
export const getTaxFormCategories = (): string[] => {
  return taxFormCategories;
};

// Import client tax data from the IRS
export const importIRSData = async (taxId: string, clientId: string) => {
  // This would be an API call to the IRS in a real application
  
  // Simulate an API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock successful response
  return {
    success: true,
    clientId,
    taxId,
    formCount: 3,
    forms: [
      {
        formId: "1040",
        formName: "U.S. Individual Income Tax Return",
        year: 2023,
        fields: {
          totalIncome: 85000,
          adjustedGrossIncome: 82500,
          taxableIncome: 70000,
          totalTax: 10500
        }
      },
      {
        formId: "scheduleA",
        formName: "Itemized Deductions",
        year: 2023,
        fields: {
          medicalExpenses: 2000,
          stateLocalTaxes: 5000,
          mortgageInterest: 7500,
          charitableContributions: 1500,
          totalDeductions: 16000
        }
      },
      {
        formId: "scheduleB",
        formName: "Interest and Ordinary Dividends",
        year: 2023,
        fields: {
          totalInterest: 1200,
          totalDividends: 2500
        }
      }
    ]
  };
};

// Fetch all available tax forms
export const fetchAllAvailableTaxForms = async (category?: string) => {
  // This would be an API call to the IRS in a real application
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Filter forms by category if provided
  let filteredForms = [...allTaxForms];
  
  if (category && category !== "all") {
    filteredForms = allTaxForms.filter(form => form.category === category);
  }
  
  return {
    success: true,
    forms: filteredForms
  };
};
