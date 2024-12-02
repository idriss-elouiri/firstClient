import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    date: { type: Date, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    transportationCost: { type: Number, default: 0 }, // تكلفة النقل
    laborCost: { type: Number, default: 0 }, // تكلفة العمالة
    operationalCost: { type: Number, default: 0 }, // تكلفة التشغيل
    status: {
      type: String,
      enum: ["pending", "delivered", "canceled"],
      required: true,
    },
    paymentStatus: { type: String, enum: ["paid", "unpaid"], required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
