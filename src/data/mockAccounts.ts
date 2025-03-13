
import { Account } from "@/types/account";

// Mock connected accounts data
export const connectedAccounts: Account[] = [
  {
    id: "acc1",
    name: "Business Checking",
    type: "bank",
    provider: "Chase Bank",
    status: "connected",
    lastSync: "2023-06-10T14:30:00",
    balance: 24532.67
  },
  {
    id: "acc2",
    name: "Business Savings",
    type: "bank",
    provider: "Chase Bank",
    status: "connected",
    lastSync: "2023-06-10T14:30:00",
    balance: 52750.80
  },
  {
    id: "acc3",
    name: "Corporate Card",
    type: "card",
    provider: "American Express",
    status: "connected",
    lastSync: "2023-06-09T10:15:00",
    balance: -3245.19
  },
  {
    id: "acc4",
    name: "Stripe",
    type: "payment",
    provider: "Stripe",
    status: "connected",
    lastSync: "2023-06-08T18:45:00",
    balance: 8976.42
  },
  {
    id: "acc5",
    name: "PayPal Business",
    type: "payment",
    provider: "PayPal",
    status: "error",
    lastSync: "2023-06-05T09:20:00",
    balance: 1253.89
  },
  {
    id: "acc6",
    name: "Investment Account",
    type: "investment",
    provider: "Vanguard",
    status: "pending",
    lastSync: null,
    balance: 0
  }
];
