"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  Loader2,
  Image as ImageIcon,
  Plus,
  X,
  Type,
  FileText,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { INTERESTS_LIST } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(200, { message: "Title must be at most 200 characters." }),
  body: z
    .string()
    .min(1, { message: "Body is required." })
    .max(5000, { message: "Body must be at most 5000 characters." }),
  tags: z
    .array(z.string())
    .max(5, { message: "You can add up to 5 tags." })
    .optional(),
  images: z.array(z.string()).optional(),
});

// ── Sub-components ──────────────────────────────────────────────────────────

interface ImageUploadSectionProps {
  selectedImages: File[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function ImageUploadSection({
  selectedImages,
  onAdd,
  onRemove,
  fileInputRef,
  onFileChange,
}: ImageUploadSectionProps) {
  return (
    <div className="space-y-3">
      <p className="text-gray-700 font-medium flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-[#9D83C4]" /> Images
      </p>
      <div className="flex flex-wrap gap-3">
        {selectedImages.map((image, index) => (
          <div
            key={`${image.name}-${image.size}-${index}`}
            className="relative w-24 h-24 rounded-lg border-2 border-[#9D83C4]/20 overflow-hidden group"
          >
            <Image
              src={URL.createObjectURL(image)}
              alt={`Preview ${index + 1}`}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="w-24 h-24 rounded-lg border-2 border-dashed border-[#9D83C4]/40 hover:border-[#9D83C4] flex items-center justify-center bg-white/50 transition-all duration-300"
        >
          <Plus className="w-6 h-6 text-[#9D83C4]" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onFileChange}
          className="hidden"
        />
      </div>
      <p className="text-xs text-gray-400">Click the + button to add images</p>
    </div>
  );
}

interface TagsSectionProps {
  tags: string[];
  tagInput: string;
  openTagCombo: boolean;
  onOpenChange: (open: boolean) => void;
  onTagInputChange: (value: string) => void;
  onAddTag: (tag: string) => void;
  onAddCustomTag: () => void;
  onRemoveTag: (tag: string) => void;
}

function TagsSection({
  tags,
  tagInput,
  openTagCombo,
  onOpenChange,
  onTagInputChange,
  onAddTag,
  onAddCustomTag,
  onRemoveTag,
}: TagsSectionProps) {
  return (
    <div className="space-y-3">
      <p className="text-gray-700 font-medium flex items-center gap-2">
        <Plus className="w-4 h-4 text-[#FED7AA]" /> Tags
      </p>
      <Popover open={openTagCombo} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openTagCombo}
            aria-controls="tag-combobox-list"
            disabled={tags.length >= 5}
            className="w-full justify-between border-gray-200 focus-visible:border-[#9D83C4] focus-visible:ring-[#9D83C4]/20 transition-all duration-300 bg-white/50"
          >
            {tags.length >= 5
              ? "Maximum tags reached (5/5)"
              : "Select or add tags..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Search or type to add..."
              value={tagInput}
              onValueChange={onTagInputChange}
            />
            <CommandList id="tag-combobox-list">
              <CommandEmpty>
                <div className="p-2">
                  <p className="text-sm text-gray-500 mb-2">
                    No results found.
                  </p>
                  {tagInput.trim() && tags.length < 5 && (
                    <Button
                      size="sm"
                      onClick={onAddCustomTag}
                      className="w-full bg-[#9D83C4] hover:bg-[#8a72b0]"
                    >
                      Add &quot;{tagInput.trim()}&quot;
                    </Button>
                  )}
                </div>
              </CommandEmpty>
              <CommandGroup>
                {INTERESTS_LIST.filter(
                  (interest) => !tags.includes(interest)
                ).map((interest) => (
                  <CommandItem
                    key={interest}
                    value={interest}
                    onSelect={() => onAddTag(interest)}
                  >
                    <Check className="mr-2 h-4 w-4 opacity-0" />
                    {interest}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-[#9D83C4]/10 text-[#9D83C4] border border-[#9D83C4]/20 hover:bg-[#9D83C4]/20"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="ml-2 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400">
        {tags.length}/5 tags selected. Choose from list or add custom tags.
      </p>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CreatePostPage() {
  const createPost = useMutation(api.posts.create);
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [openTagCombo, setOpenTagCombo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags((prev) => [...prev, tag]);
      setTagInput("");
      setOpenTagCombo(false);
    }
  };

  const addCustomTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
      setOpenTagCombo(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      let storageIds: string[] | undefined;

      // Upload images if any
      if (selectedImages.length > 0) {
        storageIds = [];
        for (const image of selectedImages) {
          const postUrl = await generateUploadUrl();
          const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": image.type },
            body: image,
          });
          const { storageId } = await result.json();
          storageIds.push(storageId);
        }
      }

      await createPost({
        title: values.title,
        body: values.body,
        tags: tags.length > 0 ? tags : undefined,
        images: storageIds as Id<"_storage">[],
      });

      toast.success("Post has been created succesfully");

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-full w-full flex items-center justify-center bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] overflow-hidden p-8">
      <div className="w-full max-w-2xl relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#FED7AA] rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#76D2C0] rounded-full blur-3xl opacity-50 animate-pulse delay-700"></div>

        <Card className="border-2 border-[#9D83C4]/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm bg-white/80 overflow-hidden">
          <div className="h-2 w-full bg-linear-to-r from-[#9D83C4] via-[#76D2C0] to-[#FED7AA]"></div>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold text-[#9D83C4] font-serif tracking-tight">
              Create New Post
            </CardTitle>
            <CardDescription className="text-gray-500">
              Share your thoughts with the community
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <ImageUploadSection
                  selectedImages={selectedImages}
                  onAdd={() => fileInputRef.current?.click()}
                  onRemove={removeImage}
                  fileInputRef={fileInputRef}
                  onFileChange={handleImageSelect}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <Type className="w-4 h-4 text-[#9D83C4]" /> Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter an engaging title..."
                          {...field}
                          className="border-gray-200 focus-visible:border-[#9D83C4] focus-visible:ring-[#9D83C4]/20 transition-all duration-300 bg-white/50"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#76D2C0]" /> Content
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your post content here..."
                          className="min-h-[200px] resize-y border-gray-200 focus-visible:border-[#9D83C4] focus-visible:ring-[#9D83C4]/20 transition-all duration-300 bg-white/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <TagsSection
                  tags={tags}
                  tagInput={tagInput}
                  openTagCombo={openTagCombo}
                  onOpenChange={setOpenTagCombo}
                  onTagInputChange={setTagInput}
                  onAddTag={addTag}
                  onAddCustomTag={addCustomTag}
                  onRemoveTag={removeTag}
                />

                <div className="pt-4 flex justify-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#9D83C4] hover:bg-[#8a72b0] text-white font-medium px-8 py-2 rounded-full shadow-lg shadow-[#9D83C4]/30 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      "Publish Post"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
