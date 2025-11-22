"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import RectanglesBackground from "./RectanglesBackground";
import { FcGoogle } from "react-icons/fc";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 }, // initial like from where to start
  visible: {
    // visible is where it will end
    opacity: 1,
    scale: 1,
    y: 0, // animate to original position
    transition: { type: "spring", stiffness: 90, damping: 25, duration: 1.4 },
  },
};

//considering it all in a div
const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.25 }, // children animate one after another
  },
};

export default function SignUpPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      try {
        await authClient.signUp.email(values);
        router.push("/");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Signup failed";
        setServerError(message);
      }
    });
  });

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background rectangles */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <RectanglesBackground />
      </div>

      <div className="flex h-full">
        {/* Left image  */}
        <motion.div
          className="w-1/3 flex items-center justify-center"
          variants={popIn}
          initial="hidden"
          animate="visible"
        >
          <div className="relative w-3/4 h-3/4">
            <Image
              src="/signup.png"
              alt="Signup illustration"
              fill
              className="object-contain"
            />
          </div>
        </motion.div>

        {/* Right form card */}
        <motion.div
          className="w-2/3 grid place-items-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-[#ffffff00] border border-transparent shadow-none p-8 rounded-lg w-full flex flex-col justify-center">
            <motion.div variants={popIn}>
              <CardHeader>
                <CardTitle className="text-white text-4xl text-center">
                  Sign Up
                </CardTitle>
              </CardHeader>
            </motion.div>

            <motion.form
              variants={staggerContainer}
              onSubmit={onSubmit}
              className="space-y-4"
            >
              <motion.div variants={popIn}>
                <Label className="flex flex-col gap-1">
                  <span className="text-white text-base">Name</span>
                  <Input
                    className="w-1/2 border border-white focus:border-white focus:ring-2 focus:ring-white focus:ring-opacity-50 shadow-sm focus:shadow-md"
                    type="text"
                    {...register("name")}
                    disabled={isPending}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </Label>
              </motion.div>

              <motion.div variants={popIn}>
                <Label className="flex flex-col gap-1 ">
                  <span className="text-white text-base items-start">
                    Email
                  </span>
                  <Input
                    className="w-1/2 border border-white focus:border-white focus:ring-2 focus:ring-white focus:ring-opacity-50 shadow-sm focus:shadow-md"
                    type="email"
                    {...register("email")}
                    disabled={isPending}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </Label>
              </motion.div>

              <motion.div variants={popIn}>
                <Label className="flex flex-col gap-1">
                  <span className="text-white text-base">Password</span>
                  <Input
                    className="w-1/2 border border-white focus:border-white focus:ring-2 focus:ring-white focus:ring-opacity-50 shadow-sm focus:shadow-md mb-8"
                    type="password"
                    {...register("password")}
                    disabled={isPending}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </Label>
              </motion.div>

              {/* Server error */}
              {serverError && (
                <motion.p variants={popIn} className="text-sm text-red-500">
                  {serverError}
                </motion.p>
              )}

              {/* Sign Up button */}
              <motion.div variants={popIn} className="flex justify-center mt-2">
                <Button
                  className="bg-[#9D83C4] hover:bg-[#7a64a8] border border-white px-10 py-5 text-xl"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? "Creating account…" : "Sign up"}
                </Button>
              </motion.div>

              {/* Sign in link */}
              <motion.p
                variants={popIn}
                className="text-white flex justify-center"
              >
                Already have an account?{" "}
                <Link className="underline ml-2" href="/signin">
                  Signin
                </Link>
              </motion.p>

              {/* Google signup */}
              <motion.div variants={popIn} className="flex justify-center">
                <Button className="bg-[#9D83C4] hover:bg-[#7a64a8] border border-white px-10 py-5 text-xl">
                  <FcGoogle size={20} />
                  Signup with Google
                </Button>
              </motion.div>
            </motion.form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
