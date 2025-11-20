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

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

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
        console.log("Attempting signin with values:", values);
        await authClient.signUp.email(values);
        console.log("Signup successful");
        router.push("/");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Signup failed";
        console.log("message: " + message);
        setServerError(message);
      }
    });
  });

  return (
    <div className="flex h-screen">
      <div className="w-1/3 flex items-center justify-center">
        <div className="relative w-3/4 h-3/4">
          <Image
            src="/signup.png"
            alt="Signup illustration"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="w-2/3 grid place-items-center">
        <Card className="bg-[#9D83C4] p-8 rounded-lg w-full h-full flex flex-col justify-center">
          <CardHeader>
            <CardTitle className="text-white text-4xl text-center">
              Sign Up
            </CardTitle>
          </CardHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <Label className="flex flex-col gap-1">
              <span className="text-white">Name</span>
              <Input
                className="w-1/2"
                type="text"
                {...register("name")}
                disabled={isPending}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </Label>

            <Label className="flex flex-col gap-1">
              <span className="text-white">Email</span>
              <Input
                className="w-1/2"
                type="email"
                {...register("email")}
                disabled={isPending}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </Label>

            <Label className="flex flex-col gap-1">
              <span className="text-white">Password</span>
              <Input
                className="w-1/2"
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

            {serverError && (
              <p className="text-sm text-red-500">{serverError}</p>
            )}

            <div className="flex justify-center">
              <Button
                className="bg-[#9D83C4] hover:bg-[#7a64a8] border border-white px-10 py-5 text-2xl"
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Creating account…" : "Sign up"}
              </Button>
            </div>

            <p className="text-white flex justify-center">
              Already have an account?{" "}
              <Link className=" underline ml-2" href="/signin">
                Signin
              </Link>
            </p>

            <div className="flex justify-center">
              <Button className="bg-[#9D83C4] hover:bg-[#7a64a8] border border-white px-10 py-5 text-2xl">
                Signup with Google
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
