
import { Invoice } from "@/types/invoice";

// Mock invoices data
export const invoices: Invoice[] = [
  {
    id: "INV-001",
    client: "Acme Corp",
    amount: 1250.00,
    date: "2023-06-15",
    dueDate: "2023-06-30",
    status: "paid",
    aiGenerated: true,
  },
  {
    id: "INV-002",
    client: "Globex Inc",
    amount: 3450.75,
    date: "2023-06-12",
    dueDate: "2023-06-27",
    status: "pending",
    aiGenerated: true,
  },
  {
    id: "INV-003",
    client: "Stark Industries",
    amount: 7800.50,
    date: "2023-06-10",
    dueDate: "2023-06-25",
    status: "overdue",
    aiGenerated: false,
  },
  {
    id: "INV-004",
    client: "Wayne Enterprises",
    amount: 4500.00,
    date: "2023-06-05",
    dueDate: "2023-06-20",
    status: "paid",
    aiGenerated: true,
  },
  {
    id: "INV-005",
    client: "Oscorp",
    amount: 2100.25,
    date: "2023-06-01",
    dueDate: "2023-06-16",
    status: "pending",
    aiGenerated: false,
  },
];
