import express from "express";
import * as expenseController from "./expense.controller.js";

const router = express.Router();

router.post("/create", expenseController.create);
router.get("/get", expenseController.getExpenses);
router.get("/:ExpenseId", expenseController.getExpense);
router.put('/update/:ExpenseId', expenseController.updateExpense);
router.delete('/delete/:ExpenseId', expenseController.deleteExpense);

export default router;
