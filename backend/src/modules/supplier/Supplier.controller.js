import { errorHandler } from "../../utils/error.js";
import Supplier from "./Supplier.model.js";

export const createSupplier = async (req, res, next) => {
  const newSupplier = new Supplier({
    ...req.body,
  });

  try {
    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    console.error("Error creating Supplier:", error); // Log error for debugging
    next(error);
  }
};

export const getSuppliers = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const suppliers = await Supplier.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalSuppliers = await Supplier.countDocuments();

    // Get the count of Suppliers created in the last month
    const lastMonthSuppliersCount = await Supplier.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({
      suppliers,
      totalSuppliers,
      lastMonthSuppliers: lastMonthSuppliersCount,
    });
  } catch (error) {
    console.error("Error fetching Suppliers:", error); // Log error for debugging
    next(error);
  }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(
      req.params.supplierId
    );
    if (!deletedSupplier) {
      return next(errorHandler(404, "Supplier not found"));
    }
    res.status(200).json({ message: "The Supplier has been deleted" });
  } catch (error) {
    console.error("Error deleting Supplier:", error); // Log error for debugging
    next(error);
  }
};

export const updateSupplier = async (req, res, next) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.supplierId,
      { $set: { ...req.body } }, // Use spread operator for flexibility
      { new: true, runValidators: true } // Ensures validation on update
    );

    if (!updatedSupplier) {
      return next(errorHandler(404, "Supplier not found"));
    }

    res.status(200).json(updatedSupplier);
  } catch (error) {
    console.error("Error updating Supplier:", error); // Log error for debugging
    next(error);
  }
};

export const getSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.supplierId);
    if (!supplier) {
      return next(errorHandler(404, "Supplier not found"));
    }
    res.status(200).json(supplier);
  } catch (error) {
    console.error("Error fetching Supplier:", error); // Log error for debugging
    next(error);
  }
};
