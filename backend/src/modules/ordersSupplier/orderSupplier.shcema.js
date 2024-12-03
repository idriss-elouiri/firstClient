import { z } from "zod";

export const orderShcema = z.object({
  farm: z.string({ required_error: "farm is required" }),
  date: z.date({ required_error: "date is required" }),
  quantity: z.number({ required_error: "quantity is required" }),
  unitPrice: z.number({ required_error: "unitPrice is required" }),
  totalCost: z.number({ required_error: "totalCost is required" }),
  transportationCost: z.number({
    required_error: "transportationCost is required",
  }),
  laborCost: z.number({ required_error: "laborCost is required" }),
  maintenanceCost: z.number({ required_error: "maintenanceCost is required" }),
  transportationCost: z.number({
    required_error: "transportationCost is required",
  }),
  operationalCost: z.number({ required_error: "operationalCost is required" }),
  status: z.string({ required_error: "status is required" }),
  paymentStatus: z.string({ required_error: "paymentStatus is required" }),
});
