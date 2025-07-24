import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-accent opacity-90" />
      
      {/* Mountain silhouette overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background/80 to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover the
            <span className="block bg-gradient-to-r from-accent to-accent-foreground bg-clip-text text-transparent">
              Himalayas
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect with fellow adventurers, join epic treks, and explore the world's most breathtaking mountains together.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4">
              Explore Treks
            </Button>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-white/90">
              <MapPin className="h-6 w-6 text-accent" />
              <span className="font-medium">Expert Guides</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white/90">
              <Users className="h-6 w-6 text-accent" />
              <span className="font-medium">Trusted Community</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white/90">
              <Calendar className="h-6 w-6 text-accent" />
              <span className="font-medium">Regular Adventures</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-accent rounded-full opacity-60 animate-pulse" />
      <div className="absolute top-40 right-20 w-6 h-6 bg-white/30 rounded-full opacity-40 animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-20 w-8 h-8 bg-accent/50 rounded-full opacity-30 animate-pulse delay-2000" />
    </section>
  );
};

export default HeroSection;