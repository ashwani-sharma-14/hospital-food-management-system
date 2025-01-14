import * as z from "zod";

export const patientSchema = z.object({
  name: z
    .string()
    .min(2, "Minimum length of name must be 2")
    .max(20, "Name should not be greater than 20")
    .regex(/^[a-zA-Z0-9]+$/, "Name should not contain any special character"),
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/, { message: "Invalid number" }),
  emergencyContact: z
    .string()
    .regex(/^[+]?[0-9]{10,15}$/, { message: "Invalid number" }),
  age: z
    .number()
    .min(1, "Age must be at least 1")
    .max(100, "Age must be 100 or less"),
  floorNumber: z
    .number()
    .min(1, "Floor number must be at least 1")
    .max(4, "Floor number must be 4 or less"),
  roomNumber: z
    .number()
    .min(1, "Room number must be at least 1")
    .max(300, "Room number must be 300 or less"),
  bedNumber: z
    .number()
    .min(1, "Bed number must be at least 1")
    .max(150, "Bed number must be 150 or less"),
  diseases: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  gender: z.string(),
});

export type PatientFormData = z.infer<typeof patientSchema>;
