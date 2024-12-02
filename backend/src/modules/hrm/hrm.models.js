import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    profilePictureStaff: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    nameStaff: {
      type: String,
      required: true,
    },
    passwordStaff: {
      type: String,
      required: true,
    },
    numberStaff:{
      type: String,
      required: true,
    },
    isStaff: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;
