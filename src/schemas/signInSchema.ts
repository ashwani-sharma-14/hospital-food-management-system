import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string().min(1, "plase enter your email"),
  password: z.string().min(1, "please enter your password"),
});
