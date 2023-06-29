import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {} from "react";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";

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
      replyToId: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });
  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <hr className="w-full h-px my-6" />
      <CreateComment postId={postId} />

      <div className="flex flex-col gap-y-6 mt-4">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === "UP") return acc + 1;
                else if (vote.type === "DOWN") return acc - 1;
                return acc;
              },
              0
            );

            const topLevelCommentVotes = topLevelComment.votes.find(
              (vote) => vote.userId === session?.user.id
            );
            return (
              <div className="flex flex-col" key={topLevelComment.id}>
                <div className="mb-2">
                  <PostComment
                    comment={topLevelComment}
                    votesAmt={topLevelCommentVotesAmt}
                    currentVote={topLevelCommentVotes}
                    postId={postId}
                  />
                </div>

                {/* Render replies */}
                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((reply) => {
                    const replyVotesAmt = topLevelComment.votes.reduce(
                      (acc, vote) => {
                        if (vote.type === "UP") return acc + 1;
                        else if (vote.type === "DOWN") return acc - 1;
                        return acc;
                      },
                      0
                    );

                    const replyVote = topLevelComment.votes.find(
                      (vote) => vote.userId === session?.user.id
                    );

                    return (
                      <div
                        key={reply.id}
                        className="ml-2 py-2 pl-2 border-l-2 border-zinc-200"
                      >
                        <PostComment comment={ reply } votesAmt={ replyVotesAmt } currentVote={ replyVote } postId={ postId }  />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
}
