import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mountain, Clock, MapPin, DollarSign, Calendar, Star, TrendingUp, Users, Shield, Camera, Info, CheckCircle2, Compass } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface TrekDetail {
  id: number;
  name: string;
  location: string;
  difficulty: string;
  duration: string;
  budget: string;
  season: string;
  image: string;
  rating: number;
  description: string;
  route: string;
  maxAltitude: string;
  trekDistance: string;
  accommodation: string;
  permits: string[];
  highlights: string[];
  itinerary: { day: number; title: string; description: string; }[];
  difficulty_description: string;
  best_time_detail: string;
  what_to_pack: string[];
  fitness_level: string;
}

const Trek = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [selectedTrek, setSelectedTrek] = useState<TrekDetail | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Comprehensive trek data with realistic details
  const treks: TrekDetail[] = [
    {
      id: 1,
      name: "Annapurna Base Camp Trek",
      location: "Kaski, Gandaki Province",
      difficulty: "Medium",
      duration: "12-15 days",
      budget: "NPR 35,000 - 50,000",
      season: "March-May, Sep-Nov",
      image: "/annapurna.jpg",
      rating: 4.8,
      description: "A classic trek offering stunning views of Annapurna massif and diverse landscapes.",
      route: "Pokhara → Ghandruk → Chomrong → Annapurna Base Camp",
      maxAltitude: "4,130m (13,549 ft)",
      trekDistance: "110 km (68 miles)",
      accommodation: "Tea houses and lodges",
      permits: ["ACAP (Annapurna Conservation Area Permit)", "TIMS Card"],
      highlights: [
        "360° panoramic views of Annapurna massif including Annapurna I (8,091m)",
        "Walk through traditional Gurung villages like Ghandruk and Chomrong",
        "Diverse terrain from subtropical forests to alpine meadows",
        "Natural hot springs at Jhinu Danda",
        "Close-up views of Machapuchare (Fishtail) mountain",
        "Experience diverse flora including rhododendron forests"
      ],
      itinerary: [
        { day: 1, title: "Pokhara to Nayapul to Tikhedhunga", description: "Drive to Nayapul and trek through beautiful landscapes to Tikhedhunga (1,540m)" },
        { day: 2, title: "Tikhedhunga to Ghorepani", description: "Climb the stone steps to reach Ghorepani village (2,860m)" },
        { day: 3, title: "Ghorepani to Tadapani via Poon Hill", description: "Early morning hike to Poon Hill for sunrise, then trek to Tadapani (2,630m)" },
        { day: 4, title: "Tadapani to Chhomrong", description: "Trek through rhododendron forests to Chhomrong (2,170m)" },
        { day: 5, title: "Chhomrong to Bamboo", description: "Descend to Chhomrong Khola and climb up to Bamboo (2,310m)" },
        { day: 6, title: "Bamboo to Deurali", description: "Continue through bamboo and rhododendron forests to Deurali (3,230m)" },
        { day: 7, title: "Deurali to Annapurna Base Camp", description: "Trek through Machapuchare Base Camp to reach ABC (4,130m)" },
        { day: 8, title: "ABC to Bamboo", description: "Descend back to Bamboo, enjoying the views" }
      ],
      difficulty_description: "Moderate difficulty requiring good physical fitness. Involves daily walking of 5-7 hours with gradual altitude gain. Some steep sections with stone steps.",
      best_time_detail: "Spring (March-May) offers blooming rhododendrons and clear weather. Autumn (September-November) provides stable weather and excellent visibility.",
      what_to_pack: ["Warm layers including down jacket", "Good quality trekking boots", "Sleeping bag rated to -10°C", "Trekking poles", "Sun protection (sunglasses, hat, sunscreen)", "Water purification tablets", "First aid kit with altitude sickness medication"],
      fitness_level: "Moderate fitness required. Ability to walk 5-7 hours daily with a light backpack. Prior trekking experience helpful but not mandatory."
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
      route: "Lukla → Namche → Tengboche → Lobuche → Everest Base Camp",
      maxAltitude: "5,364m (17,598 ft)",
      trekDistance: "130 km (81 miles)",
      accommodation: "Tea houses and mountain lodges",
      permits: ["Sagarmatha National Park Entry Permit", "Khumbu Pasang Lhamu Rural Municipality Permit"],
      highlights: [
        "Stand at the base of Mount Everest (8,849m), the world's highest peak",
        "Sunrise view from Kala Patthar (5,545m) - best Everest viewpoint",
        "Visit Tengboche Monastery, the spiritual heart of the Khumbu region",
        "Experience Sherpa culture and hospitality in authentic mountain villages",
        "Explore Namche Bazaar, the bustling Sherpa capital",
        "Witness the Khumbu Icefall and surrounding Himalayan giants"
      ],
      itinerary: [
        { day: 1, title: "Fly to Lukla, Trek to Phakding", description: "Thrilling flight to Lukla (2,860m) and trek to Phakding (2,610m)" },
        { day: 2, title: "Phakding to Namche Bazaar", description: "Cross suspension bridges and climb to Namche (3,440m)" },
        { day: 3, title: "Acclimatization Day in Namche", description: "Hike to Everest View Hotel or Khumjung village" },
        { day: 4, title: "Namche to Tengboche", description: "Trek to Tengboche (3,860m), visit famous monastery" },
        { day: 5, title: "Tengboche to Dingboche", description: "Continue to Dingboche (4,410m) with stunning mountain views" },
        { day: 6, title: "Acclimatization in Dingboche", description: "Rest day with optional hike to Nagarjun Hill" },
        { day: 7, title: "Dingboche to Lobuche", description: "Trek past memorials to Lobuche (4,940m)" },
        { day: 8, title: "Lobuche to Gorak Shep to EBC", description: "Trek to Gorak Shep, continue to Everest Base Camp (5,364m)" },
        { day: 9, title: "Hike Kala Patthar, descend to Pheriche", description: "Early morning climb of Kala Patthar (5,545m) for sunrise" }
      ],
      difficulty_description: "Challenging trek requiring excellent fitness and mental determination. High altitude with risk of AMS. Daily 6-8 hours of walking with several steep sections.",
      best_time_detail: "Pre-monsoon (March-May) offers warmer temperatures and rhododendron blooms. Post-monsoon (September-November) provides crystal clear skies and stable weather.",
      what_to_pack: ["4-season sleeping bag", "High-altitude down jacket", "Quality insulated boots", "Altitude sickness medication (Diamox)", "Oxygen saturation monitor", "UV protection gear", "Thermal base layers", "Head torch with extra batteries"],
      fitness_level: "High fitness level essential. Must be able to trek 6-8 hours daily at high altitude. Previous high-altitude trekking experience strongly recommended."
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
      route: "Lukla → Namche → Dole → Gokyo → Gokyo Ri",
      maxAltitude: "5,357m (17,575 ft) at Gokyo Ri",
      trekDistance: "90 km (56 miles)",
      accommodation: "Tea houses and lodges",
      permits: ["Sagarmatha National Park Permit", "Khumbu Pasang Lhamu Permit"],
      highlights: [
        "Six pristine turquoise glacial lakes at Gokyo",
        "Panoramic views from Gokyo Ri including Everest, Lhotse, Makalu, and Cho Oyu",
        "Walk on the Ngozumpa Glacier - Nepal's largest glacier",
        "Less crowded alternative to EBC with equally stunning views",
        "Visit authentic Sherpa villages away from main tourist trails",
        "Optional crossing of Cho La Pass to connect with EBC route"
      ],
      itinerary: [
        { day: 1, title: "Fly to Lukla, Trek to Phakding", description: "Scenic flight and trek to Phakding (2,610m)" },
        { day: 2, title: "Phakding to Namche Bazaar", description: "Classic trek to the Sherpa capital (3,440m)" },
        { day: 3, title: "Acclimatization in Namche", description: "Explore Namche and surrounding villages" },
        { day: 4, title: "Namche to Dole", description: "Trek through forests to Dole (4,200m)" },
        { day: 5, title: "Dole to Machhermo", description: "Continue alongside the valley to Machhermo (4,470m)" },
        { day: 6, title: "Machhermo to Gokyo", description: "Trek past first and second Gokyo Lakes to Gokyo village (4,790m)" },
        { day: 7, title: "Gokyo Ri and Exploration", description: "Early morning climb of Gokyo Ri, explore other lakes" },
        { day: 8, title: "Begin descent via different route", description: "Return journey with varied scenery" }
      ],
      difficulty_description: "Moderate to challenging trek with high altitude. Less technical than EBC but requires good acclimatization. Daily walks of 5-6 hours.",
      best_time_detail: "October-November ideal for crystal clear skies and stable weather. March-May offers spring blooms but afternoon clouds may obscure views.",
      what_to_pack: ["Insulated jacket for high altitude", "Quality trekking boots with ankle support", "Polarized sunglasses for glacier glare", "Camera for stunning lake reflections", "Water purification system", "Warm sleeping bag", "Trekking poles for glacier terrain"],
      fitness_level: "Good fitness level required. Experience with multi-day treks helpful. Must be comfortable with altitude above 4,000m."
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
      route: "Syabrubesi → Langtang Village → Kyanjin Gompa",
      maxAltitude: "4,984m (16,349 ft) at Tserko Ri",
      trekDistance: "65 km (40 miles)",
      accommodation: "Tea houses and family-run lodges",
      permits: ["Langtang National Park Entry Permit", "TIMS Card"],
      highlights: [
        "Trek through Langtang National Park - home to red pandas and Himalayan wildlife",
        "Experience authentic Tamang culture and traditions",
        "Visit ancient Kyanjin Gompa monastery",
        "Stunning views of Langtang Lirung (7,227m) and surrounding peaks",
        "Optional climb to Tserko Ri (4,984m) for panoramic mountain views",
        "Taste local yak cheese at Kyanjin Cheese Factory"
      ],
      itinerary: [
        { day: 1, title: "Kathmandu to Syabrubesi", description: "Scenic 7-8 hour drive through countryside to Syabrubesi (1,550m)" },
        { day: 2, title: "Syabrubesi to Lama Hotel", description: "Trek through subtropical forests to Lama Hotel (2,380m)" },
        { day: 3, title: "Lama Hotel to Langtang Village", description: "Continue through rhododendron forests to Langtang (3,430m)" },
        { day: 4, title: "Langtang to Kyanjin Gompa", description: "Trek to Kyanjin Gompa (3,870m), visit monastery and cheese factory" },
        { day: 5, title: "Acclimatization - Tserko Ri", description: "Optional climb to Tserko Ri for spectacular views" },
        { day: 6, title: "Kyanjin to Lama Hotel", description: "Begin descent back through the valley" },
        { day: 7, title: "Lama Hotel to Syabrubesi", description: "Final trek day back to Syabrubesi" }
      ],
      difficulty_description: "Relatively easy trek suitable for beginners. Gradual altitude gain with well-maintained trails. Daily 4-6 hours of walking.",
      best_time_detail: "Spring (March-May) best for rhododendron blooms and wildlife sightings. Autumn (September-November) offers clear mountain views and pleasant temperatures.",
      what_to_pack: ["Medium-weight sleeping bag", "Light trekking boots", "Rain gear for sudden weather changes", "Binoculars for wildlife watching", "Warm fleece layers", "Basic first aid supplies"],
      fitness_level: "Moderate fitness sufficient. Great first trek in Nepal. Suitable for families with older children."
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
      route: "Soti Khola → Samagaon → Larkya La Pass → Dharapani",
      maxAltitude: "5,106m (16,752 ft) at Larkya La Pass",
      trekDistance: "177 km (110 miles)",
      accommodation: "Basic tea houses and camping",
      permits: ["Manaslu Restricted Area Permit", "Manaslu Conservation Area Permit", "Annapurna Conservation Area Permit"],
      highlights: [
        "Circle the majestic Manaslu (8,163m), 8th highest peak in the world",
        "Cross the challenging Larkya La Pass (5,106m)",
        "Experience authentic Tibetan Buddhist culture in remote villages",
        "Visit ancient monasteries including Mu Gompa and Ribung Gompa",
        "Trek through diverse landscapes from subtropical to alpine",
        "Encounter minimal tourist crowds compared to other major treks"
      ],
      itinerary: [
        { day: 1, title: "Kathmandu to Soti Khola", description: "Long drive to trek starting point (710m)" },
        { day: 2, title: "Soti Khola to Machha Khola", description: "Trek along Budhi Gandaki River (900m)" },
        { day: 3, title: "Machha Khola to Jagat", description: "Continue through gorges and terraced fields (1,410m)" },
        { day: 4, title: "Jagat to Deng", description: "Enter Manaslu Conservation Area (1,804m)" },
        { day: 5, title: "Deng to Namrung", description: "Trek through forests to Namrung (2,660m)" },
        { day: 6, title: "Namrung to Samagaon", description: "Reach Tibetan village of Samagaon (3,530m)" },
        { day: 7, title: "Acclimatization in Samagaon", description: "Explore Pungyen Gompa or hike to Manaslu Base Camp" },
        { day: 8, title: "Samagaon to Samdo", description: "Short trek to Samdo near Tibetan border (3,860m)" },
        { day: 9, title: "Samdo to Dharamsala", description: "Trek to Larkya La base camp (4,460m)" },
        { day: 10, title: "Cross Larkya La Pass to Bimthang", description: "Challenging pass crossing, descend to Bimthang (3,720m)" }
      ],
      difficulty_description: "Challenging trek requiring excellent fitness and prior high-altitude experience. Remote areas with basic facilities. Larkya La Pass crossing can be demanding.",
      best_time_detail: "Best in autumn (September-November) for stable weather and clear views. Spring (March-May) possible but more unpredictable. Restricted area permits required, must trek with registered guide.",
      what_to_pack: ["Expedition-grade sleeping bag", "4-season gear", "Crampons for pass crossing (seasonal)", "Comprehensive first aid kit", "Satellite phone/emergency device", "High-energy snacks", "Water treatment system"],
      fitness_level: "Excellent fitness essential. Prior high-altitude trekking mandatory. Must be self-sufficient and comfortable in remote environments."
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
      route: "Nayapul → Ghorepani → Poon Hill → Tadapani",
      maxAltitude: "3,210m (10,531 ft) at Poon Hill",
      trekDistance: "32 km (20 miles)",
      accommodation: "Comfortable tea houses with good facilities",
      permits: ["ACAP (Annapurna Conservation Area Permit)", "TIMS Card"],
      highlights: [
        "Spectacular sunrise over Annapurna and Dhaulagiri ranges from Poon Hill",
        "Views of 20+ peaks including Annapurna I, Dhaulagiri, Machhapuchhre",
        "Trek through beautiful rhododendron forests (best in spring)",
        "Visit traditional Gurung and Magar villages",
        "Well-established trail with excellent lodge facilities",
        "Perfect introduction trek to the Himalayas"
      ],
      itinerary: [
        { day: 1, title: "Pokhara to Nayapul to Tikhedhunga", description: "Drive to Nayapul, trek to Tikhedhunga (1,540m)" },
        { day: 2, title: "Tikhedhunga to Ghorepani", description: "Climb stone steps through forests to Ghorepani (2,874m)" },
        { day: 3, title: "Poon Hill Sunrise and trek to Tadapani", description: "Pre-dawn hike to Poon Hill (3,210m), trek to Tadapani (2,630m)" },
        { day: 4, title: "Tadapani to Ghandruk", description: "Trek to beautiful Gurung village of Ghandruk (1,940m)" },
        { day: 5, title: "Ghandruk to Nayapul to Pokhara", description: "Final trek to Nayapul, drive back to Pokhara" }
      ],
      difficulty_description: "Easy trek suitable for beginners and families. Well-maintained trails with gradual ascents. Stone step sections require basic fitness.",
      best_time_detail: "Year-round destination. Spring (March-May) for rhododendron blooms. Autumn (September-November) for clearest mountain views. Even winter offers good trekking with snow-capped peaks.",
      what_to_pack: ["Light trekking boots or trail shoes", "Light sleeping bag or liner", "Basic warm layers", "Rain jacket", "Camera for sunrise", "Head torch for early morning Poon Hill hike", "Day pack"],
      fitness_level: "Basic fitness sufficient. Suitable for first-time trekkers, families, and seniors. 3-5 hours walking per day."
    }
  ];

  const filteredTreks = treks.filter(trek => {
    const matchesSearch = trek.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trek.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || trek.difficulty.toLowerCase() === difficultyFilter;
    
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleViewDetails = (trek: TrekDetail) => {
    setSelectedTrek(trek);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section - Redesigned */}
        <section className="relative py-32 overflow-hidden">
          {/* Background with mountain theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))] via-[hsl(var(--mountain-purple))] to-[hsl(var(--mountain-shadow))]" />

          {/* Mountain silhouettes */}
          <div className="absolute bottom-0 left-0 right-0 h-64"
               style={{ clipPath: "polygon(0 100%, 0 75%, 8% 68%, 15% 80%, 25% 65%, 35% 75%, 45% 60%, 55% 70%, 65% 55%, 75% 65%, 85% 50%, 92% 60%, 100% 55%, 100% 100%)" }}>
            <div className="h-full bg-gradient-to-t from-[hsl(var(--mountain-shadow))] to-transparent opacity-60" />
          </div>

          {/* Floating elements */}
          <div className="absolute top-20 left-[10%] w-3 h-3 bg-white/40 rounded-full animate-pulse" />
          <div className="absolute top-32 right-[15%] w-2 h-2 bg-[hsl(var(--golden-amber))]/50 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-32 left-[20%] w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: "2s" }} />

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8">
                <Compass className="h-4 w-4 text-[hsl(var(--golden-amber))]" />
                <span className="text-white/90 text-sm font-medium">Explore Nepal's Best Treks</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                Find Your Next
                <span className="block bg-gradient-to-r from-[hsl(var(--golden-amber))] via-[hsl(var(--prayer-flag-yellow))] to-[hsl(var(--terracotta))] bg-clip-text text-transparent">
                  Adventure
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
                From beginner-friendly trails to challenging high-altitude expeditions, discover the perfect trek for your Himalayan journey
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section - Enhanced */}
        <section className="py-10 bg-gradient-to-b from-[hsl(var(--muted))] to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      placeholder="Search by trek name or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-6 text-lg border-2 border-[hsl(var(--border))] focus:border-[hsl(var(--himalayan-deep-blue))] rounded-xl shadow-sm"
                    />
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="flex gap-4 flex-wrap lg:flex-nowrap">
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="w-48 py-6 text-base border-2 border-[hsl(var(--border))] rounded-xl shadow-sm">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulty Levels</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results count */}
              <div className="mt-6 text-center">
                <p className="text-muted-foreground font-medium">
                  Found <span className="text-[hsl(var(--himalayan-deep-blue))] font-bold">{filteredTreks.length}</span> {filteredTreks.length === 1 ? 'trek' : 'treks'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trek Listings - Redesigned */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredTreks.map((trek, index) => (
                <Card key={trek.id} className="group overflow-hidden border-2 border-[hsl(var(--border))] hover:border-[hsl(var(--himalayan-deep-blue))] hover:shadow-2xl hover:shadow-[hsl(var(--himalayan-deep-blue))]/10 transition-all duration-500 hover:-translate-y-2 rounded-2xl bg-card">
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={
                        trek.image.startsWith('/')
                          ? trek.image
                          : trek.image.startsWith('source.')
                            ? `https://${trek.image}`
                            : `https://images.unsplash.com/${trek.image}?w=500&h=300&fit=crop`
                      }
                      alt={trek.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Favorite button */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm rounded-full h-10 w-10 border border-white/20"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>

                    {/* Rating badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full border border-white/20">
                      <Star className="h-4 w-4 fill-[hsl(var(--golden-amber))] text-[hsl(var(--golden-amber))]" />
                      <span className="font-bold text-sm">{trek.rating}</span>
                    </div>

                    {/* Difficulty badge */}
                    <div className="absolute bottom-3 left-3">
                      <Badge className={`${getDifficultyColor(trek.difficulty)} font-bold text-xs px-3 py-1 border-2`}>
                        {trek.difficulty}
                      </Badge>
                    </div>

                    {/* Max altitude badge */}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[hsl(var(--border))]">
                      <div className="flex items-center gap-1.5">
                        <Mountain className="h-4 w-4 text-[hsl(var(--himalayan-deep-blue))]" />
                        <span className="text-xs font-bold text-foreground">{trek.maxAltitude}</span>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-extrabold group-hover:text-[hsl(var(--himalayan-deep-blue))] transition-colors">
                      {trek.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground mt-2">
                      <MapPin className="h-4 w-4 text-[hsl(var(--terracotta))]" />
                      <span className="text-sm font-medium">{trek.location}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5 pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {trek.description}
                    </p>

                    {/* Trek stats grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[hsl(var(--himalayan-sky))]/10 border border-[hsl(var(--himalayan-sky))]/20">
                        <Clock className="h-5 w-5 text-[hsl(var(--himalayan-deep-blue))] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Duration</p>
                          <p className="text-sm font-bold text-foreground">{trek.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[hsl(var(--forest-green))]/10 border border-[hsl(var(--forest-green))]/20">
                        <Users className="h-5 w-5 text-[hsl(var(--forest-green))] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Distance</p>
                          <p className="text-sm font-bold text-foreground">{trek.trekDistance}</p>
                        </div>
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-[hsl(var(--golden-amber))]/10 border border-[hsl(var(--golden-amber))]/20">
                      <DollarSign className="h-5 w-5 text-[hsl(var(--terracotta))]" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-medium">Budget Range</p>
                        <p className="text-sm font-bold text-foreground">{trek.budget}</p>
                      </div>
                    </div>

                    {/* Best season */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-[hsl(var(--himalayan-deep-blue))]" />
                      <span className="text-muted-foreground font-medium">Best:</span>
                      <span className="text-foreground font-semibold">{trek.season}</span>
                    </div>

                    {/* CTA Button */}
                    <Button
                      className="w-full bg-gradient-to-r from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] hover:shadow-lg hover:shadow-[hsl(var(--himalayan-deep-blue))]/30 text-white font-bold py-6 rounded-xl transition-all duration-300 group-hover:scale-105"
                      onClick={() => handleViewDetails(trek)}
                    >
                      <Info className="mr-2 h-5 w-5" />
                      View Full Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredTreks.length === 0 && (
              <div className="text-center py-20">
                <Mountain className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-bold mb-3 text-foreground">No Treks Found</h3>
                <p className="text-muted-foreground text-lg">Try adjusting your filters or search terms to discover amazing treks</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Detail View Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          {selectedTrek && (
            <div className="relative">
              {/* Hero Image */}
              <div className="relative h-80 overflow-hidden rounded-t-lg">
                <img
                  src={
                    selectedTrek.image.startsWith('/')
                      ? selectedTrek.image
                      : selectedTrek.image.startsWith('source.')
                        ? `https://${selectedTrek.image}`
                        : `https://images.unsplash.com/${selectedTrek.image}?w=1000&h=400&fit=crop`
                  }
                  alt={selectedTrek.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Trek name overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-4xl font-extrabold text-white mb-2">{selectedTrek.name}</h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-white/90">
                      <MapPin className="h-5 w-5" />
                      <span className="font-medium">{selectedTrek.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">
                      <Star className="h-4 w-4 fill-[hsl(var(--golden-amber))] text-[hsl(var(--golden-amber))]" />
                      <span className="font-bold">{selectedTrek.rating}</span>
                    </div>
                    <Badge className={`${getDifficultyColor(selectedTrek.difficulty)} font-bold border-2`}>
                      {selectedTrek.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-[hsl(var(--himalayan-sky))]/10 border border-[hsl(var(--himalayan-sky))]/20">
                    <Mountain className="h-6 w-6 text-[hsl(var(--himalayan-deep-blue))] mb-2" />
                    <p className="text-xs text-muted-foreground font-medium">Max Altitude</p>
                    <p className="text-lg font-bold text-foreground">{selectedTrek.maxAltitude}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[hsl(var(--forest-green))]/10 border border-[hsl(var(--forest-green))]/20">
                    <Clock className="h-6 w-6 text-[hsl(var(--forest-green))] mb-2" />
                    <p className="text-xs text-muted-foreground font-medium">Duration</p>
                    <p className="text-lg font-bold text-foreground">{selectedTrek.duration}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[hsl(var(--terracotta))]/10 border border-[hsl(var(--terracotta))]/20">
                    <Compass className="h-6 w-6 text-[hsl(var(--terracotta))] mb-2" />
                    <p className="text-xs text-muted-foreground font-medium">Distance</p>
                    <p className="text-lg font-bold text-foreground">{selectedTrek.trekDistance}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[hsl(var(--golden-amber))]/10 border border-[hsl(var(--golden-amber))]/20">
                    <DollarSign className="h-6 w-6 text-[hsl(var(--golden-amber))] mb-2" />
                    <p className="text-xs text-muted-foreground font-medium">Budget</p>
                    <p className="text-sm font-bold text-foreground">{selectedTrek.budget}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Overview</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{selectedTrek.description}</p>
                </div>

                {/* Trek Highlights */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Trek Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedTrek.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--forest-green))] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itinerary */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Sample Itinerary</h3>
                  <div className="space-y-3">
                    {selectedTrek.itinerary.map((day) => (
                      <div key={day.day} className="flex gap-4 p-4 rounded-xl border-2 border-[hsl(var(--border))] hover:border-[hsl(var(--himalayan-deep-blue))] transition-colors">
                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] flex items-center justify-center text-white font-bold text-lg">
                          {day.day}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground mb-1">{day.title}</h4>
                          <p className="text-sm text-muted-foreground">{day.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Difficulty & Fitness */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl border-2 border-[hsl(var(--border))] bg-muted/30">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-6 w-6 text-[hsl(var(--himalayan-deep-blue))]" />
                      <h3 className="text-xl font-bold text-foreground">Difficulty</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedTrek.difficulty_description}</p>
                  </div>
                  <div className="p-6 rounded-xl border-2 border-[hsl(var(--border))] bg-muted/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-6 w-6 text-[hsl(var(--forest-green))]" />
                      <h3 className="text-xl font-bold text-foreground">Fitness Level</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedTrek.fitness_level}</p>
                  </div>
                </div>

                {/* Best Time & Accommodation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl border-2 border-[hsl(var(--border))] bg-muted/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-6 w-6 text-[hsl(var(--terracotta))]" />
                      <h3 className="text-xl font-bold text-foreground">Best Time to Trek</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{selectedTrek.best_time_detail}</p>
                    <div className="inline-flex items-center gap-2 bg-[hsl(var(--terracotta))]/10 px-3 py-2 rounded-lg">
                      <span className="text-sm font-bold text-foreground">{selectedTrek.season}</span>
                    </div>
                  </div>
                  <div className="p-6 rounded-xl border-2 border-[hsl(var(--border))] bg-muted/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-6 w-6 text-[hsl(var(--golden-amber))]" />
                      <h3 className="text-xl font-bold text-foreground">Accommodation</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{selectedTrek.accommodation}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-foreground uppercase tracking-wide">Required Permits:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTrek.permits.map((permit, i) => (
                          <Badge key={i} className="bg-[hsl(var(--himalayan-sky))]/10 text-[hsl(var(--himalayan-deep-blue))] border-[hsl(var(--himalayan-sky))]/30 font-medium text-xs">
                            {permit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* What to Pack */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Essential Packing List</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedTrek.what_to_pack.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                        <Camera className="h-5 w-5 text-[hsl(var(--terracotta))] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex gap-4 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] hover:shadow-lg text-white font-bold py-6 text-lg rounded-xl">
                    Book This Trek
                  </Button>
                  <Button variant="outline" className="flex-1 border-2 border-[hsl(var(--himalayan-deep-blue))] text-[hsl(var(--himalayan-deep-blue))] font-bold py-6 text-lg rounded-xl hover:bg-[hsl(var(--himalayan-sky))]/10">
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Trek;