"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SendHorizontal } from "lucide-react";
import { ComponentProps, KeyboardEvent, useRef, useEffect } from "react";

export type ChatInputProps = Omit<
  ComponentProps<typeof Textarea>,
  "onSubmit"
> & {
  onSubmit?: (value: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
  submitLabel?: string;
};

export const ChatInput = ({
  className,
  onSubmit,
  isDisabled = false,
  placeholder = "Type a message...",
  submitLabel = "Send message",
  value,
  onChange,
  ...props
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!value || isDisabled) return;
    onSubmit?.(value as string);
    // Reset textarea height after submit
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [value]);

  return (
    <div className={cn("flex w-full items-end gap-2", className)}>
      <Textarea
        ref={textareaRef}
        className={cn(
          "min-h-[60px] max-h-[200px] resize-none rounded-xl border-[#9D83C4]/20 bg-white/80 px-4 py-3 focus-visible:ring-[#9D83C4]/30 shadow-sm",
          isDisabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={isDisabled}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        value={value}
        {...props}
      />
      <Button
        className="h-[60px] w-15 rounded-xl bg-[#9D83C4] hover:bg-[#8B71B2] text-white shadow-sm"
        disabled={!value || isDisabled}
        onClick={handleSubmit}
        size="icon"
        type="button"
      >
        <SendHorizontal className="h-5 w-5" />
        <span className="sr-only">{submitLabel}</span>
      </Button>
    </div>
  );
};
