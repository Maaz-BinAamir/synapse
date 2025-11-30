import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DemoVideo from "./components/demo";
import FeaturesSection from "./components/features";
import Footer from "./components/footer";

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
