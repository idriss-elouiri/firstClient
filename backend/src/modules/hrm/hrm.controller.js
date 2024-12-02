import bcryptjs from "bcryptjs";
import { errorHandler } from "../../utils/error.js";
import jwt from "jsonwebtoken";
import Staff from "./hrm.models.js";
import Customer from "../customers/customer.models.js";

// Handler for staff registration
export const registerStaffHandler = async (req, res, next) => {
  const {
    profilePictureStaff,
    nameStaff,
    passwordStaff,
    numberStaff,
    isStaff,
  } = req.body;

  try {
    // Validate input fields before proceeding
    if (!nameStaff || !passwordStaff) {
      return next(errorHandler(400, "Name, email, and password are required."));
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(passwordStaff, 10);

    const newStaff = new Staff({
      profilePictureStaff,
      nameStaff,
      passwordStaff: hashedPassword,
      numberStaff,
      isStaff,
    });

    await newStaff.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    next(error);
  }
};

// Handler for staff login
export const loginStaffHandler = async (req, res, next) => {
  const { nameStaff, passwordStaff } = req.body;

  try {
    const validStaff = await Staff.findOne({ nameStaff });
    if (!validStaff) {
      return next(errorHandler(404, "Staff not found"));
    }

    const validPassword = bcryptjs.compareSync(
      passwordStaff,
      validStaff.passwordStaff
    );
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: validStaff._id, isStaff: validStaff.isStaff },
      process.env.JWT_SECRET
    );

    // Omit password from response
    const { passwordStaff: pass, ...rest } = validStaff._doc;

    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true, secure: false }) // Set secure to true in production
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Handler for updating staff details
export const updateStaff = async (req, res, next) => {
  if (req.user.id !== req.params.staffId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  try {
    const { passwordStaff } = req.body;

    // Hash password only if it's provided
    if (passwordStaff) {
      req.body.passwordStaff = bcryptjs.hashSync(passwordStaff, 10);
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.staffId,
      { $set: { ...req.body } }, // Use spread operator to update all fields
      { new: true }
    );

    // Check if staff was found
    if (!updatedStaff) {
      return next(errorHandler(404, "Staff not found"));
    }

    // Omit password from response
    const { passwordStaff: pass, ...rest } = updatedStaff._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Handler for deleting a staff member
export const deleteStaff = async (req, res, next) => {
  if (req.user.id !== req.params.staffId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.staffId);
    if (!deletedStaff) {
      return next(errorHandler(404, "Staff not found"));
    }
    res.status(200).json({ message: "Staff has been deleted" });
  } catch (error) {
    next(error);
  }
};

// Handler for staff signout
export const signoutStaff = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Staff has been signed out" });
  } catch (error) {
    next(error);
  }
};

// Handler for getting all staff
export const getStaffs = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const staffs = await Staff.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const staffsWithoutPassword = staffs.map((staff) => {
      const { passwordStaff, ...rest } = staff._doc;
      return rest;
    });

    const totalStaffs = await Staff.countDocuments();
    const lastMonthStaffs = await Staff.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // 30 days ago
    });

    res.status(200).json({
      staffs: staffsWithoutPassword,
      totalStaffs,
      lastMonthStaffs,
    });
  } catch (error) {
    next(error);
  }
};

// Handler for getting a single staff member
export const getStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.staffId);
    if (!staff) {
      return next(errorHandler(404, "Staff not found"));
    }

    const { passwordStaff, ...rest } = staff._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.CustomerId,
      { $set: { ...req.body } }, // Use spread operator to update all fields
      { new: true }
    );

    // Check if staff was found
    if (!updatedCustomer) {
      return next(errorHandler(404, "العميل غير موجود"));
    }

    // Omit password from response
    res.status(200).json("معلومات العميل عدلت بنجاح");
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(
      req.params.CustomerId
    );
    if (!deletedCustomer) {
      return next(errorHandler(404, "العميل غير موجود"));
    }
    res.status(200).json({ message: "العميل حذف بنجاح" });
  } catch (error) {
    console.error("خطا في حذف العميل:", error); // Log error for debugging
    next(error);
  }
};
