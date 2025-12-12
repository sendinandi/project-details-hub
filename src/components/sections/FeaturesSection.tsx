import { Card, CardContent } from "@/components/ui/card";
import { Camera, ShoppingBag, MapPin, Gift, BookOpen, Users } from "lucide-react";
import aiScanFeature from "@/assets/ai-scan-feature.png";
import marketplaceFeature from "@/assets/marketplace-feature.png";
import mapFeature from "@/assets/map-feature.png";
import rewardsFeature from "@/assets/rewards-feature.png";

const mainFeatures = [
  {
    icon: Camera,
    title: "AI Waste Detector",
    description: "Upload a photo of any waste item and our AI instantly identifies its type and provides recycling instructions.",
    image: aiScanFeature,
    color: "bg-primary",
  },
  {
    icon: ShoppingBag,
    title: "Eco Marketplace",
    description: "Shop sustainable products from verified eco-friendly partners. Every purchase supports green businesses.",
    image: marketplaceFeature,
    color: "bg-accent",
  },
  {
    icon: MapPin,
    title: "Recycle Map",
    description: "Find nearby waste banks, recycling centers, and drop-off points with our interactive map.",
    image: mapFeature,
    color: "bg-leaf",
  },
  {
    icon: Gift,
    title: "Points & Rewards",
    description: "Earn points for every recycling action. Redeem for vouchers, plant trees, or donate to causes you care about.",
    image: rewardsFeature,
    color: "bg-coral",
  },
];

const additionalFeatures = [
  {
    icon: BookOpen,
    title: "Edu-Corner",
    description: "Learn zero waste tips, tutorials, and environmental news from experts.",
  },
  {
    icon: Users,
    title: "Partner Program",
    description: "Join as a seller or recycling partner to reach eco-conscious customers.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
            Everything You Need for a
            <span className="text-primary"> Sustainable Lifestyle</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            RecycleBud combines AI technology with gamification to make recycling fun, 
            rewarding, and accessible for everyone.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {mainFeatures.map((feature, index) => (
            <Card
              key={feature.title}
              variant="feature"
              className="group overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Image */}
                  <div className="lg:w-1/2 p-6 flex items-center justify-center bg-muted/50">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full max-w-[280px] h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 gap-6">
          {additionalFeatures.map((feature) => (
            <Card key={feature.title} variant="gradient" className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
