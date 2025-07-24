import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mountain, 
  Users, 
  Shield, 
  Camera, 
  MapPin, 
  Calendar,
  Star,
  Heart
} from "lucide-react";

const features = [
  {
    icon: Mountain,
    title: "Epic Trekking Routes",
    description: "Discover carefully curated trekking routes from beginner-friendly trails to challenging high-altitude adventures.",
    badge: "Adventure"
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Connect with like-minded adventurers, share experiences, and build lasting friendships on the trails.",
    badge: "Social"
  },
  {
    icon: Shield,
    title: "Safety First",
    description: "All our guides are certified professionals with extensive experience in mountain safety and rescue operations.",
    badge: "Safety"
  },
  {
    icon: Camera,
    title: "Capture Memories",
    description: "Professional photography sessions and guided spots for the most Instagram-worthy mountain views.",
    badge: "Experience"
  },
  {
    icon: MapPin,
    title: "Local Expertise",
    description: "Benefit from deep local knowledge of hidden gems, cultural insights, and authentic mountain experiences.",
    badge: "Culture"
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Choose from regular group departures or customize your own private trek with flexible dates.",
    badge: "Flexibility"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            Why Choose Us
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Adventure Meets
            <span className="text-primary"> Excellence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We combine years of mountain expertise with modern technology to deliver 
            unforgettable trekking experiences that prioritize your safety and enjoyment.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Stats section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-5 w-5 text-accent mr-1" />
              <span className="text-3xl font-bold text-foreground">4.9</span>
            </div>
            <p className="text-muted-foreground">Average Rating</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-primary mr-1" />
              <span className="text-3xl font-bold text-foreground">2500+</span>
            </div>
            <p className="text-muted-foreground">Happy Trekkers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Mountain className="h-5 w-5 text-secondary mr-1" />
              <span className="text-3xl font-bold text-foreground">50+</span>
            </div>
            <p className="text-muted-foreground">Trek Routes</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Heart className="h-5 w-5 text-accent mr-1" />
              <span className="text-3xl font-bold text-foreground">98%</span>
            </div>
            <p className="text-muted-foreground">Would Recommend</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;