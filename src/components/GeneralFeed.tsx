import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config';
import { db } from '@/lib/db';
import {} from 'react';
import PostFeed from './PostFeed';

interface GeneralFeedProps {
  
}

export default async function GeneralFeed({ }: GeneralFeedProps) {
    const posts = await db.post.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          votes: true,
          author: true,
          comments: true,
          subreddit: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS, // 4 to demonstrate infinite scroll, should be higher in production
      })
    
      return <PostFeed initialPosts={posts} />
}
