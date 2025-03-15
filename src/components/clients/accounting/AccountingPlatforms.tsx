
import QuickbooksLogo from "@/components/integrations/logos/QuickbooksLogo";
import QuickBooksDesktopLogo from "@/components/integrations/logos/QuickBooksDesktopLogo";
import XeroLogo from "@/components/integrations/logos/XeroLogo";
import SageLogo from "@/components/integrations/logos/SageLogo";
import FreshbooksLogo from "@/components/integrations/logos/FreshbooksLogo";
import WaveLogo from "@/components/integrations/logos/WaveLogo";
import ZohoLogo from "@/components/integrations/logos/ZohoLogo";
import { AccountingPlatform } from "./AccountingPlatformTypes";

// Define available accounting platforms
export const accountingPlatforms: AccountingPlatform[] = [
  { id: "quickbooks", name: "QuickBooks Online", logo: QuickbooksLogo, available: true },
  { id: "quickbooks-desktop", name: "QuickBooks Desktop", logo: QuickBooksDesktopLogo, available: false },
  { id: "xero", name: "Xero", logo: XeroLogo, available: false },
  { id: "sage", name: "Sage", logo: SageLogo, available: false },
  { id: "freshbooks", name: "FreshBooks", logo: FreshbooksLogo, available: false },
  { id: "wave", name: "Wave", logo: WaveLogo, available: false },
  { id: "zoho", name: "Zoho Books", logo: ZohoLogo, available: false },
];
