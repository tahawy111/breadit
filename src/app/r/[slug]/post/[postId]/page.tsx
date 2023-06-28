import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { CachedPost } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { notFound } from "next/navigation";
import {} from "react";

interface pageProps {
  params: {
    postId: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function page({ params }: pageProps) {
  const cachedPost = (await redis.hgetall(
    `post:$${params.postId}`
  )) as CachedPost;

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if(!post && !cachedPost) return notFound()

  return <div>
    <div className='h-full flex flex-col sm:flex-row items-center sm:items-start justify-between'>
        
    </div>
  </div>;
}
