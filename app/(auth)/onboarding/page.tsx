"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Id } from "@/convex/_generated/dataModel";

const INTERESTS_LIST = [
  "USMLE Step 1",
  "USMLE Step 2 CK",
  "USMLE Step 3",
  "PLAB 1",
  "PLAB 2",
  "FCPS Part 1",
  "FCPS Part 2",
  "Cardiology",
  "Neurology",
  "Respiratory",
  "Gastroenterology",
  "Endocrinology",
  "Nephrology",
  "Hematology",
  "Infectious Diseases",
  "Rheumatology",
  "Dermatology",
  "Psychiatry",
  "Pathology",
  "Pharmacology",
  "Physiology",
  "Biochemistry",
  "Microbiology",
  "Immunology",
  "Anatomy",
];

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(20, { message: "Username must be at most 20 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        "Username can only contain letters, numbers, and underscores (no spaces).",
    }),
  bio: z
    .string()
    .max(500, { message: "Bio must be at most 500 characters." })
    .optional(),
  interests: z.array(z.string()).min(0),
});

export default function OnboardingPage() {
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      bio: "",
      interests: [],
    },
  });

  const { isSubmitting } = form.formState;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInterestSelect = (value: string) => {
    const currentInterests = form.getValues("interests");
    if (!currentInterests.includes(value)) {
      form.setValue("interests", [...currentInterests, value]);
    }
  };

  const removeInterest = (interestToRemove: string) => {
    const currentInterests = form.getValues("interests");
    form.setValue(
      "interests",
      currentInterests.filter((interest) => interest !== interestToRemove)
    );
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let storageId: Id<"_storage"> | undefined;

      if (selectedImage) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });

        if (!result.ok) {
          throw new Error(`Upload failed: ${result.statusText}`);
        }

        const { storageId: uploadedStorageId } = await result.json();
        storageId = uploadedStorageId;
      }

      await updateProfile({
        username: values.username,
        bio: values.bio || "",
        interests: values.interests,
        avatar: storageId,
      });

      toast.success("Profile updated successfully!");
      router.push("/dashboard"); // Redirect to dashboard or home
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-none bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-[#9D83C4] font-serif">
            Welcome to Synapse
          </CardTitle>
          <CardDescription className="text-gray-500 text-lg">
            Let&apos;s set up your profile to get you started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#9D83C4]/20 bg-gray-100 flex items-center justify-center group">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Avatar preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Upload className="w-10 h-10 text-gray-400 group-hover:text-[#9D83C4] transition-colors" />
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#9D83C4] border-[#9D83C4] hover:bg-[#9D83C4]/10"
                  >
                    Upload Photo
                  </Button>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Recommended: Square JPG, PNG. Max 5MB.
                </p>
              </div>

              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe"
                        {...field}
                        className="bg-white border-gray-200 focus:border-[#9D83C4] focus:ring-[#9D83C4]"
                      />
                    </FormControl>
                    <FormDescription>
                      This will be your unique handle on Synapse.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">
                      Bio
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little about yourself..."
                        className="resize-none bg-white border-gray-200 focus:border-[#9D83C4] focus:ring-[#9D83C4]"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Interests */}
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">
                      Interests
                    </FormLabel>
                    <div className="space-y-3">
                      <Select onValueChange={handleInterestSelect}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-gray-200 focus:border-[#9D83C4] focus:ring-[#9D83C4]">
                            <SelectValue placeholder="Select your medical interests" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INTERESTS_LIST.map((interest) => (
                            <SelectItem key={interest} value={interest}>
                              {interest}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="flex flex-wrap gap-2 h-10">
                        {field.value.length > 0 ? (
                          field.value.map((interest) => (
                            <Badge
                              key={interest}
                              variant="secondary"
                              className="bg-[#F7E8FF] text-[#9D83C4] hover:bg-[#F7E8FF]/80 px-3 py-1 text-sm flex items-center gap-1"
                            >
                              {interest}
                              <button
                                type="button"
                                onClick={() => removeInterest(interest)}
                                className="hover:bg-[#9D83C4]/20 rounded-full p-0.5 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-gray-400 italic">
                            No interests selected yet.
                          </p>
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[#9D83C4] hover:bg-[#8B72B0] text-white font-semibold py-6 text-lg shadow-lg shadow-[#9D83C4]/20 transition-all hover:scale-[1.01]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Setting up profile...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
