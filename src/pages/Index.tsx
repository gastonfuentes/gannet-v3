import HeroSection from "@/components/HeroSection";
import Problems from "@/components/sections/Problems";
import Solutions from "@/components/sections/Solutions";
import Clients from "@/components/sections/Clients";
import HowWeWork from "@/components/sections/HowWeWork";
import WhyGannet from "@/components/sections/WhyGannet";
import Verticals from "@/components/sections/Verticals";
import FAQ from "@/components/sections/FAQ";
import ContactCTA from "@/components/sections/ContactCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <Problems />
      <Solutions />
      <Clients />
      <HowWeWork />
      <WhyGannet />
      <Verticals />
      <FAQ />
      <ContactCTA />
      <Footer />
    </main>
  );
};

export default Index;
