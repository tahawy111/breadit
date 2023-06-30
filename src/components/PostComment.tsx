"use client";
import { useId, useRef, useState } from "react";
import UserAvatar from "./UserAvatar";
import { Comment, CommentVote, User, VoteType } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import CommentVotes from "./CommentVotes";
import { Button } from "./ui/Button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import CommentList from "./CommentList";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface PostCommentProps {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: CommentVote | undefined;
  postId: string;
  comments: ExtendedComment[];
}

export default function PostComment({
  comment,
  votesAmt,
  currentVote,
  postId,
  comments,
}: PostCommentProps) {
  const commentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const { data: session } = useSession();
  const inputCommentId = useId();
  const [rootReplyCommentId, setRootReplyCommentId] = useState<string>("")

  const { mutate: reply, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = { postId, text, replyToId };

      const { data } = await axios.patch(
        `/api/subreddit/post/comment/`,
        payload
      );
      return data;
    },

    onError: () => {
      return toast({
        title: "Something went wrong.",
        description: "Comment wasn't created successfully. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setIsReplying(false);
    },
  });

  const childComments = comments.filter((cm) => cm.replyToId === comment.id);

  
  
  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="w-6 h-6"
        />

        <div className="flex ml-2 items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>

      <div className="flex gap-2 items-center flex-wrap">
        <CommentVotes
          commentId={comment.id}
          initialVoteAmt={votesAmt}
          initialVote={currentVote}
        />

        <Button
          onClick={() => {
            if (!session) return router.push("/sign-in");
            setIsReplying(true);
            setRootReplyCommentId(comment.id)
          }}
          variant={"ghost"}
          size={"xs"}
        >
          <MessageSquare className="h-4 w-4 mr-1.5" />
          Reply
        </Button>

        {isReplying && (
          <div className="grid w-full gap-1.5">
            <Label className="cursor-pointer" htmlFor={inputCommentId}>
              Your Comment
            </Label>
            <div className="mt-2">
              <Textarea
                id={inputCommentId}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder={`What are you thoughts?`}
              />

              <div className="mt-2 flex justify-end">
                <Button
                  onClick={() => {
                    if (!input) return;
                    reply({
                      postId,
                      text: input,
                      replyToId: rootReplyCommentId && rootReplyCommentId,
                    });
                  }}
                  isLoading={isLoading}
                  disabled={input.length === 0}
                >
                  Post
                </Button>
                <Button
                  className="mx-2"
                  variant={"subtle"}
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="ml-10 py-3 pl-10">
        {/* @ts-expect-error server component */}
        <CommentList comments={childComments} postId={postId} allComments={comments} />
      </div>
    </div>
  );
}
