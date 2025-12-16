import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full mt-32">
      <div
        className="mx-auto max-w-[1200px] h-[346px] 
               bg-[#9D83C4] bg-opacity-60 
               rounded-t-4xl 
               flex flex-col items-center justify-center px-10"
      >
        {/* Footer content text */}
        <p className="text-[#F9FAFB] text-[16px] leading-[24px] text-center max-w-[672px]">
          All media, contents, articles and everything here have copyright
          material and law.
        </p>
        <div className="flex justify-center bg-[#e9d8ff00]  ">
          <Image
            src="/footer.png"
            alt="Mascot"
            width={260}
            height={260}
            className="object-contain"
          />
        </div>

        <p className="text-[#F9FAFB] text-[16px] leading-[24px] mt-2 text-center">
          © 2025 SYNAPSE.
        </p>
      </div>
    </footer>
  );
}
