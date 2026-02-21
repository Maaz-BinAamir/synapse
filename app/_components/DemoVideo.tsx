import Image from "next/image";

export default function DemoVideo() {
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
        <iframe
          src="https://drive.google.com/file/d/1lT_2gUiAX9M2KEIjg0AK95rafGR4KA1Q/preview"
          title="Synapse Demo Video"
          className="w-full h-full rounded-[28px]"
          allow="autoplay; fullscreen"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}
