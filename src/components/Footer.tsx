import { Mountain, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Mountain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Yatra <span className="text-primary">Sathi</span>
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your trusted travel companion for extraordinary adventures. Connect, explore, and create memories that last a lifetime.
            </p>
            <div className="flex space-x-3">
              <Button size="icon" variant="ghost" className="h-9 w-9 hover:bg-primary/10 hover:text-primary">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9 hover:bg-primary/10 hover:text-primary">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9 hover:bg-primary/10 hover:text-primary">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-3">
              <a href="#treks" className="block text-muted-foreground hover:text-primary transition-colors">
                Popular Treks
              </a>
              <a href="#guides" className="block text-muted-foreground hover:text-primary transition-colors">
                Our Guides
              </a>
              <a href="#safety" className="block text-muted-foreground hover:text-primary transition-colors">
                Safety Guidelines
              </a>
              <a href="#gear" className="block text-muted-foreground hover:text-primary transition-colors">
                Gear Recommendations
              </a>
              <a href="#blog" className="block text-muted-foreground hover:text-primary transition-colors">
                Blog & Stories
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Support</h3>
            <div className="space-y-3">
              <a href="#faq" className="block text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </a>
              <a href="#contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </a>
              <a href="#booking" className="block text-muted-foreground hover:text-primary transition-colors">
                Booking Help
              </a>
              <a href="#cancellation" className="block text-muted-foreground hover:text-primary transition-colors">
                Cancellation Policy
              </a>
              <a href="#terms" className="block text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Stay Updated</h3>
            <p className="text-muted-foreground text-sm">
              Get the latest trek updates, safety tips, and community stories delivered to your inbox.
            </p>
            <div className="space-y-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-background border-border/50"
              />
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">contact@yatrasathi.com</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">+977 1 234 5678</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">Kathmandu, Nepal</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Yatra Sathi. All rights reserved. | Built with ❤️ for adventurers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;