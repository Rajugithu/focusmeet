import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
import Vision from "@/components/sections/vision";
import Features from "@/components/sections/features";
import Showcase from "@/components/sections/showcase";
import Testimonials from "@/components/sections/testimonials";
import Contact from "@/components/sections/contact";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#EAF3FC]">
      <Navbar />
      <main>
        <Hero />
        <Vision />
        <Features />
        <Showcase />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}