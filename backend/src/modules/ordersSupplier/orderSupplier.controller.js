import { errorHandler } from "../../utils/error.js";
import OrderSupplier from "./orderSupplier.models.js";

// Handler for creating a new order
export const createOrderSupplier = async (req, res, next) => {
  const {
    farm,
    date,
    quantity,
    unitPrice,
    transportationCost = 0,
    laborCost = 0,
    maintenanceCost = 0,
    operationalCost = 0,
  } = req.body;

  // تأكد من أن القيم العددية صحيحة
  const quantityParsed = parseFloat(quantity) || 0;
  const unitPriceParsed = parseFloat(unitPrice) || 0;
  const transportationCostParsed = parseFloat(transportationCost);
  const laborCostParsed = parseFloat(laborCost);
  const maintenanceCostParsed = parseFloat(maintenanceCost);
  const operationalCostParsed = parseFloat(operationalCost);

  // حساب التكلفة الإجمالية
  const totalCost =
    quantityParsed * unitPriceParsed +
    transportationCostParsed +
    laborCostParsed +
    maintenanceCostParsed +
    operationalCostParsed;

  const newOrder = new OrderSupplier({
    farm,
    date,
    quantity: quantityParsed,
    unitPrice: unitPriceParsed,
    totalCost,
    transportationCost: transportationCostParsed,
    laborCost: laborCostParsed,
    maintenanceCost: maintenanceCostParsed,
    operationalCost: operationalCostParsed,
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
    const ordersSupplier = await OrderSupplier.find().populate("farm", "name");

    res.status(200).json({
      ordersSupplier,
    });
  } catch (error) {
    next(error);
  }
};

// Handler for deleting an order
export const deleteOrder = async (req, res, next) => {
  try {
    const deletedOrder = await OrderSupplier.findByIdAndDelete(
      req.params.orderId
    );
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
    const updateOrder = await OrderSupplier.findByIdAndUpdate(
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
    const order = await OrderSupplier.findById(req.params.orderId); // Ensure you are using the correct parameter key

    if (!order) {
      return next(errorHandler(404, "Order not found")); // Call errorHandler if order is not found
    }

    res.status(200).json(order); // Return the found order
  } catch (error) {
    console.error("Error retrieving order:", error); // Log error for debugging
    next(error); // Pass any unexpected error to the next error handler
  }
};
