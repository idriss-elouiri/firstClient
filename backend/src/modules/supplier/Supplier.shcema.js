import { z } from "zod";

export const supplierShcema = z.object({
  name: z.string({ required_error: "name is required" }),
  location: z.string({ required_error: "location is required" }),
  contact: z.string({ required_error: "contact is required" }),
});
