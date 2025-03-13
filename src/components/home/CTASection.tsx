
import React from "react";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 bg-primary/5" id="contact">
      <Container>
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-primary-foreground p-10 md:p-16">
          <div className="max-w-3xl relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to modernize your accounting workflow?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Join thousands of businesses that trust NuLedger for their
              financial management. Get started today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-primary font-medium"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                Contact Sales
              </Button>
            </div>
          </div>
          
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="pattern"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="20" cy="20" r="2" fill="white" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTASection;
