import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {} from "react";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";
import CommentList from "./CommentList";

interface CommentsSectionProps {
  postId: string;
}

export default async function CommentsSection({
  postId,
}: CommentsSectionProps) {
  const session = await getAuthSession();
  const comments = await db.comment.findMany({
    where: {
      postId,
    },
    include: {
      author: true,
      votes: true,
    },
  });
  const rootComments = comments.filter((comment) => !comment.replyToId);
  console.log(comments.map((cm) => cm.replyToId));
  
  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <hr className="w-full h-px my-6" />
      <CreateComment postId={postId} />

      <div className="mt-4">
        {/* @ts-expect-error server component */}
        <CommentList postId={postId} comments={rootComments} allComments={comments} />
      </div>
    </div>
  );
}
