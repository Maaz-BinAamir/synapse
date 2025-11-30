import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import DemoVideo from "./_components/DemoVideo";
import FeaturesSection from "./_components/Features";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <Navbar />
      <div className="w-full flex justify-center mt-[140px]">
        <Hero />
      </div>
      <DemoVideo />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
