import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { profileStorage, UserProfile } from "@/lib/profileStorage";
import UserProfileForm from "@/components/UserProfileForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Edit3, UserPlus } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      // Check if user has a profile (now async!)
      const existingProfile = await profileStorage.getCurrentUserProfile(session.user.id);
      setUserProfile(existingProfile);

      // If no profile exists, start in editing mode
      if (!existingProfile) {
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (profileData: UserProfile) => {
    try {
      // Save profile to Supabase database
      await profileStorage.saveProfile({
        ...profileData,
        userId: user.id
      });

      // Refresh the profile data
      const updatedProfile = await profileStorage.getCurrentUserProfile(user.id);
      setUserProfile(updatedProfile);
      setIsEditing(false);

      toast({
        title: userProfile ? "Profile updated!" : "Profile created!",
        description: userProfile
          ? "Your profile has been updated successfully."
          : "Welcome to the community! You can now find trek partners.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {userProfile ? "Your Trekker Profile" : "Create Your Profile"}
              </h1>
              <p className="text-lg text-muted-foreground">
                {userProfile 
                  ? "Manage your profile to find the perfect trekking companions"
                  : "Tell us about yourself to start finding compatible trek partners"
                }
              </p>
            </div>
          </div>
        </section>

        {/* Profile Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {isEditing ? (
              <div className="max-w-2xl mx-auto">
                <UserProfileForm
                  onSubmit={handleProfileSubmit}
                  initialData={userProfile || undefined}
                  isEditing={!!userProfile}
                />
                {userProfile && (
                  <div className="text-center mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ) : userProfile ? (
              <div className="max-w-4xl mx-auto">
                {/* Profile Display */}
                <Card className="mb-8">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                          <AvatarFallback>
                            <User className="h-8 w-8 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
                          <CardDescription>
                            {userProfile.age} years old • {userProfile.location} • {userProfile.experience}
                          </CardDescription>
                        </div>
                      </div>
                      <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                        <Edit3 className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {userProfile.bio && (
                      <div>
                        <h3 className="font-semibold mb-2">About Me</h3>
                        <p className="text-muted-foreground">{userProfile.bio}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-2">Trekking Experience</h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          Level: <span className="text-foreground">{userProfile.experience}</span>
                        </p>
                        <p className="text-sm text-muted-foreground mb-1">
                          Completed Treks: <span className="text-foreground">{userProfile.completedTreks}</span>
                        </p>
                        {userProfile.nextTrek && (
                          <p className="text-sm text-muted-foreground">
                            Next Trek: <span className="text-foreground">{userProfile.nextTrek}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Availability</h3>
                        <p className="text-sm text-muted-foreground">
                          Available: <span className="text-foreground">{userProfile.availability}</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.interests.map((interest, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.languages.map((language, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ready to Find Trek Partners?</CardTitle>
                    <CardDescription>
                      Your profile is complete! Now you can start finding compatible trekking companions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        onClick={() => navigate('/find-a-sathi')}
                        className="flex items-center gap-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        Find Trek Partners
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/treks')}
                      >
                        Explore Treks
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // No profile exists
              <div className="max-w-2xl mx-auto text-center">
                <Card>
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserPlus className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>Create Your Profile</CardTitle>
                    <CardDescription>
                      You need to create a profile before you can find trek partners. 
                      This helps us match you with compatible trekkers based on your experience and preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setIsEditing(true)} className="w-full">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile; 