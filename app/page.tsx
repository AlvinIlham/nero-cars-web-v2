import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import RecommendedCars from "@/components/home/RecommendedCars";
import CarsByBrand from "@/components/home/CarsByBrand";
import Footer from "@/components/home/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900">
      <Navbar />
      <Hero />
      <RecommendedCars />
      <CarsByBrand />
      <Footer />
      <ChatWidget />
    </main>
  );
}
