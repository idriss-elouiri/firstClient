import { z } from "zod";

export const registerStaffShcema = z.object({
  nameStaff: z.string({ required_error: "name is required" }),
  passwordStaff: z
    .string({ required_error: "password is required" })
    .min(6, { message: "password should be at least 6" }),
});

export const loginStaffShcema = z.object({
  nameStaff: z.string({ required_error: "name is required" }),
  passwordStaff: z
    .string({ required_error: "password is required" })
    .min(6, { message: "password should be at least 6" }),
});
