
import React from "react";
import Container from "@/components/ui/Container";
import { BarChart3, FileText, CreditCard, Lightbulb, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Intelligent Bookkeeping",
    description: "Automatically categorize transactions, reconcile accounts, and maintain accurate financial records with AI-powered precision.",
    icon: BarChart3,
    color: "bg-blue-100 dark:bg-blue-900/20",
    textColor: "text-blue-700 dark:text-blue-400",
  },
  {
    title: "Automated Invoicing",
    description: "Create, send, and track invoices automatically. Set up recurring invoices and receive instant notifications on payment status.",
    icon: FileText,
    color: "bg-purple-100 dark:bg-purple-900/20",
    textColor: "text-purple-700 dark:text-purple-400",
  },
  {
    title: "Smart Payment Processing",
    description: "Process payments securely with built-in payment gateways, and automatically reconcile payments with invoices.",
    icon: CreditCard,
    color: "bg-green-100 dark:bg-green-900/20",
    textColor: "text-green-700 dark:text-green-400",
  },
  {
    title: "Predictive Analytics",
    description: "Gain valuable insights into your financial performance with AI-driven analytics and forecasting tools.",
    icon: Lightbulb,
    color: "bg-amber-100 dark:bg-amber-900/20",
    textColor: "text-amber-700 dark:text-amber-400",
  },
  {
    title: "Trust Accounting",
    description: "IOLTA-compliant trust accounting for law firms with client fund tracking and automated disbursements.",
    icon: ShieldCheck,
    color: "bg-red-100 dark:bg-red-900/20",
    textColor: "text-red-700 dark:text-red-400",
  },
  {
    title: "Real-time Reporting",
    description: "Access customizable financial reports and dashboards that update in real-time for instant insights.",
    icon: Zap,
    color: "bg-teal-100 dark:bg-teal-900/20",
    textColor: "text-teal-700 dark:text-teal-400",
  },
];

const Features = () => {
  return (
    <section id="features" className="section-padding bg-secondary/50">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Powerful Features for Complete Financial Control
          </h2>
          <p className="text-lg text-muted-foreground">
            NuLedger provides a comprehensive suite of tools designed to streamline your financial operations and provide actionable insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="bg-card border border-border rounded-xl p-6 shadow-sm transition-all hover:shadow-md hover:translate-y-[-2px]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div 
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-5",
                  feature.color
                )}
              >
                <feature.icon className={cn("h-6 w-6", feature.textColor)} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Features;
