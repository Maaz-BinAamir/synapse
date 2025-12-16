"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { INTERESTS_LIST } from "@/lib/constants";

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
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
  interests: z
    .array(z.string())
    .min(0)
    .max(10, { message: "You can select up to 10 interests." }),
});

// Todo: Fix the user type, this is just a temporary fix
interface ProfileFormProps {
  user?: {
    username?: string;
    bio?: string;
    interests?: string[];
    avatar?: string;
  };
  onClose?: () => void;
}

export default function ProfileForm({ user, onClose }: ProfileFormProps) {
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const mode = user ? "edit" : "onboarding";

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(
    user?.avatar || null
  );
  const [openInterestCombo, setOpenInterestCombo] = useState(false);
  const [interestInput, setInterestInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || "",
      bio: user?.bio || "",
      interests: user?.interests || [],
    },
  });

  const { isSubmitting } = form.formState;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setCurrentAvatar(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInterestSelect = (value: string) => {
    const currentInterests = form.getValues("interests");
    if (!currentInterests.includes(value) && currentInterests.length < 10) {
      form.setValue("interests", [...currentInterests, value]);
      setInterestInput("");
      setOpenInterestCombo(false);
    }
  };

  const handleAddCustomInterest = () => {
    const trimmed = interestInput.trim();
    const currentInterests = form.getValues("interests");
    if (
      trimmed &&
      !currentInterests.includes(trimmed) &&
      currentInterests.length < 10
    ) {
      form.setValue("interests", [...currentInterests, trimmed]);
      setInterestInput("");
      setOpenInterestCombo(false);
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

      const payload: {
        username: string;
        bio: string;
        interests: string[];
        avatar?: Id<"_storage">;
        hasRemovedAvatar?: boolean;
      } = {
        username: values.username,
        bio: values.bio || "",
        interests: values.interests,
        hasRemovedAvatar: currentAvatar === null,
      };

      if (storageId !== undefined) {
        payload.avatar = storageId;
        payload.hasRemovedAvatar = false;
      }

      await updateProfile({ ...payload });

      toast.success(
        mode === "edit"
          ? "Profile updated successfully!"
          : "Welcome to Synapse!"
      );

      if (mode === "edit" && onClose) {
        onClose();
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const displayAvatar = currentAvatar;

  return (
    <div
      className={
        mode === "onboarding"
          ? "min-h-screen w-full bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] flex items-center justify-center p-4"
          : ""
      }
    >
      <Card
        className={
          mode === "onboarding"
            ? "w-full max-w-2xl shadow-xl border-none bg-white/80 backdrop-blur-sm"
            : "w-full border-none shadow-none"
        }
      >
        {mode === "onboarding" && (
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-[#9D83C4] font-serif">
              Welcome to Synapse
            </CardTitle>
            <CardDescription className="text-gray-500 text-lg">
              Let&apos;s set up your profile to get you started
            </CardDescription>
          </CardHeader>
        )}
        {mode === "edit" && (
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#9D83C4]">
              Edit Profile
            </CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
        )}
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-[#9D83C4]/20">
                    {displayAvatar ? (
                      <AvatarImage
                        src={displayAvatar}
                        alt="Avatar preview"
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-gray-100">
                        <Upload className="w-10 h-10 text-gray-400" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
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
                  {displayAvatar && (
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
                      <Popover
                        open={openInterestCombo}
                        onOpenChange={setOpenInterestCombo}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openInterestCombo}
                            disabled={field.value.length >= 10}
                            className="w-full justify-between bg-white border-gray-200 hover:bg-white focus:border-[#9D83C4] focus:ring-[#9D83C4]"
                          >
                            {field.value.length >= 10
                              ? "Maximum interests reached (10/10)"
                              : "Select or add interests..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search or type to add..."
                              value={interestInput}
                              onValueChange={setInterestInput}
                            />
                            <CommandList>
                              <CommandEmpty>
                                <div className="p-2">
                                  <p className="text-sm text-gray-500 mb-2">
                                    No results found.
                                  </p>
                                  {interestInput.trim() &&
                                    field.value.length < 10 && (
                                      <Button
                                        size="sm"
                                        onClick={handleAddCustomInterest}
                                        className="w-full bg-[#9D83C4] hover:bg-[#8B72B0]"
                                      >
                                        Add &quot;{interestInput.trim()}&quot;
                                      </Button>
                                    )}
                                </div>
                              </CommandEmpty>
                              <CommandGroup>
                                {INTERESTS_LIST.filter(
                                  (interest) => !field.value.includes(interest)
                                ).map((interest) => (
                                  <CommandItem
                                    key={interest}
                                    value={interest}
                                    onSelect={() =>
                                      handleInterestSelect(interest)
                                    }
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

                      <div className="flex flex-wrap gap-2 min-h-10">
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
                      <p className="text-xs text-gray-500">
                        {field.value.length}/10 interests selected. Choose from
                        list or add custom interests.
                      </p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                {mode === "edit" && onClose && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  className={`${
                    mode === "edit" ? "flex-1" : "w-full"
                  } bg-[#9D83C4] hover:bg-[#8B72B0] text-white font-semibold py-6 text-lg shadow-lg shadow-[#9D83C4]/20 transition-all hover:scale-[1.01]`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {mode === "edit"
                        ? "Updating..."
                        : "Setting up profile..."}
                    </>
                  ) : mode === "edit" ? (
                    "Save Changes"
                  ) : (
                    "Complete Profile"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
