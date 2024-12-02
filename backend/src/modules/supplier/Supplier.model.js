import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  contact: { type: String, required: true },
  email: { type: String },
  orders: [
    {
      date: { type: Date },
      quantity: { type: Number },
      unitPrice: { type: Number },
      totalCost: { type: Number },
    },
  ],
});

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
