import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-5 px-4 py-2 rounded-full bg-white/75 backdrop-blur-lg border border-purple-100/80 shadow-[0_8px_40px_rgba(113,27,156,0.14),0_1px_2px_rgba(113,27,156,0.08)]">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/feature.png" alt="Synapse" width={50} height={50} />
        </Link>

        {/* Divider */}
        <div className="w-px h-4 bg-purple-200/70" />

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium text-[#711B9C]/80">
          <a
            href="#get-started"
            className="hover:text-[#711B9C] transition-colors duration-150"
          >
            Get Started
          </a>
          <a
            href="#demo-video"
            className="hover:text-[#711B9C] transition-colors duration-150"
          >
            Demo
          </a>
          <a
            href="#features"
            className="hover:text-[#711B9C] transition-colors duration-150"
          >
            Features
          </a>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-4 bg-purple-200/70" />

        {/* CTA Button */}
        <Link
          href="/signup"
          className="px-4 py-1.5 rounded-full bg-[#711B9C] text-white text-sm font-semibold tracking-wide hover:bg-[#5e1685] hover:shadow-[0_4px_18px_rgba(113,27,156,0.45)] active:scale-95 transition-all duration-200"
        >
          Get Started
        </Link>
      </nav>
    </div>
  );
}
