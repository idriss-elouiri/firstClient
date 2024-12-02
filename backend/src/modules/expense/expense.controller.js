import { errorHandler } from "../../utils/error.js";
import Expense from "./expense.models.js";

export const create = async (req, res, next) => {
  try {
    const newExpense = new Expense({
      ...req.body,
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    console.error("خطا في اضافة هذا:", error); // Log error for debugging
    next(error);
  }
};

export const getExpenses = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const expenses = await Expense.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalExpenses = await Expense.countDocuments();

    // Count customers created in the last month
    const lastMonthExpensesCount = await Expense.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({
      expenses,
      totalExpenses,
      lastMonthExpense: lastMonthExpensesCount,
    });
  } catch (error) {
    console.error("Error fetching customers:", error); // Log error for debugging
    next(error);
  }
};

export const getExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.ExpenseId);
    if (!expense) {
      return next(errorHandler(404, "expense not found"));
    }
    res.status(200).json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error); // Log error for debugging
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.ExpenseId,
      { $set: { ...req.body } }, // Use spread operator to update all fields
      { new: true }
    );

    // Check if staff was found
    if (!updatedExpense) {
      return next(errorHandler(404, " غير موجود"));
    }

    // Omit password from response
    res.status(200).json("معلومات  عدلت بنجاح");
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(
      req.params.ExpenseId
    );
    if (!deletedExpense) {
      return next(errorHandler(404, "غير موجود"));
    }
    res.status(200).json({ message: " حذف بنجاح" });
  } catch (error) {
    console.error("خطا في حذف :", error); // Log error for debugging
    next(error);
  }
};
