import Order from "../orders/order.models.js";
import OrderSupplier from "../ordersSupplier/orderSupplier.models.js";

export const distribution = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await OrderSupplier.aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          totalCost: { $sum: "$totalCost" }, // استخدم totalCost بدلاً من cost
        },
      },
    ]);
    res.status(200).json(report[0] || { totalQuantity: 0, totalCost: 0 }); // التعامل مع الحالة الفارغة
  } catch (error) {
    res.status(500).json({ message: "Error generating report", error });
  }
};


export const unpaidClients = async (req, res) => {
  try {
    // Fetch unpaid orders and populate the source (Supplier) and destination (Customer) fields
    const unpaidClients = await Order.find({
      paymentStatus: "غير مدفوع",
    })
      .populate("source") // Populate Supplier model
      .populate("destination"); // Populate Customer model

    if (!unpaidClients || unpaidClients.length === 0) {
      return res.status(404).json({ message: "No unpaid clients found." });
    }

    res.status(200).json(unpaidClients);
  } catch (error) {
    console.error("Error fetching unpaid clients:", error); // Log the full error for debugging
    res.status(500).json({ message: "Error fetching unpaid clients", error });
  }
};

export const getCostAndProfitReport = async (req, res, next) => {
  try {
    // إجمالي تكلفة الشراء
    const supplierOrders = await OrderSupplier.find();
    const totalPurchaseCost = supplierOrders.reduce((acc, order) => {
      return acc + order.totalCost;
    }, 0);

    // إجمالي الإيرادات
    const salesOrders = await Order.find();
    const totalRevenue = salesOrders.reduce((acc, order) => {
      return acc + order.totalCost;
    }, 0);

    // الأرباح
    const totalProfit = totalRevenue - totalPurchaseCost;

    res.status(200).json({
      totalPurchaseCost,
      totalRevenue,
      totalProfit,
    });
  } catch (error) {
    next(error);
  }
};

export const profitAnalysis = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate if dates are valid
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required" });
    }

    // Parse the date strings
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate total revenue from the Order model (based on date range)
    const revenueData = await Order.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end }, // Filter orders within the date range
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalCost" }, // Sum of totalCost (revenue)
        },
      },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Calculate total expenses from the OrderSupplier model (based on date range)
    const expenseData = await OrderSupplier.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end }, // Filter supplier orders within the date range
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$totalCost" }, // Sum of totalCost (expenses)
          totalTransportationCost: { $sum: "$transportationCost" },
          totalLaborCost: { $sum: "$laborCost" },
          totalMaintenanceCost: { $sum: "$maintenanceCost" },
          totalOperationalCost: { $sum: "$operationalCost" },
        },
      },
    ]);

    const totalExpense =
      expenseData.length > 0 ? expenseData[0].totalExpense : 0;
    const totalTransportationCost =
      expenseData.length > 0 ? expenseData[0].totalTransportationCost : 0;
    const totalLaborCost =
      expenseData.length > 0 ? expenseData[0].totalLaborCost : 0;
    const totalMaintenanceCost =
      expenseData.length > 0 ? expenseData[0].totalMaintenanceCost : 0;
    const totalOperationalCost =
      expenseData.length > 0 ? expenseData[0].totalOperationalCost : 0;

    const profit = totalRevenue - totalExpense;

    res.status(200).json({
      totalRevenue,
      totalExpense,
      profit,
      totalTransportationCost,
      totalLaborCost,
      totalMaintenanceCost,
      totalOperationalCost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error analyzing profit", error });
  }
};
