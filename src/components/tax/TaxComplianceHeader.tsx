
import React from "react";
import { Button } from "@/components/ui/button";
import { FileCheck, Upload, Settings, Users, Globe } from "lucide-react";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const TaxComplianceHeader = () => {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">AI-Driven Tax Compliance & Filing</h1>
          <p className="text-muted-foreground mt-1">
            Automated tax preparation, filing, and compliance monitoring
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Tax Settings
          </Button>
          <Button>
            <FileCheck className="h-4 w-4 mr-2" />
            Start New Filing
          </Button>
        </div>
      </div>
      
      <NavigationMenu className="max-w-full w-full justify-start">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300">
              <Users className="h-4 w-4 mr-2" />
              Client Tax Management
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 no-underline outline-none focus:shadow-md"
                      href="#"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium text-blue-700 dark:text-blue-300">
                        Client Tax Portal
                      </div>
                      <p className="text-sm leading-tight text-blue-700/90 dark:text-blue-300/90">
                        Manage individual and business client tax documents, filings, and compliance
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700">
                    <div className="text-sm font-medium leading-none text-blue-700 dark:text-blue-300">Individual Clients</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Tax preparation for personal returns
                    </p>
                  </a>
                </li>
                <li>
                  <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700">
                    <div className="text-sm font-medium leading-none text-blue-700 dark:text-blue-300">Business Clients</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Corporate and business tax filings
                    </p>
                  </a>
                </li>
                <li>
                  <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700">
                    <div className="text-sm font-medium leading-none text-blue-700 dark:text-blue-300">Client Document Management</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Securely store and organize client tax documents
                    </p>
                  </a>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300">
              <Globe className="h-4 w-4 mr-2" />
              International Accounting
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-6 no-underline outline-none focus:shadow-md"
                      href="#"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium text-purple-700 dark:text-purple-300">
                        Global Tax Compliance
                      </div>
                      <p className="text-sm leading-tight text-purple-700/90 dark:text-purple-300/90">
                        Multi-jurisdictional tax management and international regulations compliance
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-purple-50 dark:hover:bg-purple-950 hover:text-purple-700 focus:bg-purple-50 focus:text-purple-700">
                    <div className="text-sm font-medium leading-none text-purple-700 dark:text-purple-300">Foreign Tax Credits</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Manage international tax credits and treaties
                    </p>
                  </a>
                </li>
                <li>
                  <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-purple-50 dark:hover:bg-purple-950 hover:text-purple-700 focus:bg-purple-50 focus:text-purple-700">
                    <div className="text-sm font-medium leading-none text-purple-700 dark:text-purple-300">Currency Translation</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Automatic currency conversion for international accounting
                    </p>
                  </a>
                </li>
                <li>
                  <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-purple-50 dark:hover:bg-purple-950 hover:text-purple-700 focus:bg-purple-50 focus:text-purple-700">
                    <div className="text-sm font-medium leading-none text-purple-700 dark:text-purple-300">Global Compliance</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Stay compliant with international tax regulations
                    </p>
                  </a>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default TaxComplianceHeader;
