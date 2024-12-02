import mongoose from "mongoose";

const DistributionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true,
      },
    status: {
      type: String,
      enum: ["Current", "Completed"], // Status options
      default: "Current",
    },
  },
  { timestamps: true }
);

const Distribution = mongoose.model("Distribution", DistributionSchema);

export default Distribution;
