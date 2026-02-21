"use client";

import { m } from "framer-motion";

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
        <m.div
          key={borderRadiusClasses[i]}
          // Start completely off the right side
          initial={{ x: "-280px", opacity: 0 }}
          // Slide into the screen and stop flush RIGHT
          animate={{ x: 0, opacity: 1 }}
          transition={{
            x: {
              duration: 2.0,
              ease: [0.3, 0.0, 0.2, 1], // smooth slide
            },
            opacity: {
              duration: 2.5, // ⬅️ longer fade
              ease: [0.45, 0.05, 0.1, 1], // ⬅️ slower start, faster finish
            },
          }}
          // Align right so the right edge touches the screen edge
          style={{ width: w, marginRight: "auto" }}
          className={`h-[20%] bg-[#9D83C4] ${borderRadiusClasses[i]}`}
        />
      ))}
    </div>
  );
}
