
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Modern Accounting Software for{" "}
            <span className="bg-gradient-to-r from-nuledger-500 to-nuledger-700 text-transparent bg-clip-text">
              Growing Businesses
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your legal accounting operations with AI-powered bookkeeping,
            IOLTA trust accounting, and real-time financial insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="px-8">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Book a Demo
            </Button>
          </div>
        </div>
      </Container>

      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#62abe3_100%)]"></div>
    </section>
  );
};

export default Hero;
