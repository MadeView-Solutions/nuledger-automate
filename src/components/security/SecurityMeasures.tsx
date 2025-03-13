
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Lock, 
  FileCheck, 
  ShieldAlert, 
  Key, 
  Users, 
  CheckCircle, 
  FileText,
  Fingerprint,
  Database,
  AlertTriangle
} from "lucide-react";

const SecurityMeasures = () => {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center">
              Security & Compliance Measures
              <Badge variant="outline" className="ml-2 bg-green-50 dark:bg-green-950">
                <Shield className="h-3 w-3 mr-1" />
                Enterprise-Grade
              </Badge>
            </CardTitle>
            <CardDescription>
              Comprehensive protection for your sensitive financial data
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="data-security" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="data-security">Data Security</TabsTrigger>
            <TabsTrigger value="compliance">Regulatory Compliance</TabsTrigger>
            <TabsTrigger value="fraud">Fraud Prevention</TabsTrigger>
          </TabsList>

          {/* Data Security & Encryption Tab */}
          <TabsContent value="data-security" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">End-to-end Encryption</h3>
                  <p className="text-sm text-muted-foreground">
                    AES-256 encryption for all financial data, both in transit and at rest.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Secure API Integrations</h3>
                  <p className="text-sm text-muted-foreground">
                    OAuth 2.0 & TLS 1.2+ for secure connections with banking platforms.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Data Isolation</h3>
                  <p className="text-sm text-muted-foreground">
                    Tenant isolation ensures your financial data never intermingles with other accounts.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Fingerprint className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Biometric Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Supports fingerprint and facial recognition for enhanced login security.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Security Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">ISO 27001</Badge>
                <Badge variant="secondary">FIPS 140-2</Badge>
                <Badge variant="secondary">PCI DSS</Badge>
                <Badge variant="secondary">NIST 800-53</Badge>
              </div>
            </div>
          </TabsContent>

          {/* Regulatory Compliance Tab */}
          <TabsContent value="compliance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                  <FileCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">SOC 2 Compliance</h3>
                  <p className="text-sm text-muted-foreground">
                    Independently audited security controls and policies.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">GDPR & CCPA Compliance</h3>
                  <p className="text-sm text-muted-foreground">
                    Full compliance with global data protection regulations.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">AI Audit Logs</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive logging of all system activities for audit purposes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Real-time Compliance Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatic monitoring of financial regulations and tax laws.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium mb-2">Compliance Documentation</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Badge className="justify-center py-1.5" variant="outline">HIPAA</Badge>
                <Badge className="justify-center py-1.5" variant="outline">GDPR</Badge>
                <Badge className="justify-center py-1.5" variant="outline">CCPA</Badge>
                <Badge className="justify-center py-1.5" variant="outline">SOX</Badge>
              </div>
            </div>
          </TabsContent>

          {/* Fraud Prevention Tab */}
          <TabsContent value="fraud" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                  <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">AI-driven Anomaly Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    ML algorithms detect unusual financial patterns and potential fraud.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                  <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Multi-factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Enhanced security with MFA for all account access.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                  <Users className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Role-based Access Control</h3>
                  <p className="text-sm text-muted-foreground">
                    Granular permissions limit data access to authorized personnel only.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">24/7 Security Monitoring</h3>
                  <p className="text-sm text-muted-foreground">
                    Constant surveillance of system activities and access attempts.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Last Security Assessment
              </h3>
              <p className="text-sm text-muted-foreground">
                System-wide security assessment completed on {new Date().toLocaleDateString()}. 
                No vulnerabilities detected.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3 text-sm text-muted-foreground">
        <Shield className="h-4 w-4 mr-2" />
        Enterprise-grade security and compliance measures protecting your financial data
      </CardFooter>
    </Card>
  );
};

export default SecurityMeasures;
