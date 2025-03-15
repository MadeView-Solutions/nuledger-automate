
import { TaxForm } from "@/components/tax/types";

// Extended mock data for comprehensive tax form list
const mockIrsFormData = {
  "123456789": {
    "client-001": [
      {
        id: "1040",
        name: "Form 1040",
        data: {
          income: 75000,
          federalTaxWithheld: 12500,
          deductions: 12950,
          taxCredits: 2000,
          estimatedTaxPayments: 1500
        }
      },
      {
        id: "scheduleC",
        name: "Schedule C",
        data: {
          businessIncome: 15000,
          businessExpenses: 6500,
          netProfit: 8500
        }
      },
      {
        id: "scheduleD",
        name: "Schedule D",
        data: {
          shortTermGains: 3200,
          longTermGains: 5800,
          totalCapitalGains: 9000
        }
      }
    ]
  }
};

// Comprehensive list of all available tax forms
const availableTaxForms = [
  // Individual Tax Forms
  { id: "1040", name: "Form 1040 - U.S. Individual Income Tax Return", category: "individual" },
  { id: "1040A", name: "Form 1040A - U.S. Individual Income Tax Return (Simplified)", category: "individual" },
  { id: "1040EZ", name: "Form 1040EZ - Income Tax Return for Single and Joint Filers With No Dependents", category: "individual" },
  { id: "1040ES", name: "Form 1040-ES - Estimated Tax for Individuals", category: "individual" },
  { id: "1040NR", name: "Form 1040-NR - U.S. Nonresident Alien Income Tax Return", category: "individual" },
  { id: "1040X", name: "Form 1040-X - Amended U.S. Individual Income Tax Return", category: "individual" },
  
  // Schedules for Form 1040
  { id: "scheduleA", name: "Schedule A - Itemized Deductions", category: "schedule" },
  { id: "scheduleB", name: "Schedule B - Interest and Ordinary Dividends", category: "schedule" },
  { id: "scheduleC", name: "Schedule C - Profit or Loss From Business", category: "schedule" },
  { id: "scheduleD", name: "Schedule D - Capital Gains and Losses", category: "schedule" },
  { id: "scheduleE", name: "Schedule E - Supplemental Income and Loss", category: "schedule" },
  { id: "scheduleEIC", name: "Schedule EIC - Earned Income Credit", category: "schedule" },
  { id: "scheduleF", name: "Schedule F - Profit or Loss From Farming", category: "schedule" },
  { id: "scheduleH", name: "Schedule H - Household Employment Taxes", category: "schedule" },
  { id: "scheduleJ", name: "Schedule J - Income Averaging for Farmers and Fishermen", category: "schedule" },
  { id: "scheduleR", name: "Schedule R - Credit for the Elderly or the Disabled", category: "schedule" },
  { id: "scheduleSE", name: "Schedule SE - Self-Employment Tax", category: "schedule" },
  { id: "schedule8812", name: "Schedule 8812 - Credits for Qualifying Children and Other Dependents", category: "schedule" },
  
  // Business Tax Forms
  { id: "1065", name: "Form 1065 - U.S. Return of Partnership Income", category: "business" },
  { id: "1120", name: "Form 1120 - U.S. Corporation Income Tax Return", category: "business" },
  { id: "1120S", name: "Form 1120-S - U.S. Income Tax Return for an S Corporation", category: "business" },
  { id: "2553", name: "Form 2553 - Election by a Small Business Corporation", category: "business" },
  { id: "4562", name: "Form 4562 - Depreciation and Amortization", category: "business" },
  { id: "8825", name: "Form 8825 - Rental Real Estate Income and Expenses of a Partnership or an S Corporation", category: "business" },
  
  // Employment Tax Forms
  { id: "940", name: "Form 940 - Employer's Annual Federal Unemployment (FUTA) Tax Return", category: "employment" },
  { id: "941", name: "Form 941 - Employer's Quarterly Federal Tax Return", category: "employment" },
  { id: "944", name: "Form 944 - Employer's Annual Federal Tax Return", category: "employment" },
  { id: "W2", name: "Form W-2 - Wage and Tax Statement", category: "employment" },
  { id: "W3", name: "Form W-3 - Transmittal of Wage and Tax Statements", category: "employment" },
  { id: "W4", name: "Form W-4 - Employee's Withholding Certificate", category: "employment" },
  { id: "1099MISC", name: "Form 1099-MISC - Miscellaneous Income", category: "employment" },
  { id: "1099NEC", name: "Form 1099-NEC - Nonemployee Compensation", category: "employment" },
  
  // Estate and Gift Tax Forms
  { id: "706", name: "Form 706 - United States Estate (and Generation-Skipping Transfer) Tax Return", category: "estate" },
  { id: "709", name: "Form 709 - United States Gift (and Generation-Skipping Transfer) Tax Return", category: "estate" },
  
  // Information Returns
  { id: "8938", name: "Form 8938 - Statement of Specified Foreign Financial Assets", category: "information" },
  { id: "8949", name: "Form 8949 - Sales and Other Dispositions of Capital Assets", category: "information" },
  
  // State Forms
  { id: "IT40", name: "State IT-40 - State Income Tax Return", category: "state" },
  { id: "IT40PNR", name: "State IT-40PNR - Part-Year Resident or Nonresident Tax Return", category: "state" }
];

