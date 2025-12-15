import UserProfile from "@/app/(app)/_components/user-profile";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <UserProfile username={username} />;
}
