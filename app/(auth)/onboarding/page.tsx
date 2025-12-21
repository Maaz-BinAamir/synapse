import ProfileForm from "@/app/(app)/_components/profile-form";
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const isOnboardingComplete = await fetchAuthQuery(
    api.users.isOnboardingComplete,
    {}
  );

  if (isOnboardingComplete) {
    redirect("/dashboard");
  }

  return <ProfileForm />;
}
