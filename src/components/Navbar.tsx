import { Button } from "@/components/ui/button";
import { Mountain, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mountain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Yatra <span className="text-primary">Sathi</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="#treks" className="text-foreground hover:text-primary transition-colors font-medium">
              Treks
            </a>
            <a href="#community" className="text-foreground hover:text-primary transition-colors font-medium">
              Community
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-foreground hover:text-primary" onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => window.location.href = '/auth'}>
              Join Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
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
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border/50">
            <div className="px-4 py-6 space-y-4">
              <a
                href="#home"
                className="block text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={toggleMenu}
              >
                Home
              </a>
              <a
                href="#treks"
                className="block text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={toggleMenu}
              >
                Treks
              </a>
              <a
                href="#community"
                className="block text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={toggleMenu}
              >
                Community
              </a>
              <a
                href="#about"
                className="block text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={toggleMenu}
              >
                About
              </a>
              <div className="pt-4 space-y-3 border-t border-border/50">
                <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary" onClick={() => window.location.href = '/auth'}>
                  Sign In
                </Button>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => window.location.href = '/auth'}>
                  Join Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;