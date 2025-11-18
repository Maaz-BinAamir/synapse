"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";

const signInSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

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
        console.log("Attempting signin with values:", values);
        await authClient.signIn.email(values);
        console.log("Signin successful");
        router.push("/");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Signin failed";
        console.log("message: " + message);
        setServerError(message);
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="flex flex-col gap-1">
        <span>Email</span>
        <input type="email" {...register("email")} disabled={isPending} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </label>

      <label className="flex flex-col gap-1">
        <span>Password</span>
        <input type="password" {...register("password")} disabled={isPending} />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </label>

      {serverError && <p className="text-sm text-red-500">{serverError}</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
