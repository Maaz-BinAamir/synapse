"use client";

import { motion } from "framer-motion";

export default function RectanglesBackground() {
  const widths = ["80%", "70%", "60%", "70%", "80%"];
  const borderRadiusClasses = [
    "rounded-tr-md rounded-br-full",
    "rounded-tr-md rounded-br-full",
    "rounded-r-full",
    "rounded-tr-full rounded-br-md",
    "rounded-tr-full rounded-br-md",
  ];

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none flex flex-col justify-between">
      {widths.map((w, i) => (
        <motion.div
          key={i}
          // Start completely off the right side
          initial={{ x: "100vw", opacity: 0 }}
          // Slide into the screen and stop flush RIGHT
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 1,
            delay: i * 0.2,
            ease: "easeOut",
          }}
          // Align right so the right edge touches the screen edge
          style={{ width: w, marginRight: "auto" }}
          className={`h-[20%] bg-[#9D83C4] ${borderRadiusClasses[i]}`}
        />
      ))}
    </div>
  );
}
