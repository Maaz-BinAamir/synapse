"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import React from "react";

// Accordion Root
export function Accordion({
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root {...props} className="space-y-2">
      {children}
    </AccordionPrimitive.Root>
  );
}

// Accordion Item
export function AccordionItem({
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item {...props}>{children}</AccordionPrimitive.Item>
  );
}

// Accordion Trigger
export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof AccordionPrimitive.Trigger>
>(({ children, className, ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={`flex items-center justify-between w-full p-4 bg-gray-100 rounded ${className || ""}`}
      {...props}
    >
      {children}
      <ChevronDown className="w-4 h-4" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

// Accordion Content
export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof AccordionPrimitive.Content>
>(({ children, className, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={`p-4 border-t ${className || ""}`}
    {...props}
  >
    {children}
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";
