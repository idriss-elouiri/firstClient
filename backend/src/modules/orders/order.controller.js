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
  stock.quantityDistributed =
    Number(stock.quantityDistributed) + Number(req.body.quantity);
  stock.quantityAvailable =
    Number(stock.quantityAvailable) - Number(req.body.quantity);

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
    // البحث عن الطلب الذي سيتم حذفه
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).send("الطلب غير موجود");
    }

    // البحث عن المخزون المرتبط بالمصدر
    const stock = await Stock.findOne({ farm: order.source });
    if (!stock) {
      return res.status(404).send("المخزون المرتبط غير موجود");
    }

    // تحديث الكميات في المخزون

    stock.quantityDistributed =
      Number(stock.quantityDistributed) - Number(order.quantity);
    stock.quantityAvailable =
      Number(stock.quantityAvailable) + Number(order.quantity);

    await stock.save(); // حفظ التغييرات في المخزون

    // حذف الطلب
    await Order.findByIdAndDelete(req.params.orderId);

    res.status(200).json({ message: "تم حذف الطلب وتحديث المخزون" });
  } catch (error) {
    next(error); // تمرير الخطأ إلى معالج الأخطاء
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    // البحث عن الطلب الذي سيتم تحديثه
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).send("الطلب غير موجود");
    }

    // البحث عن المخزون المرتبط بالمصدر
    const stock = await Stock.findOne({ farm: order.source });
    if (!stock) {
      return res.status(404).send("المخزون المرتبط غير موجود");
    }

    // التحقق من الكمية الجديدة مقارنة بالكمية القديمة
    const quantityDifference = req.body.quantity - order.quantity;

    // إذا كانت الكمية الجديدة تتطلب توزيعًا إضافيًا، تحقق من الكمية المتاحة
    if (
      quantityDifference > 0 &&
      quantityDifference > stock.quantityAvailable
    ) {
      return res.status(400).send("الكمية الجديدة تتجاوز الكمية المتاحة");
    }

    stock.quantityDistributed =
      Number(stock.quantityDistributed) + Number(quantityDifference);
    stock.quantityAvailable =
      Number(stock.quantityAvailable) - Number(quantityDifference);

    await stock.save(); // حفظ التغييرات في المخزون

    // تحديث الطلب
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { $set: { ...req.body } }, // تحديث الطلب بالقيم الجديدة
      { new: true, runValidators: true }
    );

    res
      .status(200)
      .json({ message: "تم تحديث الطلب وتحديث المخزون", updatedOrder });
  } catch (error) {
    next(error); // تمرير الخطأ إلى معالج الأخطاء
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
