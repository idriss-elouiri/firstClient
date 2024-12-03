import mongoose from "mongoose";

const orderSupplierSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    date: { type: Date, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    transportationCost: { type: Number, default: 0 }, // تكلفة النقل
    laborCost: { type: Number, default: 0 }, // تكلفة العمالة
    maintenanceCost: { type: Number, default: 0 }, // تكلفة الصيانة
    operationalCost: { type: Number, default: 0 }, // تكلفة التشغيل
    status: {
      type: String,
      enum: ["قيد الانتظار", "تم التوصيل", "تم الإلغاء"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["مدفوع", "غير مدفوع"],
      required: true,
    },
  },
  { timestamps: true }
);

const OrderSupplier = mongoose.model("OrderSupplier", orderSupplierSchema);

export default OrderSupplier;
