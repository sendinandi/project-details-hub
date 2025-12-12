import { Camera, Sparkles, Gift, Leaf } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "Scan Your Waste",
    description: "Take a photo of any waste item using our app. The AI will instantly identify what it is.",
    color: "bg-primary",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Get Smart Recommendations",
    description: "Receive personalized recycling instructions and tips on how to properly dispose of or reuse the item.",
    color: "bg-accent",
  },
  {
    number: "03",
    icon: Gift,
    title: "Earn Points",
    description: "Complete recycling actions to earn points. Track your progress and climb the eco-leaderboard.",
    color: "bg-coral",
  },
  {
    number: "04",
    icon: Leaf,
    title: "Redeem Rewards",
    description: "Exchange points for vouchers, plant trees, or donate to environmental causes.",
    color: "bg-leaf",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
            Start Your <span className="text-primary">Green Journey</span> in 4 Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground">
            Making sustainable choices has never been easier. Let RecycleBud guide you every step of the way.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative group"
              >
                {/* Card */}
                <div className="bg-card rounded-3xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-bold">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-primary-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
