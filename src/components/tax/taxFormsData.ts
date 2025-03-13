
import { TaxForm } from "./types";

export const taxForms: TaxForm[] = [
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
    id: "schedule8812",
    name: "Schedule 8812",
    description: "Credits for Qualifying Children and Other Dependents",
    dueDate: "April 15, 2024",
    status: "not-started",
    completed: false,
    aiGenerated: false
  },
  {
    id: "form8949",
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
