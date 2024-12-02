import { errorHandler } from "../../utils/error.js";
import User from "../authAdmin/authAdmin.models.js";
import bcryptjs from "bcryptjs";
import Staff from "../hrm/hrm.models.js";
import Customer from "../customers/customer.models.js";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const updateStaff = async (req, res, next) => {
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
