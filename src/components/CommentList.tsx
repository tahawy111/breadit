"use client";
import { Comment, CommentVote, User } from "@prisma/client";
import {} from "react";
import PostComment from "./PostComment";
import { getAuthSession } from "@/lib/auth";
import { useSession } from "next-auth/react";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface CommentListProps {
  comments: ExtendedComment[];
  allComments: ExtendedComment[];
  postId: string;
}

export default function CommentList({ comments, postId,allComments }: CommentListProps) {
  const { data: session } = useSession();
  return comments.map((comment) => {
      const replyVotesAmt = comment.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1;
        else if (vote.type === "DOWN") return acc - 1;
        return acc;
      }, 0);

      const replyVote = comment.votes.find(
        (vote) => vote.userId === session?.user.id
      );

      return (
        <div className="" key={comment.id}>
          <PostComment
            comment={comment}
            comments={allComments}
            votesAmt={replyVotesAmt}
            currentVote={replyVote}
            postId={postId}
          />
        </div>
      );
    });
}
