import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mountain } from "lucide-react";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate("/");
      }
    };
    checkAuth();

    // Listen for auth state changes (including email confirmation)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          toast({
            title: "Welcome to Yatra Sathi! 🎉",
            description: "Your email has been verified successfully.",
          });
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Check your email! 📧",
          description: "We've sent you a confirmation link. Click it to verify your account and you'll be automatically logged in.",
          duration: 8000,
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Mountain Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--mountain-shadow))] via-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--mountain-purple))]" />

      {/* Animated starfield */}
      <div className="absolute inset-0">
        <div className="absolute top-[10%] left-[15%] w-1 h-1 bg-white/60 rounded-full animate-pulse" />
        <div className="absolute top-[20%] right-[20%] w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-[30%] left-[30%] w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[15%] right-[40%] w-1 h-1 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-[25%] left-[60%] w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[35%] right-[15%] w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: "2.5s" }} />
        <div className="absolute top-[40%] left-[25%] w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: "3s" }} />
        <div className="absolute top-[10%] right-[50%] w-1.5 h-1.5 bg-[hsl(var(--golden-amber))]/40 rounded-full animate-pulse" style={{ animationDelay: "1.2s" }} />
      </div>

      {/* Layered mountain silhouettes */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Distant mountains */}
        <div className="absolute bottom-0 left-0 right-0 h-[45vh] opacity-20"
             style={{ clipPath: "polygon(0 100%, 0 65%, 12% 55%, 25% 70%, 40% 50%, 55% 65%, 70% 45%, 85% 60%, 100% 50%, 100% 100%)" }}>
          <div className="h-full bg-gradient-to-t from-white/30 to-transparent" />
        </div>

        {/* Mid-range mountains */}
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] opacity-30"
             style={{ clipPath: "polygon(0 100%, 0 75%, 15% 60%, 30% 50%, 50% 40%, 65% 55%, 80% 45%, 95% 55%, 100% 50%, 100% 100%)" }}>
          <div className="h-full bg-gradient-to-t from-white/40 to-transparent" />
        </div>

        {/* Foreground mountains with snow caps */}
        <div className="absolute bottom-0 left-0 right-0 h-[55vh]"
             style={{ clipPath: "polygon(0 100%, 0 80%, 8% 70%, 18% 55%, 28% 65%, 42% 45%, 55% 60%, 68% 40%, 78% 55%, 88% 45%, 95% 52%, 100% 48%, 100% 100%)" }}>
          <div className="h-full bg-gradient-to-t from-[hsl(var(--mountain-shadow))] via-[hsl(var(--mountain-shadow))]/80 to-transparent" />
          {/* Snow caps effect */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/20 to-transparent"
               style={{ clipPath: "polygon(0 0, 18% 10%, 28% 25%, 42% 5%, 55% 20%, 68% 0, 78% 15%, 88% 5%, 100% 8%, 100% 0)" }} />
        </div>
      </div>

      {/* Floating prayer flags */}
      <div className="absolute top-[15%] left-0 right-0 flex justify-center gap-3 opacity-20 z-0">
        <div className="w-6 h-10 bg-[hsl(var(--prayer-flag-blue))] transform rotate-2 animate-pulse" style={{ animationDuration: "3s" }} />
        <div className="w-6 h-10 bg-[hsl(var(--snow-white))] transform -rotate-1 animate-pulse" style={{ animationDuration: "3.5s", animationDelay: "0.5s" }} />
        <div className="w-6 h-10 bg-[hsl(var(--prayer-flag-red))] transform rotate-1 animate-pulse" style={{ animationDuration: "3.2s", animationDelay: "1s" }} />
        <div className="w-6 h-10 bg-[hsl(var(--forest-green))] transform -rotate-2 animate-pulse" style={{ animationDuration: "3.8s", animationDelay: "1.5s" }} />
        <div className="w-6 h-10 bg-[hsl(var(--prayer-flag-yellow))] transform rotate-2 animate-pulse" style={{ animationDuration: "3.3s", animationDelay: "2s" }} />
      </div>

      {/* Glowing aurora effect */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[hsl(var(--golden-amber))]/10 via-[hsl(var(--himalayan-sky))]/5 to-transparent animate-pulse" style={{ animationDuration: "8s" }} />

      {/* Content Container */}
      <div className="w-full max-w-md p-6 relative z-10">
        {/* Logo and tagline */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-4 group">
            <div className="w-14 h-14 bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] rounded-2xl flex items-center justify-center shadow-2xl shadow-[hsl(var(--himalayan-deep-blue))]/30 group-hover:scale-110 transition-transform duration-300">
              <Mountain className="h-8 w-8 text-white" />
            </div>
            <span className="text-4xl font-extrabold tracking-tight">
              <span className="text-white">Yatra</span>
              <span className="bg-gradient-to-r from-[hsl(var(--golden-amber))] to-[hsl(var(--terracotta))] bg-clip-text text-transparent"> Sathi</span>
            </span>
          </div>
          <p className="text-white/90 text-center text-lg font-medium">
            Begin your Himalayan adventure
          </p>
        </div>

        {/* Enhanced Card with glassmorphism */}
        <Card className="border-2 border-white/20 bg-white/95 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-3xl font-extrabold text-center bg-gradient-to-r from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-base text-muted-foreground">
              Sign in to continue your journey or create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-[hsl(var(--muted))] h-12">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--himalayan-deep-blue))] data-[state=active]:to-[hsl(var(--forest-green))] data-[state=active]:text-white font-semibold transition-all duration-300"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--himalayan-deep-blue))] data-[state=active]:to-[hsl(var(--forest-green))] data-[state=active]:text-white font-semibold transition-all duration-300"
                >
                  Join Now
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-6">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-sm font-semibold text-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 border-2 border-[hsl(var(--border))] focus:border-[hsl(var(--himalayan-deep-blue))] rounded-lg text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sm font-semibold text-foreground">
                      Password
                    </Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 border-2 border-[hsl(var(--border))] focus:border-[hsl(var(--himalayan-deep-blue))] rounded-lg text-base"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] hover:shadow-lg hover:shadow-[hsl(var(--himalayan-deep-blue))]/30 text-white font-bold text-base rounded-lg transition-all duration-300 hover:scale-[1.02] mt-6"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Sign In to Your Account
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-sm font-semibold text-foreground">
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="h-12 border-2 border-[hsl(var(--border))] focus:border-[hsl(var(--himalayan-deep-blue))] rounded-lg text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-semibold text-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 border-2 border-[hsl(var(--border))] focus:border-[hsl(var(--himalayan-deep-blue))] rounded-lg text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-semibold text-foreground">
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a strong password (min. 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-12 border-2 border-[hsl(var(--border))] focus:border-[hsl(var(--himalayan-deep-blue))] rounded-lg text-base"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] hover:shadow-lg hover:shadow-[hsl(var(--himalayan-deep-blue))]/30 text-white font-bold text-base rounded-lg transition-all duration-300 hover:scale-[1.02] mt-6"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Create Your Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;