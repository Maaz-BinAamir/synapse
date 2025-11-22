"use client";

import { motion } from "framer-motion";

export default function RectanglesBackground() {
  const widths = ["80%", "70%", "60%", "70%", "80%"];
  const borderRadiusClasses = [
    "rounded-tl-md rounded-bl-full", // top rectangle
    "rounded-tl-md rounded-bl-full", // second rectangl
    "rounded-l-full", // middle one
    "rounded-tl-full rounded-bl-md", // fourth
    "rounded-tl-full rounded-bl-md", // bottom
  ];

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none flex flex-col justify-between">
      {widths.map((w, i) => (
        <motion.div
          key={i}
          initial={{ x: "-120%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{
            duration: 1,
            delay: i * 0.2,
            ease: "easeOut",
          }}
          style={{ width: w, marginLeft: "auto" }}
          className={`h-[20%] bg-[#9D83C4] ${borderRadiusClasses[i]}`}
        />
      ))}
    </div>
  );
}
