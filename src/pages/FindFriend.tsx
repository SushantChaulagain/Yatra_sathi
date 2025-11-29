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
    experience: 0.25,
    availability: 0.15,
    location: 0.10,     // Reduced from 15%
    languages: 0.10,
    age: 0.10          // Increased from 5%
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

      // Get current user's profile (now async!)
      const userProfile = await profileStorage.getCurrentUserProfile(session.user.id);

      if (!userProfile) {
        toast({
          title: "Profile Required",
          description: "Please create your profile first to find trek partners.",
        });
        navigate('/profile');
        return;
      }

      setCurrentUserProfile(userProfile);

      // Update last active timestamp
      await profileStorage.updateLastActive(session.user.id);

      // Get ALL profiles from database (real users only!)
      const allProfiles = await profileStorage.getAllProfiles();
      console.log('📊 Total profiles in database:', allProfiles.length);
      console.log('👤 Current user:', userProfile.name, userProfile.age, 'years old');
      console.log('👥 All real users:', allProfiles.map(p => ({ name: p.name, age: p.age, userId: p.userId })));

      // Calculate compatibility matches using the sophisticated algorithm
      // Generate smart defaults based on user's profile
      const smartPreferences = {
        preferredAgeRange: {
          min: Math.max(18, userProfile.age - 15),
          max: Math.min(70, userProfile.age + 15)
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

      console.log('⚙️ Age range filter:', smartPreferences.preferredAgeRange);

      const compatibilityMatches = matchingAlgorithm.findMatches(
        userProfile,
        allProfiles,
        smartPreferences,
        algorithmWeights
      );

      console.log('✅ Matches found:', compatibilityMatches.length);
      console.log('🎯 Match details:', compatibilityMatches.map(m => ({
        name: m.profile.name,
        score: Math.round(m.compatibilityScore * 100) + '%',
        type: m.matchType
      })));

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
    <div className="min-h-screen bg-gradient-to-b from-background to-[hsl(var(--muted))]">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section - Enhanced with mountain theme */}
        <section className="relative py-24 overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))] via-[hsl(var(--forest-green))] to-[hsl(var(--mountain-purple))]" />

          {/* Animated mountain silhouettes in background */}
          <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
            <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-white/40 to-transparent"
                 style={{ clipPath: "polygon(0 100%, 0 60%, 15% 50%, 30% 65%, 50% 40%, 70% 55%, 85% 45%, 100% 60%, 100% 100%)" }} />
          </div>

          {/* Prayer flags decoration */}
          <div className="absolute top-8 left-0 right-0 flex justify-center gap-2 opacity-20">
            {['--prayer-flag-blue', '--prayer-flag-white', '--prayer-flag-red', '--forest-green', '--prayer-flag-yellow'].map((color, i) => (
              <div key={i} className={`w-4 h-8 bg-[hsl(var(${color}))] transform rotate-${i % 2 ? '1' : '-1'} animate-pulse`}
                   style={{ animationDuration: `${3 + i * 0.3}s`, animationDelay: `${i * 0.5}s` }} />
            ))}
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Icon decoration */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
                  <div className="relative w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border-2 border-white/20">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
                Find Your Trek{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-[hsl(var(--golden-amber))] to-[hsl(var(--terracotta))] bg-clip-text text-transparent">
                    Sathi
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-[hsl(var(--golden-amber))]/30 to-[hsl(var(--terracotta))]/30 blur-lg" />
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/95 mb-4 font-medium leading-relaxed">
                AI-Powered Matching • 6 Compatibility Factors • Perfect Partners
              </p>

              <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                Our smart algorithm analyzes interests, experience, location, timing, languages, and age to find your ideal trekking companion
              </p>

              {/* Stats badges */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <span className="text-white font-bold text-lg">{filteredMatches.length}</span>
                  <span className="text-white/80 ml-2">Compatible Matches</span>
                </div>
                <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <span className="text-white font-bold text-lg">🔥</span>
                  <span className="text-white/80 ml-2">Smart Algorithm</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Search - Enhanced */}
        <section className="py-12 -mt-8 relative z-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="border-2 border-[hsl(var(--himalayan-deep-blue))]/20 bg-white shadow-2xl shadow-[hsl(var(--himalayan-deep-blue))]/10">
                <CardContent className="p-6">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Search className="h-5 w-5 text-[hsl(var(--himalayan-deep-blue))]" />
                    </div>
                    <Input
                      placeholder="Search by name, location, trek destination, or interests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 h-14 text-lg border-2 border-[hsl(var(--border))] focus:border-[hsl(var(--himalayan-deep-blue))] rounded-xl font-medium"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-semibold text-foreground">{filteredMatches.length}</span> compatible matches found
                    </div>
                    <div className="text-muted-foreground">
                      Sorted by compatibility score
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trekker Profiles - Completely Redesigned */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMatches.map((match) => {
                const trekker = match.profile;
                const scorePercent = Math.round(match.compatibilityScore * 100);
                const circumference = 2 * Math.PI * 45; // radius = 45
                const dashOffset = circumference - (scorePercent / 100) * circumference;

                return (
                <Card key={trekker.id} className="group relative overflow-hidden border-2 border-transparent hover:border-[hsl(var(--himalayan-deep-blue))]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[hsl(var(--himalayan-deep-blue))]/20 hover:-translate-y-1">
                  {/* Gradient border effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))]/0 via-[hsl(var(--forest-green))]/0 to-[hsl(var(--golden-amber))]/0 group-hover:from-[hsl(var(--himalayan-deep-blue))]/5 group-hover:via-[hsl(var(--forest-green))]/5 group-hover:to-[hsl(var(--golden-amber))]/5 transition-all duration-300 rounded-lg" />

                  <CardHeader className="pb-4 relative">
                    <div className="flex items-start gap-4">
                      {/* Avatar with status ring */}
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                          <AvatarImage
                            src={`https://images.unsplash.com/${trekker.avatar}?w=100&h=100&fit=crop&crop=face`}
                            alt={trekker.name}
                          />
                          <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] text-white">
                            {trekker.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {/* Compatibility indicator badge */}
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-[hsl(var(--golden-amber))] to-[hsl(var(--terracotta))] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white">
                          {getCompatibilityIcon(match.compatibilityScore)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl font-bold truncate group-hover:text-[hsl(var(--himalayan-deep-blue))] transition-colors">
                          {trekker.name}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[hsl(var(--forest-green))]" />
                          <span className="font-medium">{trekker.location}</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span>{trekker.age} yrs</span>
                        </div>

                        {/* Experience and Match badges */}
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <Badge variant="outline" className={`${getExperienceColor(trekker.experience)} border-2 font-semibold`}>
                            {trekker.experience}
                          </Badge>
                          <Badge variant="outline" className={`${getMatchTypeColor(match.matchType)} border-2 font-semibold`}>
                            {match.matchType.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      {/* Circular Compatibility Score */}
                      <div className="relative flex-shrink-0">
                        <svg className="w-24 h-24 transform -rotate-90">
                          {/* Background circle */}
                          <circle
                            cx="48"
                            cy="48"
                            r="45"
                            stroke="hsl(var(--muted))"
                            strokeWidth="6"
                            fill="none"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="48"
                            cy="48"
                            r="45"
                            stroke={scorePercent >= 85 ? 'hsl(var(--forest-green))' : scorePercent >= 70 ? 'hsl(var(--himalayan-sky))' : scorePercent >= 55 ? 'hsl(var(--golden-amber))' : 'hsl(var(--muted-foreground))'}
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-extrabold text-foreground">{scorePercent}%</span>
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Match</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-5 relative pt-2">
                    {/* Bio */}
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {trekker.bio}
                    </p>

                    {/* Stats Grid - Enhanced */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-[hsl(var(--muted))] group-hover:bg-[hsl(var(--himalayan-sky))]/10 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] flex items-center justify-center flex-shrink-0">
                          <Mountain className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Completed</p>
                          <p className="text-sm font-bold">{trekker.completedTreks} treks</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-[hsl(var(--muted))] group-hover:bg-[hsl(var(--himalayan-sky))]/10 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--golden-amber))] to-[hsl(var(--terracotta))] flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Available</p>
                          <p className="text-xs font-bold">{trekker.availability}</p>
                        </div>
                      </div>
                    </div>

                    {/* Next Trek - Enhanced */}
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(var(--himalayan-sky))]/10 to-[hsl(var(--forest-green))]/10 border border-[hsl(var(--himalayan-deep-blue))]/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Mountain className="h-3.5 w-3.5 text-[hsl(var(--himalayan-deep-blue))]" />
                        <p className="text-xs font-semibold text-[hsl(var(--himalayan-deep-blue))] uppercase tracking-wide">Next Trek</p>
                      </div>
                      <p className="text-sm font-bold text-foreground">{trekker.nextTrek}</p>
                    </div>

                    {/* Interests - Enhanced with icons */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Interests</p>
                      <div className="flex flex-wrap gap-1.5">
                        {trekker.interests.slice(0, 3).map((interest, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs font-medium bg-[hsl(var(--muted))] hover:bg-[hsl(var(--himalayan-sky))]/20 transition-colors">
                            {interest}
                          </Badge>
                        ))}
                        {trekker.interests.length > 3 && (
                          <Badge variant="secondary" className="text-xs font-bold bg-[hsl(var(--golden-amber))]/10 text-[hsl(var(--golden-amber))]">
                            +{trekker.interests.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-muted-foreground font-semibold">🗣️</div>
                      <p className="text-xs text-muted-foreground font-medium">
                        {trekker.languages.join(" • ")}
                      </p>
                    </div>

                    {/* Why you match - Enhanced */}
                    {match.reasoning.length > 0 && (
                      <div className="pt-3 border-t border-dashed border-[hsl(var(--border))]">
                        <div className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-[hsl(var(--golden-amber))] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-[hsl(var(--himalayan-deep-blue))] mb-1">Why you match</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {match.reasoning[0]}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons - Enhanced */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] hover:shadow-lg hover:shadow-[hsl(var(--himalayan-deep-blue))]/30 text-white font-bold transition-all duration-300 hover:scale-[1.02]"
                      >
                        <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                        Message
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-2 border-[hsl(var(--himalayan-deep-blue))]/30 hover:bg-[hsl(var(--himalayan-sky))]/10 hover:border-[hsl(var(--himalayan-deep-blue))] font-semibold transition-all"
                      >
                        <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
            
            {filteredMatches.length === 0 && (
              <Card className="max-w-2xl mx-auto border-2 border-dashed border-[hsl(var(--border))]">
                <CardContent className="text-center py-16">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-[hsl(var(--himalayan-sky))]/20 blur-3xl rounded-full" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))]/10 to-[hsl(var(--forest-green))]/10 rounded-3xl flex items-center justify-center mx-auto">
                      <Users className="h-12 w-12 text-[hsl(var(--himalayan-deep-blue))]" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">No Matches Found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                    {searchTerm
                      ? "Try adjusting your search terms or filters to discover more trekking partners."
                      : "Our smart algorithm is working to find the best matches for you. Check back soon or complete your profile to improve match quality."
                    }
                  </p>
                  {searchTerm && (
                    <Button
                      onClick={() => setSearchTerm("")}
                      variant="outline"
                      className="border-2 border-[hsl(var(--himalayan-deep-blue))]/30 hover:bg-[hsl(var(--himalayan-sky))]/10"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Clear Search
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* How Our Algorithm Works - Completely Redesigned */}
        <section className="relative py-24 overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--muted))] via-[hsl(var(--himalayan-sky))]/5 to-[hsl(var(--forest-green))]/5" />

          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-[hsl(var(--himalayan-deep-blue))]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[hsl(var(--forest-green))]/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            {/* Header */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[hsl(var(--himalayan-deep-blue))]/10 to-[hsl(var(--forest-green))]/10 border border-[hsl(var(--himalayan-deep-blue))]/20 mb-6">
                <Star className="h-4 w-4 text-[hsl(var(--golden-amber))]" />
                <span className="text-sm font-bold text-[hsl(var(--himalayan-deep-blue))]">AI-POWERED MATCHING</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] bg-clip-text text-transparent">
                How We Find Your Perfect Trek Partner
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our sophisticated algorithm analyzes <span className="font-bold text-foreground">6 key compatibility factors</span> to match you with trekkers who share your passion and pace
              </p>
            </div>

            {/* Algorithm Flow - Creative Asymmetric Layout */}
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Step 1 - Left aligned */}
              <div className="flex flex-col md:flex-row items-center gap-8 group">
                <div className="md:w-5/12 order-2 md:order-1">
                  <Card className="border-2 border-[hsl(var(--himalayan-deep-blue))]/20 bg-white shadow-xl group-hover:shadow-2xl group-hover:shadow-[hsl(var(--himalayan-deep-blue))]/10 transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          1
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-3 text-[hsl(var(--himalayan-deep-blue))]">Data Collection</h3>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            We gather comprehensive information from your profile including interests, experience level, location, availability, languages, and age preferences.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-[hsl(var(--himalayan-sky))]/20 text-[hsl(var(--himalayan-deep-blue))] border-[hsl(var(--himalayan-deep-blue))]/20">Interests</Badge>
                            <Badge className="bg-[hsl(var(--himalayan-sky))]/20 text-[hsl(var(--himalayan-deep-blue))] border-[hsl(var(--himalayan-deep-blue))]/20">Experience</Badge>
                            <Badge className="bg-[hsl(var(--himalayan-sky))]/20 text-[hsl(var(--himalayan-deep-blue))] border-[hsl(var(--himalayan-deep-blue))]/20">Location</Badge>
                            <Badge className="bg-[hsl(var(--himalayan-sky))]/20 text-[hsl(var(--himalayan-deep-blue))] border-[hsl(var(--himalayan-deep-blue))]/20">+3 more</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="md:w-2/12 order-1 md:order-2 flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))]/20 to-[hsl(var(--forest-green))]/20 flex items-center justify-center backdrop-blur-sm border-2 border-[hsl(var(--himalayan-deep-blue))]/30 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-12 w-12 text-[hsl(var(--himalayan-deep-blue))]" />
                    </div>
                  </div>
                </div>
                <div className="md:w-5/12 order-3"></div>
              </div>

              {/* Connector Line */}
              <div className="flex justify-center">
                <div className="w-1 h-12 bg-gradient-to-b from-[hsl(var(--himalayan-deep-blue))]/30 to-transparent rounded-full"></div>
              </div>

              {/* Step 2 - Right aligned */}
              <div className="flex flex-col md:flex-row items-center gap-8 group">
                <div className="md:w-5/12 order-3 md:order-1"></div>
                <div className="md:w-2/12 order-1 md:order-2 flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[hsl(var(--golden-amber))]/20 to-[hsl(var(--terracotta))]/20 flex items-center justify-center backdrop-blur-sm border-2 border-[hsl(var(--golden-amber))]/30 group-hover:scale-110 transition-transform duration-300">
                      <Star className="h-12 w-12 text-[hsl(var(--golden-amber))]" />
                    </div>
                  </div>
                </div>
                <div className="md:w-5/12 order-2 md:order-3">
                  <Card className="border-2 border-[hsl(var(--golden-amber))]/20 bg-white shadow-xl group-hover:shadow-2xl group-hover:shadow-[hsl(var(--golden-amber))]/10 transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--golden-amber))] to-[hsl(var(--terracotta))] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          2
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-3 text-[hsl(var(--golden-amber))]">Smart Analysis</h3>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            Our algorithm calculates compatibility scores using weighted factors, Jaccard similarity for interests, and intelligent filters to find the best matches.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-20 text-sm text-muted-foreground">Interests</div>
                              <div className="flex-1 h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[hsl(var(--golden-amber))] to-[hsl(var(--terracotta))] rounded-full" style={{ width: '30%' }}></div>
                              </div>
                              <span className="text-xs font-bold text-[hsl(var(--golden-amber))]">30%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-20 text-sm text-muted-foreground">Experience</div>
                              <div className="flex-1 h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[hsl(var(--golden-amber))] to-[hsl(var(--terracotta))] rounded-full" style={{ width: '25%' }}></div>
                              </div>
                              <span className="text-xs font-bold text-[hsl(var(--golden-amber))]">25%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-20 text-sm text-muted-foreground">Other</div>
                              <div className="flex-1 h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[hsl(var(--golden-amber))] to-[hsl(var(--terracotta))] rounded-full" style={{ width: '45%' }}></div>
                              </div>
                              <span className="text-xs font-bold text-[hsl(var(--golden-amber))]">45%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Connector Line */}
              <div className="flex justify-center">
                <div className="w-1 h-12 bg-gradient-to-b from-[hsl(var(--golden-amber))]/30 to-transparent rounded-full"></div>
              </div>

              {/* Step 3 - Center aligned */}
              <div className="flex justify-center">
                <Card className="border-2 border-[hsl(var(--forest-green))]/20 bg-white shadow-xl hover:shadow-2xl hover:shadow-[hsl(var(--forest-green))]/10 transition-all duration-300 max-w-2xl">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--forest-green))] to-[hsl(var(--himalayan-deep-blue))] mb-6 shadow-lg">
                        <Mountain className="h-8 w-8 text-white" />
                      </div>
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--forest-green))] to-[hsl(var(--himalayan-deep-blue))] text-white font-bold text-xl shadow-lg mb-4">
                        3
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-[hsl(var(--forest-green))]">Perfect Matches Delivered</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        Get ranked results with detailed compatibility breakdowns. Connect with confidence knowing you're matched with partners who share your trekking style and goals.
                      </p>
                      <div className="flex flex-wrap justify-center gap-4">
                        <div className="px-4 py-2 rounded-lg bg-[hsl(var(--forest-green))]/10 border border-[hsl(var(--forest-green))]/20">
                          <div className="text-2xl font-bold text-[hsl(var(--forest-green))]">85%+</div>
                          <div className="text-xs text-muted-foreground">Perfect Match</div>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-[hsl(var(--himalayan-sky))]/10 border border-[hsl(var(--himalayan-sky))]/20">
                          <div className="text-2xl font-bold text-[hsl(var(--himalayan-deep-blue))]">70%+</div>
                          <div className="text-xs text-muted-foreground">Great Match</div>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-[hsl(var(--golden-amber))]/10 border border-[hsl(var(--golden-amber))]/20">
                          <div className="text-2xl font-bold text-[hsl(var(--golden-amber))]">55%+</div>
                          <div className="text-xs text-muted-foreground">Good Match</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Safety & Community Guidelines - Completely Redesigned */}
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-background to-[hsl(var(--muted))]">
          {/* Decorative background patterns */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-72 h-72 border-2 border-[hsl(var(--himalayan-deep-blue))] rounded-full"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 border-2 border-[hsl(var(--forest-green))] rounded-full"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[hsl(var(--terracotta))]/10 to-[hsl(var(--golden-amber))]/10 border border-[hsl(var(--terracotta))]/20 mb-6">
                <div className="w-2 h-2 bg-[hsl(var(--terracotta))] rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-[hsl(var(--terracotta))]">SAFE TREKKING COMMUNITY</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                <span className="bg-gradient-to-r from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] bg-clip-text text-transparent">
                  Trek Safe, Trek Smart
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our community thrives on respect, honesty, and safety. Follow these guidelines for the best trekking experience.
              </p>
            </div>

            {/* Guidelines - Modern Card Layout */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Community Guidelines */}
                <Card className="relative overflow-hidden border-2 border-[hsl(var(--himalayan-deep-blue))]/20 bg-white shadow-xl hover:shadow-2xl hover:shadow-[hsl(var(--himalayan-deep-blue))]/10 transition-all duration-300 group">
                  {/* Gradient accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))]"></div>

                  <CardHeader className="pb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Users className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-[hsl(var(--himalayan-deep-blue))]">Community Guidelines</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Building a respectful community</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4 group/item">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[hsl(var(--himalayan-sky))]/10 flex items-center justify-center group-hover/item:bg-[hsl(var(--himalayan-sky))]/20 transition-colors">
                        <div className="w-2 h-2 bg-[hsl(var(--himalayan-deep-blue))] rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">Be Respectful & Kind</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Treat all community members with respect, kindness, and understanding. Embrace diverse backgrounds and trekking styles.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[hsl(var(--himalayan-sky))]/10 flex items-center justify-center group-hover/item:bg-[hsl(var(--himalayan-sky))]/20 transition-colors">
                        <div className="w-2 h-2 bg-[hsl(var(--himalayan-deep-blue))] rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">Share Accurate Information</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Be honest about your experience level, fitness, and trekking history. Accurate profiles lead to better matches.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[hsl(var(--himalayan-sky))]/10 flex items-center justify-center group-hover/item:bg-[hsl(var(--himalayan-sky))]/20 transition-colors">
                        <div className="w-2 h-2 bg-[hsl(var(--himalayan-deep-blue))] rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">Clear Communication</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Discuss trek expectations, costs, itinerary, and responsibilities clearly before committing to a trek together.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[hsl(var(--himalayan-sky))]/10 flex items-center justify-center group-hover/item:bg-[hsl(var(--himalayan-sky))]/20 transition-colors">
                        <div className="w-2 h-2 bg-[hsl(var(--himalayan-deep-blue))] rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">Leave No Trace</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Respect nature and local communities. Practice responsible trekking and minimize your environmental impact.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Safety First */}
                <Card className="relative overflow-hidden border-2 border-[hsl(var(--terracotta))]/20 bg-white shadow-xl hover:shadow-2xl hover:shadow-[hsl(var(--terracotta))]/10 transition-all duration-300 group">
                  {/* Gradient accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--terracotta))] to-[hsl(var(--golden-amber))]"></div>

                  <CardHeader className="pb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--terracotta))] to-[hsl(var(--golden-amber))] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Mountain className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-[hsl(var(--terracotta))]">Safety First</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Your safety is our priority</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4 group/item">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[hsl(var(--terracotta))]/10 flex items-center justify-center group-hover/item:bg-[hsl(var(--terracotta))]/20 transition-colors">
                        <div className="w-2 h-2 bg-[hsl(var(--terracotta))] rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">Public Meetups First</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Always meet potential trek partners in public places before heading to the mountains. Coffee shops, gear stores, or trekking offices are great options.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[hsl(var(--terracotta))]/10 flex items-center justify-center group-hover/item:bg-[hsl(var(--terracotta))]/20 transition-colors">
                        <div className="w-2 h-2 bg-[hsl(var(--terracotta))] rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">Share Your Plans</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Inform trusted contacts about your trek itinerary, partner details, and expected return date. Register with local authorities when required.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[hsl(var(--terracotta))]/10 flex items-center justify-center group-hover/item:bg-[hsl(var(--terracotta))]/20 transition-colors">
                        <div className="w-2 h-2 bg-[hsl(var(--terracotta))] rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">Trust Your Instincts</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          If something feels off, trust your gut. It's okay to decline or postpone a trek. Your safety and comfort always come first.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[hsl(var(--terracotta))]/10 flex items-center justify-center group-hover/item:bg-[hsl(var(--terracotta))]/20 transition-colors">
                        <div className="w-2 h-2 bg-[hsl(var(--terracotta))] rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">Emergency Preparedness</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Carry emergency contacts, first aid kit, and have a backup plan. Know the nearest medical facilities and rescue protocols.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom CTA Card */}
              <Card className="border-2 border-[hsl(var(--forest-green))]/20 bg-gradient-to-br from-[hsl(var(--himalayan-sky))]/5 to-[hsl(var(--forest-green))]/5 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--forest-green))] to-[hsl(var(--himalayan-deep-blue))] flex items-center justify-center shadow-lg">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-foreground">Need Help or Want to Report an Issue?</h3>
                      <p className="text-muted-foreground">
                        Our support team is here to help. Contact us if you experience any problems or have concerns about community safety.
                      </p>
                    </div>
                    <Button className="flex-shrink-0 bg-gradient-to-r from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] hover:shadow-lg text-white font-bold px-8 py-6 text-lg">
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FindFriend; 