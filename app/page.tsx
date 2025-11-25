import Navbar from "./landing Components/Navbar";
import Hero from "./landing Components/Hero";
import DemoVideo from "./landing Components/demo";
import FeaturesSection from "./landing Components/features";
import Footer from "./landing Components/footer";
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
