import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("utils unit", () => {
  it("merges conditional class names", () => {
    expect(cn("px-2", false && "hidden", "py-4")).toBe("px-2 py-4");
  });

  it("resolves conflicting tailwind classes using tailwind-merge", () => {
    expect(cn("px-2", "px-4", "text-sm")).toBe("px-4 text-sm");
  });
});
