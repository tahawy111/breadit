import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be longer than 3 characters." })
    .max(128, { message: "Title must be less than 128 characters" }),
  subredditId: z.string(),
  content: z.any(),
});

export const SubredditSubscriptionValidator = z.object({
  subredditId: z.string(),
});

// export type CreateSubredditPayload = z.infer<typeof SubredditValidator>;
export type SubscribeToSubredditPayload = z.infer<
  typeof SubredditSubscriptionValidator
>;
