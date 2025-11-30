import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="get-started"
      className="relative font-sans w-full max-w-[1200px] mx-auto h-[580px] md:h-[650px] lg:h-[600px]
      bg-[rgba(255,240,255,0.68)] border border-[rgba(255,255,255,0.21)]
      shadow-[4px_4px_4px_4px_rgba(213,171,235,0.76)]
      rounded-[20px] flex items-center justify-center overflow-hidden"
    >
      {/* Left Dashes */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
        <div className="h-[0.25rem] w-32 md:w-36 bg-gradient-to-r from-[#FFEDD5] to-[#FED7AA] rounded-full"></div>
        <div className="h-[0.25rem] w-24 md:w-28 bg-gradient-to-r from-[#B4DAFE] to-[#5A9DDB] rounded-full mt-1"></div>
      </div>

      {/* Right Dashes */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
        <div className="h-[0.25rem] w-32 md:w-36 bg-gradient-to-l from-[#FFEDD5] to-[#FED7AA] rounded-full"></div>
        <div className="h-[0.25rem] w-24 md:w-28 bg-gradient-to-l from-[#B4DAFE] to-[#5A9DDB] rounded-full mt-1"></div>
      </div>

      {/* Soft background blobs */}
      <div
        className="absolute top-10 right-10 w-56 md:w-64 h-24 md:h-28 bg-gradient-to-r 
        from-[#e9faff] to-[#f7fff2] rounded-3xl blur-xl opacity-70"
      />
      <div
        className="absolute bottom-16 left-10 w-72 md:w-80 h-32 md:h-40 bg-gradient-to-r 
        from-[#fbdfff] to-[#fff8fb] rounded-3xl blur-2xl opacity-60"
      />

      {/* Inner Purple Box - Slightly smaller */}
      <div
        className="relative flex flex-col md:flex-row items-center justify-between w-[85%] max-w-5xl
        py-10 md:py-14 px-6 md:px-12 bg-[#F7E8FF] rounded-2xl shadow-[0_8px_16px_rgba(200,150,230,0.4)]
        border border-white/30 z-10"
      >
        {/* Panda */}
        <div className="shrink-0 w-1/5 md:w-1/6">
          <Image
            src="/pandaHero.png"
            width={220}
            height={220}
            alt="Panda doctor"
            className="drop-shadow-xl w-full h-auto"
          />
        </div>

        {/* Title */}
        <div className="text-center flex-1 mx-0 md:mx-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-cormorant font-bold tracking-wide leading-tight">
            <span className="text-[#76D2C0]">S</span>
            <span className="text-[#9D83C4]">YNAP</span>
            <span className="text-[#76D2C0]">S</span>
            <span className="text-[#9D83C4]">E</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg font-inter font-medium text-black">
            A platform for Medical Students
          </p>
        </div>

        {/* Medical Illustration */}
        <div className="shrink-0 w-1/5 md:w-1/6 mt-6 md:mt-0">
          <Image
            src="/stethoscope.png"
            width={220}
            height={220}
            alt="Medical tools"
            className="drop-shadow-xl w-full h-auto"
          />
        </div>
      </div>

      {/* Button */}
      <Link
        href="/signup"
        className="absolute bottom-22 z-10 bg-[#A88BD4] text-white px-8 md:px-10 py-2.5 md:py-3 rounded-xl 
        text-base md:text-lg shadow-md hover:scale-105 transition"
      >
        Get Started
      </Link>
    </section>
  );
}
