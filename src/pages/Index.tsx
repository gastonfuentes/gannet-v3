import HeroSection from "@/components/HeroSection";
import Problems from "@/components/sections/Problems";
import Integrations from "@/components/sections/Integrations";
import Clients from "@/components/sections/Clients";
import HowWeWork from "@/components/sections/HowWeWork";
import Verticals from "@/components/sections/Verticals";
import FAQ from "@/components/sections/FAQ";
import ContactCTA from "@/components/sections/ContactCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <Problems />
      <Integrations />
      <Clients />
      <HowWeWork />
      <Verticals />
      <FAQ />
      <ContactCTA />
      <Footer />
    </main>
  );
};

export default Index;
