import Order from "../orders/order.models.js";
import OrderSupplier from "../ordersSupplier/orderSupplier.models.js";
import Stock from "./stock.models.js";

// Handler for creating a new order
export const addStock = async (req, res, next) => {
  const { farm, quantityReceived, dateReceived } = req.body;

  if (!farm || quantityReceived <= 0 || !dateReceived) {
    return res.status(400).send("البيانات المدخلة غير صحيحة");
  }

  // إضافة سجل جديد
  const newStock = new Stock({
    farm,
    quantityReceived,
    quantityAvailable: quantityReceived,
    quantityDistributed: 0,
    dateReceived,
  });

  await newStock.save();
};

export const currentStock = async (req, res) => {
  try {
    const stocks = await Stock.find().populate("farm", "name");
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).send("حدث خطأ أثناء جلب تقرير المخزون");
  }
};

export const deleteStock = async (req, res, next) => {
  try {
    const deletedStock = await Stock.findByIdAndDelete(req.params.stockId);
    if (!deletedStock) {
      return next(errorHandler(404, "Stock not found")); // Error if the order doesn't exist
    }
    res.status(200).json({ message: "The stock has been deleted" });
  } catch (error) {
    next(error);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const { farm, quantityReceived, dateReceived } = req.body;

    // تحديث الكميات في المخزون

    // تحديث السجل بناءً على الطلب (إذا كان ذلك مطلوبًا)
    const updatedStock = await Stock.findByIdAndUpdate(
      req.params.stockId,
      {
        $set: {
          farm,
          quantityReceived,
          quantityAvailable: quantityReceived,
          dateReceived,
        },
      }, // استخدام المشغل الانتشاري لتحديث الحقول المطلوبة
      { new: true, runValidators: true }
    );

    if (!updatedStock) {
      return next(new Error("Stock not found")); // رسالة خطأ إذا لم يتم العثور على السجل
    }

    res
      .status(200)
      .json({ message: "The stock has been updated", updatedStock });
  } catch (error) {
    next(error); // تمرير الخطأ إلى معالج الأخطاء
  }
};


