import { z } from "zod";

export const orderShcema = z.object({
  customerName: z.string({ required_error: "name is required" }),
  customerId: z.string({ required_error: "customerId is required" }),
  productName: z.string({ required_error: "productName is productName" }),
  orderCode: z
    .string({ required_error: "productCode is required" }),
    productPrice: z.string({ required_error: "productPrice is required" }),
    productQty: z.string({ required_error: "productQty is required" }),

});
