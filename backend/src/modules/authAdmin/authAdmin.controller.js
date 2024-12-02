import User from "./authAdmin.models.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../../utils/error.js";

export const registerHandler = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return next(errorHandler(400, "Name, email, and password are required."));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    
    await newUser.save();
    return res.status(201).json("Signup successful"); // Return here to prevent further execution
  } catch (error) {
    if (error.code === 11000) {
      return next(errorHandler(400, "Email already exists."));
    }
    next(error); // Pass the error to the next middleware (error handler)
  }
};


export const loginHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    return res.status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: false, // تأكد من تعيين secure بناءً على البيئة (false في بيئة التطوير)
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};


export const googleHandler = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  
  try {
    const user = await User.findOne({ email });
    let token, newUser;

    if (user) {
      token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      return res.status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest); // Return here to prevent further execution
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      newUser = new User({
        name:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      return res.status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest); // Return here to prevent further execution
    }
  } catch (error) {
    next(error); // Pass the error to the next middleware (error handler)
  }
};
