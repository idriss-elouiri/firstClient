import { errorHandler } from "../../utils/error.js";
import Customer from "./customer.models.js";

export const registerCustomerHandler = async (req, res, next) => {
  try {
    const newCustomer = new Customer({
      ...req.body,
    });

    await newCustomer.save();
    res.status(201).json({ message: "لقد تم انشاء العميل بنجاح" });
  } catch (error) {
    console.error("خطا في اضافة العميل:", error); // Log error for debugging
    next(error);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const customers = await Customer.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalCustomers = await Customer.countDocuments();

    // Count customers created in the last month
    const lastMonthCustomersCount = await Customer.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({
      customers,
      totalCustomers,
      lastMonthCustomers: lastMonthCustomersCount,
    });
  } catch (error) {
    console.error("Error fetching customers:", error); // Log error for debugging
    next(error);
  }
};

export const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.CustomerId);
    if (!customer) {
      return next(errorHandler(404, "Customer not found"));
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error); // Log error for debugging
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
