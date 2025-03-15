import { TaxForm } from "./types";

// Tax forms organized by category
export const taxFormCategories = [
  "individual",
  "business",
  "1099-series",
  "payroll",
  "estate",
  "other"
];

export const getTaxFormCategory = (formId: string): string => {
  // Map form IDs to their categories
  if (formId.startsWith("1040") || formId.startsWith("schedule")) {
    return "individual";
  } else if (["1120", "1065", "990", "941", "943", "944", "945"].some(prefix => formId.startsWith(prefix)) || formId === "w-2" || formId === "w-3" || formId === "ss-4") {
    return "business";
  } else if (formId.startsWith("1099")) {
    return "1099-series";
  } else if (["940", "w-4", "i-9", "1095"].some(prefix => formId.startsWith(prefix)) || ["5500", "8829"].includes(formId)) {
    return "payroll";
  } else if (["706", "709", "1041"].some(prefix => formId.startsWith(prefix))) {
    return "estate";
  }
  return "other";
};

// Sample of commonly used tax forms with complete details
export const taxForms: TaxForm[] = [
  // Individual Tax Forms
  {
    id: "1040",
    name: "Form 1040",
    description: "U.S. Individual Income Tax Return",
    dueDate: "April 15, 2024",
    status: "ready",
    completed: true,
    aiGenerated: true
  },
  {
    id: "1040-sr",
    name: "Form 1040-SR",
    description: "U.S. Tax Return for Seniors",
    dueDate: "April 15, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "1040-x",
    name: "Form 1040-X",
    description: "Amended U.S. Individual Income Tax Return",
    dueDate: "Within 3 years of original filing",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "1040-es",
    name: "Form 1040-ES",
    description: "Estimated Tax for Individuals",
    dueDate: "Quarterly",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "1040-nr",
    name: "Form 1040-NR",
    description: "U.S. Nonresident Alien Income Tax Return",
    dueDate: "April 15, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "1040-v",
    name: "Form 1040-V",
    description: "Payment Voucher for Form 1040",
    dueDate: "With tax return",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "scheduleA",
    name: "Schedule A",
    description: "Itemized Deductions",
    dueDate: "April 15, 2024",
    status: "ready",
    completed: true,
    aiGenerated: true
  },
  {
    id: "scheduleB",
    name: "Schedule B",
    description: "Interest and Ordinary Dividends",
    dueDate: "April 15, 2024",
    status: "ready",
    completed: true,
    aiGenerated: true
  },
  {
    id: "scheduleC",
    name: "Schedule C",
    description: "Profit or Loss From Business",
    dueDate: "April 15, 2024",
    status: "in-progress",
    completed: false,
    aiGenerated: false
  },
  {
    id: "scheduleD",
    name: "Schedule D",
    description: "Capital Gains and Losses",
    dueDate: "April 15, 2024",
    status: "in-progress",
    completed: false,
    aiGenerated: false
  },
  {
    id: "scheduleE",
    name: "Schedule E",
    description: "Supplemental Income and Loss",
    dueDate: "April 15, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "scheduleF",
    name: "Schedule F",
    description: "Profit or Loss From Farming",
    dueDate: "April 15, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "scheduleH",
    name: "Schedule H",
    description: "Household Employment Taxes",
    dueDate: "April 15, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "scheduleSE",
    name: "Schedule SE",
    description: "Self-Employment Tax",
    dueDate: "April 15, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "schedule8812",
    name: "Schedule 8812",
    description: "Credits for Qualifying Children and Other Dependents",
    dueDate: "April 15, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  
  // Business Tax Forms
  {
    id: "1120",
    name: "Form 1120",
    description: "U.S. Corporation Income Tax Return",
    dueDate: "15th day of 4th month after year end",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "1120-s",
    name: "Form 1120-S",
    description: "U.S. Income Tax Return for an S Corporation",
    dueDate: "15th day of 3rd month after year end",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "1065",
    name: "Form 1065",
    description: "U.S. Return of Partnership Income",
    dueDate: "15th day of 3rd month after year end",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "990",
    name: "Form 990",
    description: "Return of Organization Exempt From Income Tax",
    dueDate: "15th day of 5th month after year end",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "941",
    name: "Form 941",
    description: "Employer's Quarterly Federal Tax Return",
    dueDate: "Last day of month after quarter end",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "w-2",
    name: "Form W-2",
    description: "Wage and Tax Statement",
    dueDate: "January 31, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "ss-4",
    name: "Form SS-4",
    description: "Application for Employer Identification Number",
    dueDate: "Before hiring employees",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  
  // 1099 Series
  {
    id: "1099-nec",
    name: "Form 1099-NEC",
    description: "Nonemployee Compensation",
    dueDate: "January 31, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "1099-misc",
    name: "Form 1099-MISC",
    description: "Miscellaneous Information",
    dueDate: "January 31, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "1099-k",
    name: "Form 1099-K",
    description: "Payment Card and Third Party Network Transactions",
    dueDate: "January 31, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "1099-int",
    name: "Form 1099-INT",
    description: "Interest Income",
    dueDate: "January 31, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "1099-div",
    name: "Form 1099-DIV",
    description: "Dividends and Distributions",
    dueDate: "January 31, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "1099-r",
    name: "Form 1099-R",
    description: "Distributions From Pensions, Annuities, Retirement Plans",
    dueDate: "January 31, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  
  // Payroll & Employment
  {
    id: "w-4",
    name: "Form W-4",
    description: "Employee's Withholding Certificate",
    dueDate: "Upon hiring and when personal/financial situation changes",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "i-9",
    name: "Form I-9",
    description: "Employment Eligibility Verification",
    dueDate: "Within 3 business days of hire",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "940",
    name: "Form 940",
    description: "Employer's Annual Federal Unemployment (FUTA) Tax Return",
    dueDate: "January 31, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "1095-a",
    name: "Form 1095-A",
    description: "Health Insurance Marketplace Statement",
    dueDate: "January 31, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  
  // Estate, Gift, and Trust
  {
    id: "706",
    name: "Form 706",
    description: "United States Estate Tax Return",
    dueDate: "9 months after date of death",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "709",
    name: "Form 709",
    description: "United States Gift Tax Return",
    dueDate: "April 15, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "1041",
    name: "Form 1041",
    description: "U.S. Income Tax Return for Estates and Trusts",
    dueDate: "15th day of 4th month after year end",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  
  // Additional forms commonly used
  {
    id: "4562",
    name: "Form 4562",
    description: "Depreciation and Amortization",
    dueDate: "With tax return",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "8829",
    name: "Form 8829",
    description: "Expenses for Business Use of Your Home",
    dueDate: "With tax return",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "8949",
    name: "Form 8949",
    description: "Sales and Other Dispositions of Capital Assets",
    dueDate: "April 15, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "stateIT40",
    name: "State IT-40",
    description: "State Income Tax Return",
    dueDate: "April 15, 2024",
    status: "ready",
    completed: true,
    aiGenerated: true
  }
];

// Complete list of all available tax forms for reference
export const allTaxForms = [
  // Individual Tax Forms
  { id: "1040", name: "U.S. Individual Income Tax Return", category: "individual" },
  { id: "1040-sr", name: "Tax Return for Seniors", category: "individual" },
  { id: "1040-x", name: "Amended U.S. Individual Income Tax Return", category: "individual" },
  { id: "1040-es", name: "Estimated Tax for Individuals", category: "individual" },
  { id: "1040-nr", name: "U.S. Nonresident Alien Income Tax Return", category: "individual" },
  { id: "1040-v", name: "Payment Voucher for Form 1040", category: "individual" },
  { id: "1040-pr", name: "Self-Employment Tax Return for Puerto Rico Residents", category: "individual" },
  { id: "1040-ss", name: "U.S. Self-Employment Tax Return for U.S. Territories", category: "individual" },
  { id: "scheduleA", name: "Itemized Deductions", category: "individual" },
  { id: "scheduleB", name: "Interest and Ordinary Dividends", category: "individual" },
  { id: "scheduleC", name: "Profit or Loss from Business (Sole Proprietorship)", category: "individual" },
  { id: "scheduleD", name: "Capital Gains and Losses", category: "individual" },
  { id: "scheduleE", name: "Supplemental Income and Loss", category: "individual" },
  { id: "scheduleF", name: "Profit or Loss from Farming", category: "individual" },
  { id: "scheduleH", name: "Household Employment Taxes", category: "individual" },
  { id: "scheduleSE", name: "Self-Employment Tax", category: "individual" },
  { id: "schedule8812", name: "Credits for Qualifying Children and Other Dependents", category: "individual" },
  { id: "2106", name: "Employee Business Expenses", category: "individual" },
  { id: "2441", name: "Child and Dependent Care Expenses", category: "individual" },
  { id: "4562", name: "Depreciation and Amortization", category: "individual" },
  { id: "5329", name: "Additional Taxes on Qualified Retirement Plans (including IRAs)", category: "individual" },
  { id: "8889", name: "Health Savings Accounts (HSAs)", category: "individual" },
  { id: "8917", name: "Tuition and Fees Deduction", category: "individual" },
  { id: "8962", name: "Premium Tax Credit", category: "individual" },
  { id: "8965", name: "Health Coverage Exemptions", category: "individual" },
  
  // Business Tax Forms
  { id: "1120", name: "U.S. Corporation Income Tax Return", category: "business" },
  { id: "1120-s", name: "U.S. Income Tax Return for an S Corporation", category: "business" },
  { id: "1120-x", name: "Amended U.S. Corporation Income Tax Return", category: "business" },
  { id: "1065", name: "U.S. Return of Partnership Income", category: "business" },
  { id: "990", name: "Return of Organization Exempt from Income Tax", category: "business" },
  { id: "990-ez", name: "Short Form Return of Organization Exempt from Income Tax", category: "business" },
  { id: "990-n", name: "Electronic Notice for Tax-Exempt Organizations", category: "business" },
  { id: "941", name: "Employer's Quarterly Federal Tax Return", category: "business" },
  { id: "943", name: "Employer's Annual Federal Tax Return for Agricultural Employees", category: "business" },
  { id: "944", name: "Employer's Annual Federal Tax Return", category: "business" },
  { id: "945", name: "Annual Return of Withheld Federal Income Tax", category: "business" },
  { id: "w-2", name: "Wage and Tax Statement", category: "business" },
  { id: "w-3", name: "Transmittal of Wage and Tax Statements", category: "business" },
  { id: "ss-4", name: "Application for Employer Identification Number (EIN)", category: "business" },
  { id: "8832", name: "Entity Classification Election", category: "business" },
  { id: "2553", name: "Election by a Small Business Corporation", category: "business" },
  { id: "1045", name: "Application for Tentative Refund", category: "business" },
  { id: "4563", name: "Exclusion of Income for Bona Fide Residents of U.S. Possessions", category: "business" },
  { id: "4797", name: "Sales of Business Property", category: "business" },
  { id: "5471", name: "Information Return of U.S. Persons with Foreign Corporations", category: "business" },
  { id: "6251", name: "Alternative Minimum Tax (AMT) for Corporations", category: "business" },
  { id: "8300", name: "Report of Cash Payments Over $10,000 Received in a Trade or Business", category: "business" },
  { id: "8825", name: "Rental Real Estate Income and Expenses of a Partnership or S Corporation", category: "business" },
  { id: "8858", name: "Information Return of U.S. Persons with Respect to Foreign Disregarded Entities", category: "business" },
  { id: "8865", name: "Return of U.S. Persons with Respect to Certain Foreign Partnerships", category: "business" },
  
  // 1099 Series
  { id: "1099-nec", name: "Non-Employee Compensation", category: "1099-series" },
  { id: "1099-misc", name: "Miscellaneous Income", category: "1099-series" },
  { id: "1099-k", name: "Payment Card and Third-Party Network Transactions", category: "1099-series" },
  { id: "1099-int", name: "Interest Income", category: "1099-series" },
  { id: "1099-div", name: "Dividends and Distributions", category: "1099-series" },
  { id: "1099-r", name: "Distributions from Pensions, Annuities, IRAs, etc.", category: "1099-series" },
  { id: "1099-g", name: "Certain Government Payments", category: "1099-series" },
  { id: "1099-b", name: "Proceeds from Broker and Barter Exchange Transactions", category: "1099-series" },
  { id: "1099-c", name: "Cancellation of Debt", category: "1099-series" },
  { id: "1099-sa", name: "Distributions from an HSA", category: "1099-series" },
  { id: "1099-q", name: "Payments from Qualified Education Programs", category: "1099-series" },
  { id: "1099-oid", name: "Original Issue Discount", category: "1099-series" },
  { id: "1099-patr", name: "Taxable Distributions Received from Cooperatives", category: "1099-series" },
  { id: "1099-ltc", name: "Long-Term Care and Accelerated Death Benefits", category: "1099-series" },
  { id: "1099-h", name: "Health Coverage Tax Credit Advance Payments", category: "1099-series" },
  
  // Payroll & Employment
  { id: "w-4", name: "Employee's Withholding Certificate", category: "payroll" },
  { id: "i-9", name: "Employment Eligibility Verification", category: "payroll" },
  { id: "940", name: "Employer's Annual Federal Unemployment (FUTA) Tax Return", category: "payroll" },
  { id: "1095-a", name: "Health Insurance Marketplace Statement", category: "payroll" },
  { id: "1095-b", name: "Health Coverage", category: "payroll" },
  { id: "1095-c", name: "Employer-Provided Health Insurance Offer and Coverage", category: "payroll" },
  { id: "8829", name: "Expenses for Business Use of Your Home", category: "payroll" },
  { id: "5500", name: "Annual Return/Report of Employee Benefit Plan", category: "payroll" },
  { id: "8027", name: "Employer's Annual Information Return of Tip Income", category: "payroll" },
  { id: "w-9", name: "Request for Taxpayer Identification Number (TIN) and Certification", category: "payroll" },
  { id: "ss-8", name: "Determination of Worker Status for Purposes of Federal Employment Taxes", category: "payroll" },
  
  // Estate, Gift, and Trust
  { id: "706", name: "Estate Tax Return", category: "estate" },
  { id: "709", name: "Gift Tax Return", category: "estate" },
  { id: "1041", name: "U.S. Income Tax Return for Estates and Trusts", category: "estate" },
  { id: "1041-qft", name: "U.S. Income Tax Return for Qualified Funeral Trusts", category: "estate" },
  { id: "3520", name: "Annual Return to Report Transactions with Foreign Trusts", category: "estate" },
  
  // Other Common Forms
  { id: "8949", name: "Sales and Other Dispositions of Capital Assets", category: "other" },
  { id: "stateIT40", name: "State Income Tax Return", category: "other" }
];
