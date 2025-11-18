import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar, ArrowRight, Mountain } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Layered mountain background with Nepal-inspired gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--mountain-shadow))] via-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--mountain-purple))]" />

      {/* Sunrise/sunset glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--golden-amber))]/20 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[hsl(var(--mountain-purple))]/40 via-transparent to-transparent" />

      {/* Mountain silhouette layers - creating depth */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Distant mountains */}
        <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-[hsl(var(--mountain-shadow))]/60 via-[hsl(var(--mountain-purple))]/30 to-transparent opacity-40"
             style={{ clipPath: "polygon(0 100%, 0 70%, 15% 60%, 25% 75%, 40% 55%, 55% 65%, 70% 50%, 85% 60%, 100% 45%, 100% 100%)" }} />

        {/* Mid-range mountains */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[hsl(var(--mountain-shadow))]/80 via-[hsl(var(--himalayan-deep-blue))]/50 to-transparent opacity-60"
             style={{ clipPath: "polygon(0 100%, 0 80%, 20% 65%, 35% 55%, 50% 45%, 65% 55%, 80% 60%, 100% 50%, 100% 100%)" }} />

        {/* Foreground mountains */}
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[hsl(var(--mountain-shadow))] via-[hsl(var(--mountain-shadow))]/90 to-transparent"
             style={{ clipPath: "polygon(0 100%, 0 85%, 10% 75%, 25% 60%, 40% 70%, 60% 50%, 75% 65%, 90% 55%, 100% 60%, 100% 100%)" }} />
      </div>

      {/* Prayer flags decoration */}
      <div className="absolute top-16 left-0 right-0 flex justify-center gap-4 opacity-30">
        <div className="w-8 h-12 bg-[hsl(var(--prayer-flag-blue))] transform rotate-3 animate-pulse" style={{ animationDuration: "3s" }} />
        <div className="w-8 h-12 bg-[hsl(var(--snow-white))] transform -rotate-2 animate-pulse" style={{ animationDuration: "3.5s", animationDelay: "0.5s" }} />
        <div className="w-8 h-12 bg-[hsl(var(--prayer-flag-red))] transform rotate-1 animate-pulse" style={{ animationDuration: "3.2s", animationDelay: "1s" }} />
        <div className="w-8 h-12 bg-[hsl(var(--forest-green))] transform -rotate-3 animate-pulse" style={{ animationDuration: "3.8s", animationDelay: "1.5s" }} />
        <div className="w-8 h-12 bg-[hsl(var(--prayer-flag-yellow))] transform rotate-2 animate-pulse" style={{ animationDuration: "3.3s", animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center pt-20 pb-32">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8">
            <Mountain className="h-4 w-4 text-[hsl(var(--golden-amber))]" />
            <span className="text-white/90 text-sm font-medium">Your Gateway to the Himalayas</span>
          </div>

          {/* Main heading with improved typography */}
          <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-8 leading-[1.1] tracking-tight">
            Discover
            <span className="block bg-gradient-to-r from-[hsl(var(--golden-amber))] via-[hsl(var(--prayer-flag-yellow))] to-[hsl(var(--terracotta))] bg-clip-text text-transparent drop-shadow-lg">
              Nepal's Peaks
            </span>
          </h1>

          {/* Subtitle with better spacing */}
          <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            Join fellow adventurers on epic Himalayan treks. Experience the majesty of the world's highest mountains with expert guides and a passionate community.
          </p>

          {/* CTA Buttons with enhanced styling */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[hsl(var(--golden-amber))] to-[hsl(var(--terracotta))] hover:shadow-2xl hover:shadow-[hsl(var(--golden-amber))]/50 text-white font-bold px-10 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              className="bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white font-semibold px-10 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105"
              onClick={() => window.location.href = '/treks'}
            >
              Explore Treks
            </Button>
          </div>

          {/* Feature highlights with enhanced design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(var(--golden-amber))] to-[hsl(var(--terracotta))] flex items-center justify-center shadow-lg">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <span className="font-semibold text-white text-lg">Expert Guides</span>
              <p className="text-white/70 text-sm">Certified mountain professionals</p>
            </div>

            <div className="flex flex-col items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(var(--himalayan-sky))] to-[hsl(var(--prayer-flag-blue))] flex items-center justify-center shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
              <span className="font-semibold text-white text-lg">Vibrant Community</span>
              <p className="text-white/70 text-sm">Connect with fellow trekkers</p>
            </div>

            <div className="flex flex-col items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(var(--forest-green))] to-[hsl(var(--pine-green))] flex items-center justify-center shadow-lg">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <span className="font-semibold text-white text-lg">Year-Round Treks</span>
              <p className="text-white/70 text-sm">Adventures for every season</p>
            </div>
          </div>
        </div>
      </div>

      {/* Animated snow particles */}
      <div className="absolute top-1/4 left-[10%] w-2 h-2 bg-white/60 rounded-full opacity-60 animate-pulse" style={{ animationDuration: "2s" }} />
      <div className="absolute top-1/3 right-[15%] w-3 h-3 bg-white/40 rounded-full opacity-40 animate-pulse" style={{ animationDuration: "3s", animationDelay: "1s" }} />
      <div className="absolute top-[45%] left-[20%] w-2 h-2 bg-[hsl(var(--golden-amber))]/50 rounded-full opacity-50 animate-pulse" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
      <div className="absolute top-[35%] right-[25%] w-2 h-2 bg-white/50 rounded-full opacity-50 animate-pulse" style={{ animationDuration: "3.5s", animationDelay: "1.5s" }} />
    </section>
  );
};

export default HeroSection;