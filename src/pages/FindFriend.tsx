import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { 
  Users, 
  MapPin, 
  Calendar, 
  Star,
  MessageCircle, 
  UserPlus,
  Mountain,
  Clock,
  Search,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { profileStorage, UserProfile } from "@/lib/profileStorage";
import { matchingAlgorithm, MatchResult, MatchingWeights } from "@/lib/matchingAlgorithm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FindFriend = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<any>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  // Keep algorithm weights internal and constant
  const algorithmWeights: MatchingWeights = {
    interests: 0.30,     
    experience: 0.15,     
    location: 0.15,      
    availability: 0.5,  
    languages: 0.10,     
    age: 0.05           
  };

  useEffect(() => {
    checkAuthAndLoadProfiles();
  }, []);

  const checkAuthAndLoadProfiles = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      setUser(session.user);
      
      // Get current user's profile
      const userProfile = profileStorage.getCurrentUserProfile(session.user.id);
      
      if (!userProfile) {
        toast({
          title: "Profile Required",
          description: "Please create your profile first to find trek partners.",
        });
        navigate('/profile');
        return;
      }

      setCurrentUserProfile(userProfile);
      
      // Initialize sample data if no profiles exist
      profileStorage.initializeSampleData();
      
      // Calculate compatibility matches using the sophisticated algorithm
      // Generate smart defaults based on user's profile
      const smartPreferences = {
        preferredAgeRange: { 
          min: Math.max(18, userProfile.age - 10), 
          max: Math.min(70, userProfile.age + 10) 
        },
        preferredExperienceLevels: [userProfile.experience],
        preferredLocations: [userProfile.location],
        dealBreakerInterests: [],
        avoidInterests: [],
        languageImportance: 'medium' as const,
        experienceImportance: 'high' as const,
        locationImportance: 'medium' as const,
        groupSizePreference: 'any' as const,
        budgetRange: 'any' as const
      };

      const compatibilityMatches = matchingAlgorithm.findMatches(
        userProfile,
        profileStorage.getAllProfiles(),
        smartPreferences,
        algorithmWeights
      );
      
      setMatches(compatibilityMatches);
      
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load profiles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter matches based on search term only (algorithm handles the rest)
  const filteredMatches = matches.filter(match => {
    const trekker = match.profile;
    if (!searchTerm) return true;
    
    return trekker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           trekker.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
           trekker.nextTrek.toLowerCase().includes(searchTerm.toLowerCase()) ||
           trekker.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const getExperienceColor = (experience: string) => {
    switch (experience.toLowerCase()) {
      case "beginner": return "bg-green-100 text-green-800 border-green-200";
      case "intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case "perfect": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "great": return "bg-blue-100 text-blue-800 border-blue-200";
      case "good": return "bg-orange-100 text-orange-800 border-orange-200";
      case "possible": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCompatibilityIcon = (score: number) => {
    if (score >= 0.85) return "🔥";
    if (score >= 0.70) return "⭐";
    if (score >= 0.55) return "👍";
    return "🤔";
  };



  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading trek partners...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUserProfile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <Card className="max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Profile Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                You need to create a profile before you can find trek partners.
              </p>
              <Button onClick={() => navigate('/profile')} className="w-full">
                Create Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary via-secondary to-accent">
          <div className="container mx-auto px-4 text-center">
                      <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Find Your Trek Sathi
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Our smart algorithm analyzes compatibility across interests, experience, location, timing, and more to find your perfect trekking partner
            </p>
          </div>
          </div>
        </section>

        {/* Smart Search */}
        <section className="py-8 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center max-w-2xl mx-auto">
              <div className="w-full relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search names, locations, treks, or interests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full h-12 text-lg"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredMatches.length} compatible matches found • Ranked by compatibility
              </div>
            </div>
          </div>
        </section>

        {/* Trekker Profiles */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMatches.map((match) => {
                const trekker = match.profile;
                return (
                <Card key={trekker.id} className="overflow-hidden hover:shadow-lg transition-shadow ring-1 ring-primary/10 hover:ring-primary/30">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage 
                          src={`https://images.unsplash.com/${trekker.avatar}?w=100&h=100&fit=crop&crop=face`}
                          alt={trekker.name}
                        />
                        <AvatarFallback>{trekker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{trekker.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {trekker.location} • Age {trekker.age}
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge className={getExperienceColor(trekker.experience)}>
                            {trekker.experience}
                          </Badge>
                          <Badge className={getMatchTypeColor(match.matchType)}>
                            {getCompatibilityIcon(match.compatibilityScore)} {Math.round(match.compatibilityScore * 100)}% match
                          </Badge>

                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{trekker.bio}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mountain className="h-4 w-4 text-primary" />
                        <span>{trekker.completedTreks} treks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-xs">{trekker.availability}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Next Trek:</p>
                      <Badge variant="outline" className="text-xs">
                        {trekker.nextTrek}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Interests:</p>
                      <div className="flex flex-wrap gap-1">
                        {trekker.interests.slice(0, 2).map((interest, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {trekker.interests.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{trekker.interests.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Languages:</p>
                      <p className="text-xs text-muted-foreground">
                        {trekker.languages.join(", ")}
                      </p>
                    </div>

                    {match.reasoning.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium mb-1 text-primary">Why you match:</p>
                        <p className="text-xs text-muted-foreground">
                          {match.reasoning[0]}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <UserPlus className="h-3 w-3 mr-1" />
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
            
            {filteredMatches.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No matches found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? "Try different search terms to find more trekking partners." 
                    : "Our algorithm is finding the best matches for you. Please refresh the page if no matches appear."
                  }
                </p>
              </div>
            )}
          </div>
        </section>

        {/* How Our Algorithm Works */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Smart Matching Algorithm</h2>
              <p className="text-lg text-muted-foreground mb-12">
                Our AI-powered system analyzes 6 key factors to find your perfect trekking companion
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">1. Compatibility Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      We analyze interests, experience, location, timing, languages, and age to calculate your compatibility score.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">2. Smart Ranking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Our algorithm automatically ranks partners by compatibility, putting the best matches first.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mountain className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">3. Perfect Partnerships</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Connect with highly compatible partners and embark on amazing adventures with confidence.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Safety & Community Guidelines */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Safety & Community Guidelines</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Community Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">Be respectful and kind to all community members</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">Share accurate information about your experience level</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">Communicate clearly about trek expectations and costs</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mountain className="h-5 w-5 text-primary" />
                      Safety First
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">Always meet in public places before trekking</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">Share your trek plans with trusted contacts</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">Trust your instincts and prioritize your safety</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FindFriend; 