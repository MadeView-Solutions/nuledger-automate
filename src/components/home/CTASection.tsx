
import React from "react";
import { Link } from "react-router-dom";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const benefits = [
  "14-day free trial, no credit card required",
  "Full access to all features during trial",
  "Easy setup and onboarding process",
  "Dedicated support during trial period",
  "No commitment, cancel anytime",
];

const CTASection = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-background to-secondary/50">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
          <div className="absolute inset-0 bg-gradient-to-br from-nuledger-500/5 to-nuledger-700/5"></div>
          
          <div className="relative px-6 py-16 sm:px-12 lg:px-16">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Ready to Transform Your Financial Operations?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join thousands of businesses that have streamlined their financial processes with NuLedger. Start your journey today.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Your Free Trial
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Schedule a Demo
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 max-w-3xl mx-auto">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-nuledger-500 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTASection;
