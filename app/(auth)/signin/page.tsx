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
import { m, Variants } from "framer-motion";
import RectanglesBackground from "./_components/background";
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
        const response = await authClient.signIn.email(values);
        console.log("Signin response:", response);

        if (response.error) {
          throw Error(response.error.message || "Signin failed");
        }

        router.push("/dashboard");
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
        <m.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-1/2"
        >
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl p-8 rounded-2xl w-full flex flex-col justify-center">
            <CardHeader>
              <m.div variants={popIn}>
                <CardTitle className="text-white text-4xl text-center">
                  Sign In
                </CardTitle>
              </m.div>
            </CardHeader>

            <form
              onSubmit={onSubmit}
              className="space-y-4 flex flex-col items-center"
            >
              <m.div variants={popIn} className="w-4/5">
                <Label className="flex flex-col gap-1 items-start">
                  <span className="text-white text-base">Email</span>
                  <Input
                    className="w-full border border-white focus-visible:border-[#9D83C4] focus-visible:ring-[#9D83C4]/20"
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
              </m.div>

              <m.div variants={popIn} className="w-4/5">
                <Label className="flex flex-col gap-1 items-start">
                  <span className="text-white text-base">Password</span>
                  <Input
                    className="w-full border border-white focus-visible:border-[#9D83C4] focus-visible:ring-[#9D83C4]/20"
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
              </m.div>
              {serverError && (
                <m.p
                  variants={popIn}
                  initial="hidden"
                  animate="visible"
                  className="text-sm text-red-500"
                >
                  {serverError}
                </m.p>
              )}

              <m.div variants={popIn} className="flex justify-center">
                <Button
                  className="bg-[#9D83C4] hover:bg-[#7a64a8] border border-white px-10 py-5 text-xl"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? "Signing In…" : "Sign In"}
                </Button>
              </m.div>

              <m.div variants={popIn}>
                <p className="text-white flex justify-center">
                  Do not have an account?
                  <Link className="underline ml-2" href="/signup">
                    Register now
                  </Link>
                </p>
              </m.div>

              <m.div variants={popIn} className="flex justify-center">
                <Button
                  className="bg-[#9D83C4] hover:bg-[#7a64a8] border border-white px-10 py-5 text-xl"
                  type="button"
                  onClick={async () => {
                    await authClient.signIn.social({
                      provider: "google",
                      callbackURL: "/onboarding",
                    });
                  }}
                >
                  Sign In with Google
                  <FcGoogle size={20} />
                </Button>
              </m.div>
            </form>
          </Card>
        </m.div>
      </div>

      <div className="w-1/3 flex items-center justify-center">
        <m.div
          variants={popIn}
          initial="hidden"
          animate="visible"
          className="relative w-3/4 h-3/4"
        >
          <Image
            src="/signin.png"
            alt="Signin illustration"
            fill
            sizes="(max-width: 768px) 75vw, 25vw"
            className="object-contain"
          />
        </m.div>
      </div>
    </div>
  );
}
