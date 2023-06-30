"use client";
import { useId, useState } from "react";
import { CommentRequest } from "@/lib/validators/comment";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

export default function CreateComment({
  postId,
  replyToId,
}: CreateCommentProps) {
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const inputCommentId = useId()
  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = { postId, text, replyToId };

      console.log(payload);
      

      // const { data } = await axios.patch(
      //   `/api/subreddit/post/comment/`,
      //   payload
      // );
      // return data;
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast({
            title: "Login required.",
            description: "You need to be logged in to do that.",
            variant: "destructive",
          });
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Comment wasn't created successfully. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setInput("");
    },
  });

  return (
    <div className="grid w-full gap-1.5">
        <Label className="cursor-pointer" htmlFor={inputCommentId}>Your Comment</Label>
        <div className="mt-2">
          <Textarea
            id={inputCommentId}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            placeholder={`What are you thoughts?`}
          />

          <div className="mt-2 flex justify-end">
            <Button onClick={() => comment({ postId, text: input, replyToId })} isLoading={isLoading} disabled={input.length === 0}>
              Post
            </Button>
          </div>
        </div>
    </div>
  );
}
