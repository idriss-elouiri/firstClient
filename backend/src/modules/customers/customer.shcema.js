import { z } from "zod";

export const registerCustomerShcema = z.object({
  nameCustomer: z.string({ required_error: "الاسم مطلوب" }),
  address: z.string({ required_error: "العنوان مطلوب" }),

  contact: z.string({ required_error: "رقم الهاتف مطلوب" }),
});
