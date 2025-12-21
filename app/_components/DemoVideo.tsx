"use client";

import Image from "next/image";
import { useState } from "react";

export default function DemoVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section
      id="demo-video"
      className="w-full flex flex-col items-center mt-[120px] px-4 md:px-0"
    >
      {/* Section Title */}
      <h2 className="font-inter font-semibold text-[28px] sm:text-[32px] md:text-[36px] leading-9 sm:leading-10 md:leading-11 text-[#711B9C] mb-8 text-center">
        Demo Video
      </h2>

      {/* Video Container */}
      <div
        className="w-full max-w-[1161px] aspect-video rounded-[28px]
        bg-linear-to-br from-[#F3E8FF] via-[#D8B4FE] to-[#D8B4FE]
        flex items-center justify-center relative overflow-hidden"
      >
        {isPlaying ? (
          <iframe
            src="https://drive.google.com/file/d/1lT_2gUiAX9M2KEIjg0AK95rafGR4KA1Q/preview"
            className="w-full h-full rounded-[28px]"
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>
        ) : (
          /* Play Button */
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="w-[100px] sm:w-[120px] md:w-[148px] h-[100px] sm:h-[120px] md:h-[148px]  hover:bg-[#7b60a4]  scale-105 transition rounded-full"
          >
            <Image
              src="/play.png"
              alt="Play Video"
              width={148}
              height={148}
              className="object-cover"
            />
          </button>
        )}
      </div>
    </section>
  );
}
