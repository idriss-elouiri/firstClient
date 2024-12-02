import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    quantityReceived: Number, // الكمية الواردة
    quantityAvailable: Number, // الكمية المتاحة في المخزن
    quantityDistributed: Number, // الكمية الموزعة للمحلات
    dateReceived: Date,
  },
  { timestamps: true }
);

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;
