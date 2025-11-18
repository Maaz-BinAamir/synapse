"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";

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
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="flex flex-col gap-1">
        <span>Name</span>
        <input type="text" {...register("name")} disabled={isPending} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </label>

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
        {isPending ? "Creating account…" : "Sign up"}
      </button>
    </form>
  );
}
