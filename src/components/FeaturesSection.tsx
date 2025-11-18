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
    <section className="py-32 bg-gradient-to-b from-background via-[hsl(var(--muted))] to-background relative overflow-hidden">
      {/* Mountain backdrop illustration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-0 left-0 right-0 h-96"
             style={{ clipPath: "polygon(0 100%, 0 60%, 10% 50%, 20% 65%, 35% 45%, 50% 55%, 65% 40%, 80% 50%, 90% 45%, 100% 55%, 100% 100%)" }}>
          <div className="h-full bg-gradient-to-t from-[hsl(var(--himalayan-deep-blue))] to-transparent" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with journey metaphor */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[hsl(var(--golden-amber))]" />
            <Badge
              variant="outline"
              className="text-[hsl(var(--himalayan-deep-blue))] border-[hsl(var(--himalayan-deep-blue))]/30 bg-[hsl(var(--himalayan-sky))]/10 px-6 py-2.5 text-sm font-bold uppercase tracking-wider"
            >
              Your Journey to the Peaks
            </Badge>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[hsl(var(--golden-amber))]" />
          </div>
          <h2 className="text-6xl md:text-7xl font-extrabold text-foreground mb-8 tracking-tight leading-tight">
            What Makes Us
            <span className="block mt-2 bg-gradient-to-r from-[hsl(var(--himalayan-deep-blue))] via-[hsl(var(--forest-green))] to-[hsl(var(--golden-amber))] bg-clip-text text-transparent">
              Different
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Every great trek begins with the right companion. Here's why thousands trust us with their Himalayan dreams.
          </p>
        </div>

        {/* Journey-style features with asymmetric layout */}
        <div className="max-w-7xl mx-auto mb-32">
          {/* Trail path connector - visual element */}
          <div className="hidden lg:block absolute left-1/2 top-[400px] h-[1000px] w-1 -translate-x-1/2">
            <div className="h-full w-full bg-gradient-to-b from-[hsl(var(--golden-amber))]/30 via-[hsl(var(--himalayan-deep-blue))]/30 to-[hsl(var(--forest-green))]/30 rounded-full" />
          </div>

          <div className="space-y-20">
            {/* Feature 1 - Left aligned */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <div className="flex-1 lg:text-right">
                <div className="inline-flex lg:float-right items-center gap-3 mb-4">
                  <Badge className="bg-[hsl(var(--golden-amber))]/10 text-[hsl(var(--terracotta))] border-[hsl(var(--golden-amber))]/30 font-bold text-xs">
                    {features[0].badge}
                  </Badge>
                </div>
                <h3 className="text-4xl font-extrabold text-foreground mb-4 clear-both">
                  {features[0].title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg lg:ml-auto">
                  {features[0].description}
                </p>
              </div>
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[hsl(var(--golden-amber))] to-[hsl(var(--terracotta))] flex items-center justify-center shadow-2xl shadow-[hsl(var(--golden-amber))]/20 rotate-6 hover:rotate-0 transition-transform duration-500">
                  <Mountain className="h-14 w-14 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[hsl(var(--prayer-flag-yellow))] animate-pulse" />
              </div>
              <div className="flex-1 lg:opacity-0" />
            </div>

            {/* Feature 2 - Right aligned */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
              <div className="flex-1 lg:text-left">
                <div className="inline-flex items-center gap-3 mb-4">
                  <Badge className="bg-[hsl(var(--himalayan-sky))]/10 text-[hsl(var(--himalayan-deep-blue))] border-[hsl(var(--himalayan-sky))]/30 font-bold text-xs">
                    {features[1].badge}
                  </Badge>
                </div>
                <h3 className="text-4xl font-extrabold text-foreground mb-4">
                  {features[1].title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  {features[1].description}
                </p>
              </div>
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--himalayan-sky))] flex items-center justify-center shadow-2xl shadow-[hsl(var(--himalayan-deep-blue))]/20 -rotate-6 hover:rotate-0 transition-transform duration-500">
                  <Users className="h-14 w-14 text-white" />
                </div>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[hsl(var(--prayer-flag-blue))] animate-pulse" style={{ animationDelay: "0.5s" }} />
              </div>
              <div className="flex-1 lg:opacity-0" />
            </div>

            {/* Feature 3 - Left aligned */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <div className="flex-1 lg:text-right">
                <div className="inline-flex lg:float-right items-center gap-3 mb-4">
                  <Badge className="bg-[hsl(var(--terracotta))]/10 text-[hsl(var(--clay-red))] border-[hsl(var(--terracotta))]/30 font-bold text-xs">
                    {features[2].badge}
                  </Badge>
                </div>
                <h3 className="text-4xl font-extrabold text-foreground mb-4 clear-both">
                  {features[2].title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg lg:ml-auto">
                  {features[2].description}
                </p>
              </div>
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[hsl(var(--terracotta))] to-[hsl(var(--clay-red))] flex items-center justify-center shadow-2xl shadow-[hsl(var(--terracotta))]/20 rotate-6 hover:rotate-0 transition-transform duration-500">
                  <Shield className="h-14 w-14 text-white" />
                </div>
                <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-[hsl(var(--prayer-flag-red))] animate-pulse" style={{ animationDelay: "1s" }} />
              </div>
              <div className="flex-1 lg:opacity-0" />
            </div>

            {/* Feature 4 - Right aligned */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
              <div className="flex-1 lg:text-left">
                <div className="inline-flex items-center gap-3 mb-4">
                  <Badge className="bg-[hsl(var(--forest-green))]/10 text-[hsl(var(--pine-green))] border-[hsl(var(--forest-green))]/30 font-bold text-xs">
                    {features[3].badge}
                  </Badge>
                </div>
                <h3 className="text-4xl font-extrabold text-foreground mb-4">
                  {features[3].title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  {features[3].description}
                </p>
              </div>
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[hsl(var(--forest-green))] to-[hsl(var(--pine-green))] flex items-center justify-center shadow-2xl shadow-[hsl(var(--forest-green))]/20 -rotate-6 hover:rotate-0 transition-transform duration-500">
                  <Camera className="h-14 w-14 text-white" />
                </div>
                <div className="absolute -bottom-3 -left-3 w-8 h-8 rounded-full bg-[hsl(var(--forest-green))] animate-pulse" style={{ animationDelay: "1.5s" }} />
              </div>
              <div className="flex-1 lg:opacity-0" />
            </div>

            {/* Feature 5 - Left aligned */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <div className="flex-1 lg:text-right">
                <div className="inline-flex lg:float-right items-center gap-3 mb-4">
                  <Badge className="bg-[hsl(var(--burgundy))]/10 text-[hsl(var(--burgundy))] border-[hsl(var(--burgundy))]/30 font-bold text-xs">
                    {features[4].badge}
                  </Badge>
                </div>
                <h3 className="text-4xl font-extrabold text-foreground mb-4 clear-both">
                  {features[4].title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg lg:ml-auto">
                  {features[4].description}
                </p>
              </div>
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[hsl(var(--burgundy))] to-[hsl(var(--earth-brown))] flex items-center justify-center shadow-2xl shadow-[hsl(var(--burgundy))]/20 rotate-6 hover:rotate-0 transition-transform duration-500">
                  <MapPin className="h-14 w-14 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[hsl(var(--terracotta))] animate-pulse" style={{ animationDelay: "2s" }} />
              </div>
              <div className="flex-1 lg:opacity-0" />
            </div>

            {/* Feature 6 - Right aligned */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
              <div className="flex-1 lg:text-left">
                <div className="inline-flex items-center gap-3 mb-4">
                  <Badge className="bg-[hsl(var(--temple-gold))]/10 text-[hsl(var(--golden-amber))] border-[hsl(var(--temple-gold))]/30 font-bold text-xs">
                    {features[5].badge}
                  </Badge>
                </div>
                <h3 className="text-4xl font-extrabold text-foreground mb-4">
                  {features[5].title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  {features[5].description}
                </p>
              </div>
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[hsl(var(--temple-gold))] to-[hsl(var(--golden-amber))] flex items-center justify-center shadow-2xl shadow-[hsl(var(--temple-gold))]/20 -rotate-6 hover:rotate-0 transition-transform duration-500">
                  <Calendar className="h-14 w-14 text-white" />
                </div>
                <div className="absolute -bottom-3 -left-3 w-8 h-8 rounded-full bg-[hsl(var(--prayer-flag-yellow))] animate-pulse" style={{ animationDelay: "2.5s" }} />
              </div>
              <div className="flex-1 lg:opacity-0" />
            </div>
          </div>
        </div>

        {/* Summit Stats - Elevation themed */}
        <div className="relative max-w-6xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))]/5 via-[hsl(var(--forest-green))]/5 to-[hsl(var(--golden-amber))]/5 rounded-[2rem] blur-xl" />

          <div className="relative bg-card/50 backdrop-blur-sm border-2 border-[hsl(var(--border))] rounded-[2rem] p-12 overflow-hidden">
            {/* Decorative mountain peaks in background */}
            <div className="absolute top-0 left-0 right-0 h-24 opacity-10"
                 style={{ clipPath: "polygon(0 100%, 10% 40%, 20% 70%, 30% 30%, 45% 60%, 60% 20%, 75% 50%, 85% 35%, 95% 55%, 100% 45%, 100% 100%)" }}>
              <div className="h-full bg-gradient-to-b from-[hsl(var(--himalayan-deep-blue))] to-transparent" />
            </div>

            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-2">Summit Statistics</h3>
              <p className="text-muted-foreground">Numbers that speak for our excellence</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="relative group">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-[hsl(var(--golden-amber))]/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300" />
                    <div className="relative flex flex-col items-center">
                      <Star className="h-10 w-10 text-[hsl(var(--golden-amber))] mb-3" />
                      <span className="text-6xl font-black bg-gradient-to-br from-[hsl(var(--golden-amber))] to-[hsl(var(--terracotta))] bg-clip-text text-transparent">
                        4.9
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[hsl(var(--golden-amber))] uppercase tracking-widest">Elevation</p>
                    <p className="text-sm font-semibold text-muted-foreground">Average Rating</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-[hsl(var(--golden-amber))]/50 to-transparent" />
              </div>

              <div className="relative group">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-[hsl(var(--himalayan-deep-blue))]/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300" />
                    <div className="relative flex flex-col items-center">
                      <Users className="h-10 w-10 text-[hsl(var(--himalayan-deep-blue))] mb-3" />
                      <span className="text-6xl font-black bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--himalayan-sky))] bg-clip-text text-transparent">
                        2.5K+
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[hsl(var(--himalayan-deep-blue))] uppercase tracking-widest">Climbers</p>
                    <p className="text-sm font-semibold text-muted-foreground">Happy Trekkers</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-[hsl(var(--himalayan-deep-blue))]/50 to-transparent" />
              </div>

              <div className="relative group">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-[hsl(var(--forest-green))]/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300" />
                    <div className="relative flex flex-col items-center">
                      <Mountain className="h-10 w-10 text-[hsl(var(--forest-green))] mb-3" />
                      <span className="text-6xl font-black bg-gradient-to-br from-[hsl(var(--forest-green))] to-[hsl(var(--pine-green))] bg-clip-text text-transparent">
                        50+
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[hsl(var(--forest-green))] uppercase tracking-widest">Routes</p>
                    <p className="text-sm font-semibold text-muted-foreground">Trek Paths</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-[hsl(var(--forest-green))]/50 to-transparent" />
              </div>

              <div className="relative group">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-[hsl(var(--terracotta))]/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300" />
                    <div className="relative flex flex-col items-center">
                      <Heart className="h-10 w-10 text-[hsl(var(--terracotta))] mb-3" />
                      <span className="text-6xl font-black bg-gradient-to-br from-[hsl(var(--terracotta))] to-[hsl(var(--clay-red))] bg-clip-text text-transparent">
                        98%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[hsl(var(--terracotta))] uppercase tracking-widest">Success</p>
                    <p className="text-sm font-semibold text-muted-foreground">Would Recommend</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-[hsl(var(--terracotta))]/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;