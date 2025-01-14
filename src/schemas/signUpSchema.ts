import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "minimum Lenght of name must be 2 ")
    .max(20, "name should not greater than 10")
    .regex(/^[a-zA-Z0-9]+$/, "name should not contain ant special character"),
  email: z.string().email({ message: "email is not valid" }),
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/, { message: "invalid number" }),
  password: z
    .string()
    .min(6, { message: "passwordshould at least 6 characters  long" })
    .max(16, { message: "password should not exceed more than 16 characters" }),
});
