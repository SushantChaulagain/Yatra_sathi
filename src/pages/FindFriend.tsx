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
  Filter,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { profileStorage, UserProfile } from "@/lib/profileStorage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FindFriend = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [ageGroupFilter, setAgeGroupFilter] = useState("all");
  const [sortByCompatibility, setSortByCompatibility] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [trekkers, setTrekkers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

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
      
      // Get other users' profiles
      const otherProfiles = profileStorage.getOtherProfiles(session.user.id);
      setTrekkers(otherProfiles);
      
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

  // Compatibility calculation functions
  const calculateExperienceCompatibility = (user1: any, user2: any) => {
    const experienceMap = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 };
    const diff = Math.abs(experienceMap[user1.experience] - experienceMap[user2.experience]);
    return Math.max(0, 1 - diff / 2); // 0 to 1 scale
  };

  const calculateAgeCompatibility = (user1: any, user2: any) => {
    const ageDiff = Math.abs(user1.age - user2.age);
    return Math.max(0, 1 - ageDiff / 20); // Normalize age difference
  };

  const calculateLocationCompatibility = (user1: any, user2: any) => {
    // Simple distance mapping (in a real app, you'd use actual coordinates)
    const locationMap = {
      "Kathmandu": { x: 0, y: 0 },
      "Pokhara": { x: 200, y: 0 },
      "Chitwan": { x: 100, y: -150 },
      "Lalitpur": { x: 10, y: 10 },
      "Biratnagar": { x: 300, y: 200 }
    };
    
    const loc1 = locationMap[user1.location] || { x: 0, y: 0 };
    const loc2 = locationMap[user2.location] || { x: 0, y: 0 };
    const distance = Math.sqrt(Math.pow(loc1.x - loc2.x, 2) + Math.pow(loc1.y - loc2.y, 2));
    return Math.max(0, 1 - distance / 400); // Normalize distance
  };

  const calculateInterestOverlap = (user1: any, user2: any) => {
    const interests1 = user1.interests || [];
    const interests2 = user2.interests || [];
    const intersection = interests1.filter(interest => interests2.includes(interest));
    const union = [...new Set([...interests1, ...interests2])];
    return union.length > 0 ? intersection.length / union.length : 0;
  };

  const calculateLanguageCompatibility = (user1: any, user2: any) => {
    const langs1 = user1.languages || [];
    const langs2 = user2.languages || [];
    const commonLangs = langs1.filter(lang => langs2.includes(lang));
    return commonLangs.length > 0 ? 1 : 0; // Binary: can communicate or not
  };

  const calculateAvailabilityOverlap = (user1: any, user2: any) => {
    // Simple month matching (in a real app, you'd parse actual dates)
    const extractMonth = (availability: string) => availability.split(' ')[0];
    return extractMonth(user1.availability) === extractMonth(user2.availability) ? 1 : 0.3;
  };

  // Main weighted compatibility score algorithm
  const calculateCompatibilityScore = (user1: any, user2: any) => {
    const weights = {
      experience: 0.30,
      age: 0.20,
      location: 0.20,
      interests: 0.15,
      language: 0.10,
      availability: 0.05
    };

    const scores = {
      experience: calculateExperienceCompatibility(user1, user2),
      age: calculateAgeCompatibility(user1, user2),
      location: calculateLocationCompatibility(user1, user2),
      interests: calculateInterestOverlap(user1, user2),
      language: calculateLanguageCompatibility(user1, user2),
      availability: calculateAvailabilityOverlap(user1, user2)
    };

    // Calculate weighted sum
    const totalScore = Object.keys(weights).reduce((sum, factor) => {
      return sum + (weights[factor] * scores[factor]);
    }, 0);

    return {
      totalScore: Math.round(totalScore * 100), // Convert to percentage
      breakdown: scores
    };
  };



  const filteredTrekkers = trekkers
    .filter(trekker => {
      const matchesSearch = trekker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trekker.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trekker.nextTrek.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesExperience = experienceFilter === "all" || trekker.experience.toLowerCase() === experienceFilter;
      const matchesLocation = locationFilter === "all" || trekker.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesAge = ageGroupFilter === "all" || 
                        (ageGroupFilter === "20s" && trekker.age >= 20 && trekker.age < 30) ||
                        (ageGroupFilter === "30s" && trekker.age >= 30 && trekker.age < 40) ||
                        (ageGroupFilter === "40s" && trekker.age >= 40 && trekker.age < 50);
      
      return matchesSearch && matchesExperience && matchesLocation && matchesAge;
    })
    .map(trekker => {
      // Add compatibility score to each trekker
      const compatibilityData = currentUserProfile 
        ? calculateCompatibilityScore(currentUserProfile, trekker)
        : { totalScore: 0, breakdown: {} };
      return {
        ...trekker,
        compatibilityScore: compatibilityData.totalScore,
        compatibilityBreakdown: compatibilityData.breakdown
      };
    })
    .sort((a, b) => {
      // Sort by compatibility score if enabled, otherwise keep original order
      if (sortByCompatibility) {
        return b.compatibilityScore - a.compatibilityScore;
      }
      return 0;
    });

  const getExperienceColor = (experience: string) => {
    switch (experience.toLowerCase()) {
      case "beginner": return "bg-green-100 text-green-800 border-green-200";
      case "intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
                Connect with fellow adventurers and find the perfect trekking companions for your next journey
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Join the Community
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Mountain className="mr-2 h-5 w-5" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, location, or trek..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              
              <div className="flex flex-wrap gap-4 items-center">
                <Filter className="h-4 w-4 text-muted-foreground" />
                
                <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    <SelectItem value="kathmandu">Kathmandu</SelectItem>
                    <SelectItem value="pokhara">Pokhara</SelectItem>
                    <SelectItem value="chitwan">Chitwan</SelectItem>
                    <SelectItem value="lalitpur">Lalitpur</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={ageGroupFilter} onValueChange={setAgeGroupFilter}>
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ages</SelectItem>
                    <SelectItem value="20s">20s</SelectItem>
                    <SelectItem value="30s">30s</SelectItem>
                    <SelectItem value="40s">40+</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant={sortByCompatibility ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortByCompatibility(!sortByCompatibility)}
                  className="flex items-center gap-2"
                >
                  <Star className="h-4 w-4" />
                  {sortByCompatibility ? "Compatibility ✓" : "Sort by Match"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trekker Profiles */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrekkers.map((trekker) => (
                <Card key={trekker.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getExperienceColor(trekker.experience)}>
                            {trekker.experience}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {trekker.rating}
                          </div>
                        </div>
                        {sortByCompatibility && (
                          <div className="mt-2 p-2 bg-primary/10 rounded-lg">
                            <div className="flex items-center gap-2 text-sm">
                              <Star className="h-3 w-3 text-primary" />
                              <span className="font-medium text-primary">
                                {trekker.compatibilityScore}% Match
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Based on experience, age, location, interests
                            </div>
                          </div>
                        )}
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
              ))}
            </div>
            
            {filteredTrekkers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No trekkers found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-12">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">1. Search & Filter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Use our filters to find trekkers based on experience level, location, age, and trek preferences.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">2. Connect & Chat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Send messages to potential trek partners and discuss your plans, expectations, and compatibility.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mountain className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">3. Trek Together</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Plan your adventure together and create unforgettable memories on Nepal's most beautiful trails.
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