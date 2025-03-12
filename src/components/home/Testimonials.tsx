
import React from "react";
import Container from "@/components/ui/Container";
import { Star } from "lucide-react";

const testimonials = [
  {
    content:
      "NuLedger has completely transformed our financial operations. The AI-powered automation has saved us countless hours on manual data entry and reconciliation.",
    author: "Sarah Johnson",
    role: "CFO, TechStart Inc.",
    rating: 5,
    company: "TechStart Inc.",
  },
  {
    content:
      "As a freelancer, keeping track of finances was always my biggest challenge. NuLedger has simplified everything from invoicing to tax preparation.",
    author: "Michael Chen",
    role: "Independent Designer",
    rating: 5,
    company: "Self-employed",
  },
  {
    content:
      "The forecasting tools have given us unprecedented visibility into our cash flow. We can now make more informed decisions based on predictive analytics.",
    author: "Emma Rodriguez",
    role: "Financial Director",
    rating: 5,
    company: "Global Retail Partners",
  },
  {
    content:
      "Setting up NuLedger was surprisingly easy, and their customer support team has been exceptional. I'm now spending less time on bookkeeping and more time growing my business.",
    author: "David Williams",
    role: "Small Business Owner",
    rating: 5,
    company: "Urban Cafe Chain",
  },
  {
    content:
      "The automated tax compliance feature alone is worth the investment. We're now confident that we're always meeting our tax obligations correctly and on time.",
    author: "Priya Patel",
    role: "Head of Accounting",
    rating: 5,
    company: "Innovate Solutions",
  },
  {
    content:
      "NuLedger's integration capabilities are impressive. It seamlessly connects with all our existing tools, creating a unified financial ecosystem.",
    author: "Thomas Anderson",
    role: "IT Director",
    rating: 5,
    company: "Enterprise Systems",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="section-padding">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Trusted by Businesses Worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            See why thousands of businesses and freelancers rely on NuLedger for their financial automation needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-nuledger-500 text-nuledger-500" />
                ))}
              </div>
              <blockquote className="text-foreground mb-6">
                "{testimonial.content}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                  {testimonial.author.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
