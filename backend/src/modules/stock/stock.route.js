import express from "express";
import * as stockController from "./stock.controller.js";

const router = express.Router();

router.post("/add-stock", stockController.addStock);
router.get("/current-stock", stockController.currentStock);
router.delete("/delete/:stockId", stockController.deleteStock);
router.put("/update/:stockId", stockController.updateStock);

export default router;
