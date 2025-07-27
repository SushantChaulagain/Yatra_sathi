import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Mountain, Users, Shield, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  const teamMembers = [
    {
      name: "Simon Shrestha",
      role: "Founder & Developer",
      bio: "Full-stack developer and avid trekker with 10+ years exploring Nepal's mountain trails. Simon combines his passion for coding and hiking to build digital platforms that connect adventurers with the Himalayas.",
      image: "photo-1472396961693-142e6e269027",
      initials: "SS"
    },
    {
      name: "Sushant Chaulagain",
      role: "Founder & Developer",
      bio: "Software engineer turned mountain enthusiast who has trekked extensively across the Annapurna and Everest regions. Sushant leads our technical development while sharing his trail expertise with the community.",
      image: "photo-1615729947596-a598e5de0ab3",
      initials: "SC"
    },
    {
      name: "Avinash Maskey",
      role: "Developer",
      bio: "Frontend developer and weekend hiker who discovered his love for the mountains through local trail exploration. Avinash focuses on creating intuitive user experiences inspired by the simplicity of mountain life.",
      image: "photo-1615729947596-a598e5de0ab3",
      initials: "AM"
    },

  ];

  const values = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Safety First",
      description: "Your safety is our top priority. We provide experienced guides, proper equipment, and comprehensive safety protocols for every trek."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community Driven",
      description: "We believe in the power of community. Connect with fellow trekkers, share experiences, and build lasting friendships."
    },
    {
      icon: <Mountain className="h-8 w-8 text-primary" />,
      title: "Sustainable Tourism",
      description: "We promote responsible trekking that respects local communities and preserves the natural beauty of Nepal's mountains."
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Authentic Experiences",
      description: "Experience Nepal's mountains the way they're meant to be - with respect for local culture and genuine connections."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary via-secondary to-accent">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                About Yatra Sathi
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Your trusted companion for extraordinary adventures in the Himalayas
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                At Yatra Sathi, we believe that the mountains of Nepal offer some of the most transformative 
                experiences on Earth. Our mission is to connect adventurous souls with these incredible landscapes 
                while promoting safe, enjoyable, and socially responsible trekking experiences.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We're not just a trekking platform - we're a community of mountain lovers who want to share 
                the magic of Nepal's highlands with fellow adventurers from around the world. Whether you're 
                a seasoned mountaineer or taking your first steps into the high country, we're here to support 
                your journey every step of the way.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <div className="flex justify-center mb-4">
                        {value.icon}
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Meet Our Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                        {member.initials}
                      </div>
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <p className="text-primary font-medium">{member.role}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{member.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Get In Touch</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      Email Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">General inquiries:</p>
                    <p className="font-medium">info@yatrasathi.com</p>
                    <p className="text-muted-foreground mb-2 mt-4">Trek bookings:</p>
                    <p className="font-medium">bookings@yatrasathi.com</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      Call Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">Nepal:</p>
                    <p className="font-medium">+977-1-4567890</p>
                    <p className="text-muted-foreground mb-2 mt-4">Emergency:</p>
                    <p className="font-medium">+977-9851234567</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Visit Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">Yatra Sathi Adventure Center</p>
                  <p className="text-muted-foreground">Thamel, Kathmandu 44600, Nepal</p>
                  <p className="text-muted-foreground mt-2">
                    Open daily: 9:00 AM - 6:00 PM (Nepal Time)
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Social Media & CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Join Our Community</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Follow us on social media for daily inspiration, trek updates, and amazing photos 
              from fellow adventurers. Join thousands of trekkers sharing their Himalayan experiences!
            </p>
            
            <div className="flex justify-center gap-4 mb-8">
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Explore Treks
              </Button>
              <Button size="lg" variant="outline">
                Join Community
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;