"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CreateSubredditPayload } from "@/lib/validators/subreddit";
import { toast } from "@/hooks/use-toast";

export default function Page() {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      };

      const { data } = await axios.post(`/api/subreddit`, payload);

      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Subreddit already exists.",
            description: "Please choose a diffrent name.",
            variant: "destructive",
          });
        }
      }
      if (err instanceof AxiosError) {
        if (err.response?.status === 422) {
          return toast({
            title: "Invalid subreddit name.",
            description: "Please choose a name between 3 and 21 characters.",
            variant: "destructive",
          });
        }
      }
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast({
            title: "Login required.",
            description: "You need to be logged in to do that.",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "There was an error.",
        description: "Could not create a subreddit.",
        variant: "destructive",
      });
    },
    onSuccess(data) {
      router.push(`/r/${data}`);
    },
  });
  return (
    <div className="container flex items-center h-ful max-w-3xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create a Community</h1>
        </div>

        <hr className="bg-zinc-500 h-px" />

        <div className="">
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs pb-2">
            Community names including capitalizations cannot be changed.
          </p>

          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-0 grid place-items-center text-zinc-400">
              r/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant={"subtle"} onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            onClick={() => {
              if (input.includes(" "))
                return toast({
                  title: "Community name should not has a whitespaces",
                  description: "Please remove a whitespaces and try again.",
                });
              createCommunity();
            }}
            disabled={input.length === 0}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
}
