"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm flex items-center justify-between py-4 px-6">
      {/* Logo */}
      <div className="text-3xl font-bold text-purple-600">
        <span className="inline-block w-6 h-6 bg-purple-500 rounded-md"></span>
      </div>

      {/* Centered Links */}
      <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex gap-8 font-medium text-[#711B9C]">
        <a href="#get-started" className="hover:text-[#9B5DE5] transition">
          Get Started
        </a>
        <a href="#demo-video" className="hover:text-[#9B5DE5] transition">
          Demo Video
        </a>
        <a href="#features" className="hover:text-[#9B5DE5] transition">
          Features
        </a>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
          className="px-5 py-2 rounded-md bg-[#711B9C] text-white  hover:scale-105 transition"
          onClick={() => router.push("/signin")}
        >
          Login
        </button>
        <button
          className="px-5 py-2 rounded-md bg-[#76D2C0] text-white  hover:scale-105 transition"
          onClick={() => router.push("/signup")}
        >
          Sign up
        </button>
      </div>
    </nav>
  );
}
