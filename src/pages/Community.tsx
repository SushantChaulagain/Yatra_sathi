import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, Share2, Camera, Send, Users, Compass, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Community = () => {
  const [newPost, setNewPost] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Mock community posts data
  const posts = [
    {
      id: 1,
      user: {
        name: "Priya Sharma",
        avatar: "PS",
        location: "Kathmandu"
      },
      content: "Just completed the Annapurna Base Camp trek! The sunrise from ABC was absolutely breathtaking. The rhododendron forests were in full bloom. Highly recommend going in spring season! 🏔️",
      image: "photo-1469474968028-56623f02e42d",
      trek: "Annapurna Base Camp",
      category: "Trip Reports",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      isLiked: false
    },
    {
      id: 2,
      user: {
        name: "Raj Poudel",
        avatar: "RP",
        location: "Pokhara"
      },
      content: "Looking for trekking partners for Everest Base Camp in October. I'm an experienced trekker and have done EBC twice before. Anyone interested in joining? Let's plan together!",
      trek: "Everest Base Camp",
      category: "Find Partners",
      timestamp: "5 hours ago",
      likes: 15,
      comments: 12,
      isLiked: true
    },
    {
      id: 3,
      user: {
        name: "Maya Tamang",
        avatar: "MT",
        location: "Langtang"
      },
      content: "What's the best sleeping bag for high altitude treks? Planning for Manaslu Circuit and want to make sure I'm prepared for the cold nights. Any recommendations?",
      category: "Gear Talk",
      timestamp: "1 day ago",
      likes: 8,
      comments: 15,
      isLiked: false
    },
    {
      id: 4,
      user: {
        name: "Bikram Rai",
        avatar: "BR",
        location: "Solukhumbu"
      },
      content: "Amazing sunset from Gokyo Ri! The Everest massif looked incredible from here. The turquoise lakes below and the golden peaks above - nature at its finest! 📸",
      image: "photo-1506744038136-46273834b3fb",
      trek: "Gokyo Lakes",
      category: "Trip Reports",
      timestamp: "2 days ago",
      likes: 32,
      comments: 6,
      isLiked: true
    },
    {
      id: 5,
      user: {
        name: "Sunita Gurung",
        avatar: "SG",
        location: "Ghandruk"
      },
      content: "First time trekker here! Planning for Poon Hill trek next month. Any tips for preparation? What should I pack? How difficult is it really? All advice welcome! 🥾",
      trek: "Poon Hill",
      category: "Questions/Advice",
      timestamp: "3 days ago",
      likes: 12,
      comments: 18,
      isLiked: false
    }
  ];

  const filteredPosts = activeTab === "all" ? posts : posts.filter(post => 
    post.category.toLowerCase().replace(/[^a-z]/g, '') === activeTab
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = () => {
    if (newPost.trim()) {
      // In a real app, this would submit to the backend
      console.log("New post:", newPost);
      setNewPost("");
      setSelectedImage(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Trip Reports": return <Compass className="h-4 w-4" />;
      case "Gear Talk": return <Camera className="h-4 w-4" />;
      case "Questions/Advice": return <HelpCircle className="h-4 w-4" />;
      case "Find Partners": return <Users className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Trip Reports": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Gear Talk": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Questions/Advice": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Find Partners": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-primary via-secondary to-accent">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trekker Community
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Connect with fellow adventurers, share your experiences, and get advice from the community
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Post Creation */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Share Your Adventure</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="What's on your mind? Share your trekking experience, ask questions, or find trekking partners..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={3}
                />
                
                {selectedImage && (
                  <div className="relative">
                    <img 
                      src={selectedImage} 
                      alt="Upload preview" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2"
                    >
                      Remove
                    </Button>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                        <span>
                          <Camera className="h-4 w-4 mr-2" />
                          Add Photo
                        </span>
                      </Button>
                    </label>
                  </div>
                  
                  <Button 
                    onClick={handleSubmitPost}
                    disabled={!newPost.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Category Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="tripreports">Trip Reports</TabsTrigger>
                <TabsTrigger value="geartalk">Gear Talk</TabsTrigger>
                <TabsTrigger value="questionsadvice">Q&A</TabsTrigger>
                <TabsTrigger value="findpartners">Partners</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-6 mt-6">
                {/* Community Posts */}
                {filteredPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback>{post.user.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{post.user.name}</h3>
                            <p className="text-sm text-muted-foreground">{post.user.location} • {post.timestamp}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(post.category)}>
                            {getCategoryIcon(post.category)}
                            <span className="ml-1">{post.category}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-foreground">{post.content}</p>
                      
                      {post.trek && (
                        <Badge variant="outline" className="text-primary border-primary">
                          📍 {post.trek}
                        </Badge>
                      )}
                      
                      {post.image && (
                        <img
                          src={`https://images.unsplash.com/${post.image}?w=600&h=300&fit=crop`}
                          alt="Post image"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-6">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={`gap-2 ${post.isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
                          >
                            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                            {post.likes}
                          </Button>
                          
                          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments}
                          </Button>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Community;