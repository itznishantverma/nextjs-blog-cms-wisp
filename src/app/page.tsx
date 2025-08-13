import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedSection } from "@/components/FeaturedSection";
import { TrendingSection } from "@/components/TrendingSection";
import { EditorsChoiceSection } from "@/components/EditorsChoiceSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedSection />
      <TrendingSection />
      <EditorsChoiceSection />
      <Footer />
    </div>
  )
}
