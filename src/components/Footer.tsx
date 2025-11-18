import { Mountain, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-background to-[hsl(var(--muted))] border-t border-[hsl(var(--border))]">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--himalayan-deep-blue))] via-[hsl(var(--forest-green))] to-[hsl(var(--terracotta))]" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] rounded-xl flex items-center justify-center shadow-md">
                <Mountain className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-[hsl(var(--himalayan-deep-blue))]">Yatra</span>
                <span className="text-[hsl(var(--forest-green))]"> Sathi</span>
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Your trusted companion for Himalayan adventures. Connect with fellow trekkers, explore breathtaking trails, and create unforgettable memories in the mountains of Nepal.
            </p>
            <div className="flex space-x-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-lg hover:bg-[hsl(var(--himalayan-sky))]/10 hover:text-[hsl(var(--himalayan-deep-blue))] transition-all duration-200"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-lg hover:bg-[hsl(var(--terracotta))]/10 hover:text-[hsl(var(--terracotta))] transition-all duration-200"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-lg hover:bg-[hsl(var(--himalayan-sky))]/10 hover:text-[hsl(var(--himalayan-sky))] transition-all duration-200"
              >
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-foreground">Quick Links</h3>
            <div className="space-y-3">
              <a
                href="#treks"
                className="block text-muted-foreground hover:text-[hsl(var(--himalayan-deep-blue))] transition-colors font-medium"
              >
                Popular Treks
              </a>
              <a
                href="#blog"
                className="block text-muted-foreground hover:text-[hsl(var(--himalayan-deep-blue))] transition-colors font-medium"
              >
                Blog & Stories
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-foreground">Support</h3>
            <div className="space-y-3">
              <a
                href="#faq"
                className="block text-muted-foreground hover:text-[hsl(var(--himalayan-deep-blue))] transition-colors font-medium"
              >
                FAQ
              </a>
              <a
                href="#contact"
                className="block text-muted-foreground hover:text-[hsl(var(--himalayan-deep-blue))] transition-colors font-medium"
              >
                Contact Us
              </a>
              <a
                href="#terms"
                className="block text-muted-foreground hover:text-[hsl(var(--himalayan-deep-blue))] transition-colors font-medium"
              >
                Terms of Service
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-foreground">Stay Updated</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Get the latest trek updates, safety tips, and Himalayan stories delivered to your inbox.
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background border-[hsl(var(--border))] focus:border-[hsl(var(--himalayan-deep-blue))] focus:ring-[hsl(var(--himalayan-deep-blue))]"
              />
              <Button className="w-full bg-gradient-to-r from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] hover:shadow-lg hover:shadow-[hsl(var(--himalayan-deep-blue))]/30 text-white font-bold transition-all duration-300">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-14 pt-10 border-t border-[hsl(var(--border))]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--himalayan-sky))]/10 flex items-center justify-center group-hover:bg-[hsl(var(--himalayan-sky))]/20 transition-colors">
                <Mail className="h-5 w-5 text-[hsl(var(--himalayan-deep-blue))]" />
              </div>
              <span className="text-muted-foreground font-medium">contact@yatrasathi.com</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--forest-green))]/10 flex items-center justify-center group-hover:bg-[hsl(var(--forest-green))]/20 transition-colors">
                <Phone className="h-5 w-5 text-[hsl(var(--forest-green))]" />
              </div>
              <span className="text-muted-foreground font-medium">+977 1 234 5678</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--terracotta))]/10 flex items-center justify-center group-hover:bg-[hsl(var(--terracotta))]/20 transition-colors">
                <MapPin className="h-5 w-5 text-[hsl(var(--terracotta))]" />
              </div>
              <span className="text-muted-foreground font-medium">Kathmandu, Nepal</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-8 border-t border-[hsl(var(--border))] text-center">
          <p className="text-muted-foreground text-sm font-medium">
            © 2025 Yatra Sathi. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Built with passion for Himalayan adventurers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;