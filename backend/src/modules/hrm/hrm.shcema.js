import { z } from "zod";

export const registerStaffShcema = z.object({
  nameStaff: z.string({ required_error: "name is required" }),
  passwordStaff: z
    .string({ required_error: "password is required" })
    .min(6, { message: "password should be at least 6" }),
  numberStaff: z.string({ required_error: "number is required" }),
  isStaff: z.boolean({ required_error: "isStaff is required" }),
});

export const loginStaffShcema = z.object({
  nameStaff: z.string({ required_error: "name is required" }),
  passwordStaff: z
    .string({ required_error: "password is required" })
    .min(6, { message: "password should be at least 6" }),
});
