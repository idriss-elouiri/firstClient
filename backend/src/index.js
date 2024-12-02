import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import authRouter from "./modules/authAdmin/authAdmin.route.js";
import customerRouter from "./modules/customers/customer.route.js";
import hrmRouter from "./modules/hrm/hrm.route.js";
import userRouter from "./modules/user/user.route.js";
import expenseRouter from "./modules/expense/expense.route.js";
import orderRouter from "./modules/orders/order.route.js";
import ordersSupplierRouter from "./modules/ordersSupplier/orderSupplier.route.js";
import stockRouter from "./modules/stock/stock.route.js";
import supplierRouter from "./modules/supplier/Supplier.route.js";
import distributionRouter from "./modules/distribution/distribution.route.js";
import reportRouter from "./modules/report/report.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();
dotenv.config();

connectDb();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/hrm", hrmRouter);
app.use("/api/customers", customerRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/ordersSupplier", ordersSupplierRouter);
app.use("/api/stock", stockRouter);
app.use("/api/suppliers", supplierRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/distributions", distributionRouter);
app.use("/api/report", reportRouter);

app.get("/*", (req, res) => {
  res.json("hello world");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
