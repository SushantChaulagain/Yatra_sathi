import { Button } from "@/components/ui/button";
import { Mountain, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { toast } = useToast();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-[hsl(var(--border))] shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <Mountain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-[hsl(var(--himalayan-deep-blue))]">Yatra</span>
              <span className="text-[hsl(var(--forest-green))]"> Sathi</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <a href="/" className="px-4 py-2 rounded-lg text-foreground hover:text-[hsl(var(--himalayan-deep-blue))] hover:bg-[hsl(var(--himalayan-sky))]/10 transition-all duration-200 font-semibold">
              Home
            </a>
            <a href="/treks" className="px-4 py-2 rounded-lg text-foreground hover:text-[hsl(var(--himalayan-deep-blue))] hover:bg-[hsl(var(--himalayan-sky))]/10 transition-all duration-200 font-semibold">
              Treks
            </a>
            <a href="/find-a-sathi" className="px-4 py-2 rounded-lg text-foreground hover:text-[hsl(var(--himalayan-deep-blue))] hover:bg-[hsl(var(--himalayan-sky))]/10 transition-all duration-200 font-semibold">
              Find a Friend
            </a>
            <a href="/about" className="px-4 py-2 rounded-lg text-foreground hover:text-[hsl(var(--himalayan-deep-blue))] hover:bg-[hsl(var(--himalayan-sky))]/10 transition-all duration-200 font-semibold">
              About
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-[hsl(var(--himalayan-deep-blue))] hover:bg-[hsl(var(--himalayan-sky))]/10 font-semibold"
                  onClick={() => window.location.href = '/profile'}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-[hsl(var(--terracotta))] hover:bg-[hsl(var(--terracotta))]/10 font-semibold"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-[hsl(var(--himalayan-deep-blue))] hover:bg-[hsl(var(--himalayan-sky))]/10 font-semibold"
                  onClick={() => window.location.href = '/auth'}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-gradient-to-r from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] hover:shadow-lg hover:shadow-[hsl(var(--himalayan-deep-blue))]/30 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
                  onClick={() => window.location.href = '/auth'}
                >
                  Join Now
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-lg border-b border-[hsl(var(--border))] shadow-lg">
            <div className="px-4 py-6 space-y-2">
              <a
                href="/"
                className="block px-4 py-3 rounded-lg text-foreground hover:text-[hsl(var(--himalayan-deep-blue))] hover:bg-[hsl(var(--himalayan-sky))]/10 transition-all font-semibold"
                onClick={toggleMenu}
              >
                Home
              </a>
              <a
                href="/treks"
                className="block px-4 py-3 rounded-lg text-foreground hover:text-[hsl(var(--himalayan-deep-blue))] hover:bg-[hsl(var(--himalayan-sky))]/10 transition-all font-semibold"
                onClick={toggleMenu}
              >
                Treks
              </a>
              <a
                href="/find-a-sathi"
                className="block px-4 py-3 rounded-lg text-foreground hover:text-[hsl(var(--himalayan-deep-blue))] hover:bg-[hsl(var(--himalayan-sky))]/10 transition-all font-semibold"
                onClick={toggleMenu}
              >
                Find a Friend
              </a>
              <a
                href="/about"
                className="block px-4 py-3 rounded-lg text-foreground hover:text-[hsl(var(--himalayan-deep-blue))] hover:bg-[hsl(var(--himalayan-sky))]/10 transition-all font-semibold"
                onClick={toggleMenu}
              >
                About
              </a>
              <div className="pt-4 space-y-2 border-t border-[hsl(var(--border))]">
                {user ? (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-foreground hover:text-[hsl(var(--himalayan-deep-blue))] hover:bg-[hsl(var(--himalayan-sky))]/10 font-semibold"
                      onClick={() => {
                        window.location.href = '/profile';
                        toggleMenu();
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-foreground hover:text-[hsl(var(--terracotta))] hover:bg-[hsl(var(--terracotta))]/10 font-semibold"
                      onClick={() => {
                        handleSignOut();
                        toggleMenu();
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-foreground hover:text-[hsl(var(--himalayan-deep-blue))] hover:bg-[hsl(var(--himalayan-sky))]/10 font-semibold"
                      onClick={() => window.location.href = '/auth'}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] hover:shadow-lg text-white font-bold"
                      onClick={() => window.location.href = '/auth'}
                    >
                      Join Now
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;