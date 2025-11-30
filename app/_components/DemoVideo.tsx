import Image from "next/image";

export default function DemoVideo() {
  return (
    <section
      id="demo-video"
      className="w-full flex flex-col items-center mt-[120px] px-4 md:px-0"
    >
      {/* Section Title */}
      <h2 className="font-inter font-semibold text-[28px] sm:text-[32px] md:text-[36px] leading-[36px] sm:leading-[40px] md:leading-[44px] text-[#711B9C] mb-8 text-center">
        Demo Video
      </h2>

      {/* Video Container */}
      <div
        className="w-full max-w-[1161px] aspect-video rounded-[28px]
        bg-linear-to-br from-[#F3E8FF] via-[#D8B4FE] to-[#D8B4FE]
        flex items-center justify-center relative"
      >
        {/* Play Button */}
        <button
          type="button"
          className="w-[100px] sm:w-[120px] md:w-[148px] h-[100px] sm:h-[120px] md:h-[148px]  hover:bg-[#7b60a4]  scale-105 transition"
        >
          <Image
            src="/play.png"
            alt="Play Video"
            width={148}
            height={148}
            className="object-cover"
          />
        </button>
      </div>
    </section>
  );
}