interface IRSImportResult {
  success: boolean;
  formCount: number;
  formData?: any[];
}

interface AvailableFormsResult {
  success: boolean;
  forms: Array<{
    id: string;
    name: string;
    category: string;
  }>;
}

/**
 * Import tax data from IRS systems
 * 
 * In a real application, this would connect to the IRS API
 * using proper authentication and security measures
 */
export const importIRSData = async (
  taxId: string, 
  clientId: string
): Promise<IRSImportResult> => {
  console.log(`Importing IRS data for Tax ID: ${taxId}, Client ID: ${clientId}`);
  
  // Add artificial delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real app, this would be an API call to IRS systems
  // using proper authentication and security measures
  try {
    // For demo purposes, use mock data
    const formData = mockIrsFormData[taxId]?.[clientId];
    
    if (!formData) {
      console.error("No form data found for the provided IDs");
      throw new Error("No data found for the provided tax ID and client ID");
    }
    
    // This would update the local state or database with the imported data
    console.log("Retrieved form data:", formData);
    
    // Return success result
    return {
      success: true,
      formCount: formData.length,
      formData: formData
    };
  } catch (error) {
    console.error("Error importing IRS data:", error);
    throw error;
  }
};

/**
 * Process and map IRS data to the application's tax form structure
 */
export const mapIRSDataToTaxForms = (irsData: any[]): Partial<TaxForm>[] => {
  return irsData.map(form => ({
    id: form.id,
    name: form.name,
    status: "ready" as const,
    completed: true,
    aiGenerated: true
  }));
};

/**
 * Fetch all available tax forms from IRS
 * 
 * In a real application, this would connect to the IRS API
 * to get the latest list of available forms
 */
export const fetchAllAvailableTaxForms = async (
  category?: string
): Promise<AvailableFormsResult> => {
  console.log(`Fetching all available tax forms${category ? ` in category: ${category}` : ''}`);
  
  // Add artificial delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    // Filter forms by category if provided
    let forms = availableTaxForms;
    
    if (category) {
      forms = availableTaxForms.filter(form => form.category === category);
    }
    
    console.log(`Retrieved ${forms.length} available forms${category ? ` in category: ${category}` : ''}`);
    
    return {
      success: true,
      forms: forms
    };
  } catch (error) {
    console.error("Error fetching available tax forms:", error);
    throw error;
  }
};

/**
 * Get available form categories
 */
export const getTaxFormCategories = (): string[] => {
  const categories = [...new Set(availableTaxForms.map(form => form.category))];
  return categories;
};
