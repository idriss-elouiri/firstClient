import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    orders: [
      {
        date: { type: Date },
        quantity: { type: Number },
        unitPrice: { type: Number },
        totalCost: { type: Number },
        status: {
          type: String,
          enum: ["pending", "delivered", "canceled"],
          default: "pending",
        },
        paymentStatus: {
          type: String,
          enum: ["paid", "unpaid"],
          default: "unpaid",
        },
      },
    ],
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
