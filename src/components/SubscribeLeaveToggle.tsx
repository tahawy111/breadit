"use client";
import { startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggleProps {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
}

export default function SubscribeLeaveToggle({
  subredditId,
  subredditName,
  isSubscribed,
}: SubscribeLeaveToggleProps) {
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post(`/api/subreddit/subscribe`, payload);
      return data as string;
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

      toast({
        title: "There was an problem.",
        description: "Something went wrong, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Subscribed",
        description: `You are now subscribed to r/${subredditName}`,
      });
    },
  });
  const { mutate: unSubscribe, isLoading: isUnSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post(`/api/subreddit/unsubscribe`, payload);
      return data as string;
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

      toast({
        title: "There was an problem.",
        description: "Something went wrong, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "UnSubscribed",
        description: `You are now unsubscribed from r/${subredditName}`,
      });
    },
  });

  return isSubscribed ? (
    <Button
      className="w-full mt-1 mb-4"
      onClick={() => unSubscribe()}
      isLoading={isUnSubLoading}
    >
      Leave community
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      onClick={() => subscribe()}
      isLoading={isSubLoading}
    >
      Join to post
    </Button>
  );
}
