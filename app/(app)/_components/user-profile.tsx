"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import PostCard from "./post-card";

interface UserProfileProps {
  username?: string;
}

export default function UserProfile({ username }: UserProfileProps) {
  const currentUser = useQuery(api.auth.getCurrentUser);
  const profileUser = useQuery(
    api.users.getUserByName,
    username ? { username } : "skip"
  );

  const user = username ? profileUser : currentUser;
  const isOwnProfile = currentUser?._id === user?._id;

  const followers = useQuery(
    api.followers.getFollowers,
    user ? { userId: user._id } : "skip"
  );
  const following = useQuery(
    api.followers.getFollowing,
    user ? { userId: user._id } : "skip"
  );
  const posts = useQuery(
    api.posts.getPostsByAuthor,
    user ? { authorId: user._id } : "skip"
  );

  const isFollowing = useQuery(
    api.followers.isFollowing,
    currentUser && user && !isOwnProfile
      ? { followerId: currentUser._id, followingId: user._id }
      : "skip"
  );

  const follow = useMutation(api.followers.followUsers);
  const unfollow = useMutation(api.followers.unfollowUsers);

  const handleFollow = async () => {
    if (!currentUser || !user) return;
    if (isFollowing) {
      await unfollow({ followerId: currentUser._id, followingId: user._id });
    } else {
      await follow({ followerId: currentUser._id, followingId: user._id });
    }
  };

  if (user === undefined) {
    return (
      <div className="min-h-full w-full bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="flex flex-col md:flex-row items-center md:items-start gap-8 p-0">
              <Skeleton className="w-32 h-32 rounded-full" />
              <div className="flex-1 space-y-4 w-full">
                <Skeleton className="h-10 w-48 mx-auto md:mx-0" />
                <div className="flex items-center justify-center md:justify-start gap-8">
                  <Skeleton className="h-12 w-16" />
                  <Skeleton className="h-12 w-20" />
                  <Skeleton className="h-12 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-[#9D83C4]/20" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={i}
                className="border-[#9D83C4]/10 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex gap-6">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        User not found
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="flex flex-col md:flex-row items-center md:items-start gap-8 p-0">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg ring-2 ring-[#9D83C4]/20">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-4xl bg-[#9D83C4]/10 text-[#9D83C4]">
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-4 md:justify-between">
                <h1 className="text-3xl font-bold text-[#9D83C4] font-serif">
                  {user.name}
                </h1>
                {!isOwnProfile && currentUser && (
                  <Button
                    onClick={handleFollow}
                    variant={isFollowing ? "outline" : "default"}
                    className={
                      isFollowing
                        ? "hover:bg-[#9D83C4]/20 hover:text-destructive-foreground border-[#9D83C4]/20 text-[#9D83C4] hover:border-[#9D83C4]/20"
                        : "bg-[#9D83C4] hover:bg-[#8B72B0] text-white shadow-md hover:shadow-lg transition-all"
                    }
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-center md:justify-start gap-8 text-sm">
                <div className="flex flex-col items-center md:items-start">
                  <span className="font-bold text-xl text-gray-800">
                    {posts?.length || 0}
                  </span>
                  <span className="text-gray-500 uppercase text-xs tracking-wider font-medium">
                    Posts
                  </span>
                </div>

                <FollowListDialog
                  title="Followers"
                  userIds={followers?.map((f) => f.followerId) || []}
                  trigger={
                    <button className="flex flex-col items-center md:items-start group cursor-pointer">
                      <span className="font-bold text-xl text-gray-800 group-hover:text-[#9D83C4] transition-colors">
                        {followers?.length || 0}
                      </span>
                      <span className="text-gray-500 uppercase text-xs tracking-wider font-medium group-hover:text-[#9D83C4]/80 transition-colors">
                        Followers
                      </span>
                    </button>
                  }
                />

                <FollowListDialog
                  title="Following"
                  userIds={following?.map((f) => f.followingId) || []}
                  trigger={
                    <button className="flex flex-col items-center md:items-start group cursor-pointer">
                      <span className="font-bold text-xl text-gray-800 group-hover:text-[#9D83C4] transition-colors">
                        {following?.length || 0}
                      </span>
                      <span className="text-gray-500 uppercase text-xs tracking-wider font-medium group-hover:text-[#9D83C4]/80 transition-colors">
                        Following
                      </span>
                    </button>
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="bg-[#9D83C4]/20" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts?.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
          {posts?.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="bg-white/50 rounded-2xl p-8 border-2 border-dashed border-[#9D83C4]/20 inline-block">
                <p className="text-gray-500">No posts yet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FollowListDialog({
  title,
  userIds,
  trigger,
}: {
  title: string;
  userIds: string[];
  trigger: React.ReactNode;
}) {
  const users = useQuery(api.users.getUsers, { userIds });

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {users?.map((user) => (
              <div key={user?._id} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user?.image} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">{user?.name}</h4>
                </div>
              </div>
            ))}
            {users?.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[250px] text-gray-500">
                <p>No users found.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
