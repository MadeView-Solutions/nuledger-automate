
import React from "react";
import { Link } from "react-router-dom";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-nuledger-500/10 rounded-full blur-3xl opacity-50"></div>
      </div>
      <Container className="relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-muted border border-border mb-6 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-nuledger-500 mr-2"></div>
            <span className="text-xs font-semibold text-nuledger-600">
              AI-Powered Financial Automation
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight balance-text mb-6 animate-fade-up">
            <span className="relative z-10">
              Simplify Your Finances with AI-Driven Automation
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
            NuLedger combines cutting-edge AI with powerful financial tools to automate bookkeeping, invoicing, tax compliance, and financial forecasting—all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Request Demo
              </Button>
            </Link>
          </div>
          <div className="mt-12 relative animate-fade-up" style={{ animationDelay: "300ms" }}>
            <div className="absolute inset-x-0 -top-10 -bottom-10 bg-gradient-to-b from-background via-transparent to-background z-10 pointer-events-none"></div>
            <div className="relative rounded-xl overflow-hidden border border-border shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-nuledger-500/5 to-nuledger-700/5"></div>
              <img 
                src="https://via.placeholder.com/1200x600" 
                alt="NuLedger Dashboard Preview" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
