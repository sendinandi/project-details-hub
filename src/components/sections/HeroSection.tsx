import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Leaf, Recycle } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Beautiful green forest representing sustainable environment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/80" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 animate-float stagger-1">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-sm flex items-center justify-center">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="absolute top-1/3 right-20 animate-float stagger-2">
          <div className="w-12 h-12 rounded-xl bg-accent/20 backdrop-blur-sm flex items-center justify-center">
            <Recycle className="w-6 h-6 text-accent" />
          </div>
        </div>
        <div className="absolute bottom-1/3 left-1/4 animate-float stagger-3">
          <div className="w-10 h-10 rounded-lg bg-leaf-light/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-leaf-light" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 mb-8 animate-slide-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary-foreground">
              AI-Powered Zero Waste Companion
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-primary-foreground mb-6 animate-slide-up stagger-1">
            Transform Waste Into
            <span className="block text-primary mt-2">Positive Impact</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 animate-slide-up stagger-2">
            Scan, learn, and earn rewards while contributing to a cleaner planet. 
            RecycleBud uses AI to guide your sustainable journey.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-3">
            <Button variant="hero" size="lg" asChild>
              <Link to="/register">
                Start Recycling
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/scan">
                Try AI Scanner
                <Sparkles className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-slide-up stagger-4">
            {[
              { value: "50K+", label: "Active Users" },
              { value: "1M+", label: "Waste Scanned" },
              { value: "500+", label: "Partner Shops" },
              { value: "10K", label: "Trees Planted" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20"
              >
                <div className="text-2xl sm:text-3xl font-heading font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
