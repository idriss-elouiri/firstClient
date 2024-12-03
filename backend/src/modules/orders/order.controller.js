import { errorHandler } from "../../utils/error.js";
import Stock from "../stock/stock.models.js";
import Order from "./order.models.js";

export const createOrder = async (req, res, next) => {
  const stock = await Stock.findOne({ farm: req.body.source });

  if (!stock) {
    return res.status(404).send("العنصر غير موجود");
  }

  // التحقق من أن الكمية الموزعة لا تتجاوز الكمية المتاحة
  if (req.body.quantity > stock.quantityAvailable) {
    return res.status(400).send("الكمية الموزعة تتجاوز الكمية المتاحة");
  }

  // تحديث الكمية
  stock.quantityDistributed += req.body.quantity;
  stock.quantityAvailable -= req.body.quantity;

  await stock.save();

  res.status(200).json({ message: "تم تحديث الكمية بنجاح", stock });
  const {
    source,
    destination,
    date,
    quantity,
    unitPrice,
    transportationCost,
    laborCost,
    operationalCost,
  } = req.body;

  // تأكد من أن القيم العددية صحيحة
  const quantityParsed = parseFloat(quantity) || 0;
  const unitPriceParsed = parseFloat(unitPrice) || 0;
  const transportationCostParsed = parseFloat(transportationCost);
  const laborCostParsed = parseFloat(laborCost);
  const operationalCostParsed = parseFloat(operationalCost);

  // حساب التكلفة الإجمالية
  const totalCost =
    quantityParsed * unitPriceParsed +
    transportationCostParsed +
    laborCostParsed +
    operationalCostParsed;
  const newOrder = new Order({
    source,
    destination,
    date,
    quantity,
    unitPrice,
    totalCost,
    transportationCost,
    laborCost,
    operationalCost,
    status: "قيد الانتظار",
    paymentStatus: "غير مدفوع",
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    next(error);
  }
};

// Handler for getting a list of orders with pagination
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("source", "name")
      .populate("destination", "name");

    res.status(200).json({
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Handler for deleting an order
export const deleteOrder = async (req, res, next) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    if (!deletedOrder) {
      return next(errorHandler(404, "Order not found")); // Error if the order doesn't exist
    }
    res.status(200).json({ message: "The order has been deleted" });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { $set: { ...req.body } }, // Use spread operator for flexibility
      { new: true, runValidators: true }
    );
    if (!updateOrder) {
      return next(errorHandler(404, "Order not found")); // Error if the order doesn't exist
    }
    res.status(200).json({ message: "The order has been updated" });
  } catch (error) {
    next(error);
  }
};

// Handler for getting a specific order by ID
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("source", "name")
      .populate("destination", "name"); // Ensure you are using the correct parameter key

    if (!order) {
      return next(errorHandler(404, "Order not found")); // Call errorHandler if order is not found
    }

    res.status(200).json(order); // Return the found order
  } catch (error) {
    console.error("Error retrieving order:", error); // Log error for debugging
    next(error); // Pass any unexpected error to the next error handler
  }
};

export const getOrderCustomer = async (req, res, next) => {
  try {
    const orderCustomer = await Order.find({ customerId: req.params.orderId }); // Ensure you are using the correct parameter key

    if (!orderCustomer) {
      return next(errorHandler(404, "Order not found")); // Call errorHandler if order is not found
    }

    res.status(200).json(orderCustomer); // Return the found order
  } catch (error) {
    console.error("Error retrieving orderCustomer:", error); // Log error for debugging
    next(error); // Pass any unexpected error to the next error handler
  }
};
