
import { Client } from "@/types/client";

export const mockClients: Client[] = [
  {
    id: "C001",
    name: "Acme Corporation",
    email: "contact@acmecorp.com",
    phone: "555-123-4567",
    type: "business",
    status: "active",
    taxId: "12-3456789",
    businessName: "Acme Corporation Inc.",
    industry: "Manufacturing",
    address: {
      street: "123 Main Street",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA"
    },
    contacts: [
      {
        name: "John Smith",
        role: "CEO",
        email: "john.smith@acmecorp.com",
        phone: "555-123-4568"
      },
      {
        name: "Jane Doe",
        role: "CFO",
        email: "jane.doe@acmecorp.com",
        phone: "555-123-4569"
      }
    ],
    dateAdded: "2023-01-15",
    accountManager: "David Johnson",
    notes: "Large manufacturing client with quarterly filing requirements",
    tasks: [
      {
        id: "T001",
        title: "Quarterly Tax Filing",
        description: "Prepare and submit Q2 tax forms",
        dueDate: "2023-07-31",
        status: "pending",
        priority: "high"
      },
      {
        id: "T002",
        title: "Financial Statement Review",
        description: "Review Q2 financial statements",
        dueDate: "2023-07-15",
        status: "in-progress",
        priority: "medium"
      }
    ],
    documents: [
      {
        id: "D001",
        name: "2022 Tax Return",
        type: "tax",
        dateUploaded: "2023-03-15",
        size: 2500000,
        url: "/documents/acme-tax-2022.pdf"
      },
      {
        id: "D002",
        name: "Q1 Financial Statements",
        type: "financial",
        dateUploaded: "2023-04-15",
        size: 1800000,
        url: "/documents/acme-q1-financials.xlsx"
      }
    ],
    financialData: {
      yearlyRevenue: 5200000,
      taxRate: 21,
      fiscalYearEnd: "12-31",
      accountingMethod: "accrual",
      accountingPeriods: "quarterly"
    },
    caseInfo: {
      caseNumber: "AC-2023-001",
      caseManager: "Jennifer Martinez",
      dateOfLoss: "2023-01-15",
      dateSettled: "2023-05-20",
      claimAmount: 750000,
      settlementAmount: 625000,
      caseType: "workers-comp",
      opposingParty: "National Insurance Co.",
      opposingCounsel: "Smith & Associates",
      courtJurisdiction: "Los Angeles County",
      statute: "Workers' Compensation"
    }
  },
  {
    id: "C002",
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    phone: "555-987-6543",
    type: "individual",
    status: "active",
    taxId: "987-65-4321",
    address: {
      street: "456 Oak Avenue",
      city: "San Francisco",
      state: "CA",
      zipCode: "94107",
      country: "USA"
    },
    dateAdded: "2023-02-10",
    accountManager: "Michelle Park",
    notes: "Individual client with rental properties",
    tasks: [
      {
        id: "T003",
        title: "Annual Tax Planning",
        description: "Schedule annual tax planning meeting",
        dueDate: "2023-08-15",
        status: "pending",
        priority: "medium"
      }
    ],
    documents: [
      {
        id: "D003",
        name: "2022 Tax Return",
        type: "tax",
        dateUploaded: "2023-04-10",
        size: 1200000,
        url: "/documents/wilson-tax-2022.pdf"
      }
    ],
    financialData: {
      taxRate: 24,
      accountingMethod: "cash"
    },
    caseInfo: {
      caseNumber: "SW-2023-002",
      caseManager: "Robert Chen",
      dateOfLoss: "2022-11-08",
      claimAmount: 125000,
      caseType: "personal-injury",
      opposingParty: "Metro Transit Authority",
      opposingCounsel: "City Legal Department",
      courtJurisdiction: "San Francisco County",
      statute: "Personal Injury"
    }
  },
  {
    id: "C003",
    name: "TechStart Solutions",
    email: "info@techstart.io",
    phone: "555-888-7777",
    type: "business",
    status: "pending",
    taxId: "98-7654321",
    businessName: "TechStart Solutions LLC",
    industry: "Technology",
    address: {
      street: "789 Innovation Way",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      country: "USA"
    },
    contacts: [
      {
        name: "Alex Chen",
        role: "Founder",
        email: "alex@techstart.io",
        phone: "555-888-7778"
      }
    ],
    dateAdded: "2023-06-01",
    accountManager: "David Johnson",
    notes: "New startup requiring full bookkeeping services",
    tasks: [
      {
        id: "T004",
        title: "Setup Accounting Software",
        description: "Configure and setup QuickBooks Online",
        dueDate: "2023-07-10",
        status: "in-progress",
        priority: "high"
      }
    ],
    documents: [
      {
        id: "D004",
        name: "Business Formation Documents",
        type: "legal",
        dateUploaded: "2023-06-05",
        size: 3200000,
        url: "/documents/techstart-formation.pdf"
      }
    ],
    financialData: {
      yearlyRevenue: 750000,
      taxRate: 21,
      fiscalYearEnd: "12-31",
      accountingMethod: "accrual",
      accountingPeriods: "monthly"
    },
    caseInfo: {
      caseNumber: "TS-2023-003",
      caseManager: "David Johnson",
      dateOfLoss: "2023-03-22",
      claimAmount: 85000,
      caseType: "auto-accident",
      opposingParty: "Direct Insurance Group",
      opposingCounsel: "Austin Legal Partners",
      courtJurisdiction: "Travis County",
      statute: "Motor Vehicle Accident"
    }
  },
  {
    id: "C004",
    name: "Green Fields Farms",
    email: "contact@greenfields.com",
    phone: "555-444-3333",
    type: "business",
    status: "active",
    taxId: "45-6789012",
    businessName: "Green Fields Organic Farms Ltd.",
    industry: "Agriculture",
    address: {
      street: "1010 Rural Route",
      city: "Fresno",
      state: "CA",
      zipCode: "93706",
      country: "USA"
    },
    contacts: [
      {
        name: "Robert Green",
        role: "Owner",
        email: "robert@greenfields.com",
        phone: "555-444-3334"
      }
    ],
    dateAdded: "2022-09-15",
    accountManager: "Michelle Park",
    notes: "Seasonal business with agricultural exemptions",
    tasks: [
      {
        id: "T005",
        title: "Agricultural Tax Credits Review",
        description: "Review available tax credits for 2023",
        dueDate: "2023-08-20",
        status: "pending",
        priority: "medium"
      }
    ],
    documents: [
      {
        id: "D005",
        name: "2022 Tax Return",
        type: "tax",
        dateUploaded: "2023-03-25",
        size: 2100000,
        url: "/documents/greenfields-tax-2022.pdf"
      }
    ],
    financialData: {
      yearlyRevenue: 1800000,
      taxRate: 21,
      fiscalYearEnd: "09-30",
      accountingMethod: "cash",
      accountingPeriods: "quarterly"
    }
  },
  {
    id: "C005",
    name: "Michael Johnson",
    email: "michael.johnson@email.com",
    phone: "555-222-1111",
    type: "individual",
    status: "inactive",
    taxId: "123-45-6789",
    address: {
      street: "222 Pine Street",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA"
    },
    dateAdded: "2022-05-10",
    accountManager: "David Johnson",
    notes: "Client temporarily inactive while abroad",
    tasks: [
      {
        id: "T006",
        title: "Follow-up Contact",
        description: "Reach out to check status for upcoming tax season",
        dueDate: "2023-10-15",
        status: "pending",
        priority: "low"
      }
    ],
    documents: [
      {
        id: "D006",
        name: "2022 Tax Return",
        type: "tax",
        dateUploaded: "2023-04-01",
        size: 1500000,
        url: "/documents/johnson-tax-2022.pdf"
      }
    ]
  }
];
