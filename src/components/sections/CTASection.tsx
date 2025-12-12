import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Recycle, TreeDeciduous } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-foreground relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-leaf/5 blur-3xl" />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Leaf className="absolute top-20 left-[15%] w-8 h-8 text-primary/20 animate-float" />
        <Recycle className="absolute top-32 right-[20%] w-10 h-10 text-accent/20 animate-float stagger-2" />
        <TreeDeciduous className="absolute bottom-24 left-[25%] w-12 h-12 text-leaf/20 animate-float stagger-3" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-8">
            <Leaf className="w-4 h-4" />
            <span>Join the Movement</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-background mb-6">
            Ready to Make a
            <span className="text-primary"> Difference</span>?
          </h2>

          {/* Description */}
          <p className="text-lg text-background/70 max-w-2xl mx-auto mb-10">
            Join thousands of eco-conscious individuals who are already transforming their waste habits. 
            Start your sustainable journey with RecycleBud today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="border-background/30 text-background hover:bg-background/10 hover:text-background"
              asChild
            >
              <Link to="/marketplace">
                Explore Marketplace
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-12 border-t border-background/10">
            <p className="text-background/50 text-sm mb-6">Trusted by eco-conscious communities</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
              {["Green Indonesia", "EcoWarriors", "Zero Waste ID", "WWF Partner"].map((partner) => (
                <span key={partner} className="text-background font-heading font-semibold">
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
