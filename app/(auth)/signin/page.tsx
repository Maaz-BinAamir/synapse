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

const signInSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 25, duration: 1.4 },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.25 } },
};

export default function SignInPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      try {
        await authClient.signIn.email(values);
        router.push("/");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Signin failed";
        setServerError(message);
      }
    });
  });

  return (
    <div className="flex h-screen">
      {/* Background rectangles */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <RectanglesBackground />
      </div>

      <div className="w-2/3 flex items-center justify-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <Card className="bg-[#ffffff00] border border-transparent shadow-none p-8 rounded-lg w-full flex flex-col justify-center">
            <CardHeader>
              <motion.div variants={popIn}>
                <CardTitle className="text-white text-4xl text-center">
                  Log In
                </CardTitle>
              </motion.div>
            </CardHeader>

            <form onSubmit={onSubmit} className="space-y-4">
              <motion.div variants={popIn}>
                <Label className="flex flex-col gap-1">
                  <span className="text-white text-base">Email</span>
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
                    className="w-1/2 border border-white focus:border-white focus:ring-2 focus:ring-white focus:ring-opacity-50 shadow-sm focus:shadow-md"
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

              {serverError && (
                <motion.p variants={popIn} className="text-sm text-red-500">
                  {serverError}
                </motion.p>
              )}

              <motion.div variants={popIn} className="flex justify-center">
                <Button
                  className="bg-[#9D83C4] hover:bg-[#7a64a8] border border-white px-10 py-5 text-xl"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? "Signing in…" : "Sign in"}
                </Button>
              </motion.div>

              <motion.div variants={popIn}>
                <p className="text-white flex justify-center">
                  Do not have an account?
                  <Link className="underline ml-2" href="/signup">
                    Register now
                  </Link>
                </p>
              </motion.div>

              <motion.div variants={popIn} className="flex justify-center">
                <Button className="bg-[#9D83C4] hover:bg-[#7a64a8] border border-white px-10 py-5 text-xl">
                  Login with Google
                  <FcGoogle size={20} />
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </div>

      <div className="w-1/3 flex items-center justify-center">
        <motion.div
          variants={popIn}
          initial="hidden"
          animate="visible"
          className="relative w-3/4 h-3/4"
        >
          <Image
            src="/signin.png"
            alt="Signin illustration"
            fill
            className="object-contain"
          />
        </motion.div>
      </div>
    </div>
  );
}
