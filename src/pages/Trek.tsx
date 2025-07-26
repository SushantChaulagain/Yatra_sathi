import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mountain, Clock, MapPin, DollarSign, Calendar, Star, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Trek = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // Mock trek data
  const treks = [
    {
      id: 1,
      name: "Annapurna Base Camp Trek",
      location: "Kaski, Gandaki Province",
      difficulty: "Medium",
      duration: "12-15 days",
      budget: "NPR 35,000 - 50,000",
      season: "March-May, Sep-Nov",
      image: "photo-1469474968028-56623f02e42d",
      rating: 4.8,
      description: "A classic trek offering stunning views of Annapurna massif and diverse landscapes.",
      route: "Pokhara → Ghandruk → Chomrong → Annapurna Base Camp"
    },
    {
      id: 2,
      name: "Everest Base Camp Trek",
      location: "Solukhumbu, Koshi Province",
      difficulty: "Hard",
      duration: "16-18 days",
      budget: "NPR 60,000 - 80,000",
      season: "March-May, Sep-Nov",
      image: "photo-1458668383970-8ddd3927deed",
      rating: 4.9,
      description: "The ultimate trekking adventure to the base of the world's highest mountain.",
      route: "Lukla → Namche → Tengboche → Lobuche → Everest Base Camp"
    },
    {
      id: 3,
      name: "Gokyo Lakes Trek",
      location: "Solukhumbu, Koshi Province",
      difficulty: "Medium",
      duration: "12-14 days",
      budget: "NPR 45,000 - 65,000",
      season: "March-May, Oct-Nov",
      image: "photo-1506744038136-46273834b3fb",
      rating: 4.7,
      description: "Beautiful turquoise lakes and panoramic mountain views from Gokyo Ri.",
      route: "Lukla → Namche → Dole → Gokyo → Gokyo Ri"
    },
    {
      id: 4,
      name: "Langtang Valley Trek",
      location: "Rasuwa, Bagmati Province",
      difficulty: "Easy",
      duration: "7-10 days",
      budget: "NPR 25,000 - 35,000",
      season: "March-May, Sep-Nov",
      image: "photo-1501854140801-50d01698950b",
      rating: 4.6,
      description: "A peaceful trek through traditional Tamang villages and beautiful rhododendron forests.",
      route: "Syabrubesi → Langtang Village → Kyanjin Gompa"
    },
    {
      id: 5,
      name: "Manaslu Circuit Trek",
      location: "Gorkha, Gandaki Province",
      difficulty: "Hard",
      duration: "14-16 days",
      budget: "NPR 55,000 - 75,000",
      season: "March-May, Sep-Nov",
      image: "photo-1615729947596-a598e5de0ab3",
      rating: 4.8,
      description: "Off-the-beaten-path trek around the eighth highest mountain in the world.",
      route: "Soti Khola → Samagaon → Larkya La Pass → Dharapani"
    },
    {
      id: 6,
      name: "Poon Hill Trek",
      location: "Kaski, Gandaki Province",
      difficulty: "Easy",
      duration: "3-5 days",
      budget: "NPR 15,000 - 25,000",
      season: "Year-round",
      image: "photo-1426604966848-d7adac402bff",
      rating: 4.5,
      description: "Perfect for beginners, offering spectacular sunrise views over the Himalayas.",
      route: "Nayapul → Ghorepani → Poon Hill → Tadapani"
    }
  ];

  const filteredTreks = treks.filter(trek => {
    const matchesSearch = trek.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trek.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || trek.difficulty.toLowerCase() === difficultyFilter;
    const matchesBudget = budgetFilter === "all" || 
                         (budgetFilter === "low" && trek.budget.includes("15,000") || trek.budget.includes("25,000")) ||
                         (budgetFilter === "medium" && trek.budget.includes("35,000") || trek.budget.includes("45,000")) ||
                         (budgetFilter === "high" && trek.budget.includes("60,000") || trek.budget.includes("75,000"));
    const matchesLocation = locationFilter === "all" || trek.location.includes(locationFilter);
    
    return matchesSearch && matchesDifficulty && matchesBudget && matchesLocation;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary via-secondary to-accent">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Discover Amazing Treks
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Explore the best hiking and trekking routes across Nepal
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Search treks by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Budgets</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Gandaki">Gandaki</SelectItem>
                    <SelectItem value="Koshi">Koshi</SelectItem>
                    <SelectItem value="Bagmati">Bagmati</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Trek Listings */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTreks.map((trek) => (
                <Card key={trek.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-muted">
                    <img
                      src={`https://images.unsplash.com/${trek.image}?w=400&h=200&fit=crop`}
                      alt={trek.name}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 text-white hover:bg-white/20"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {trek.rating}
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{trek.name}</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{trek.location}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{trek.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{trek.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-xs">{trek.season}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{trek.budget}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={getDifficultyColor(trek.difficulty)}>
                        {trek.difficulty}
                      </Badge>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredTreks.length === 0 && (
              <div className="text-center py-12">
                <Mountain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No treks found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Trek;