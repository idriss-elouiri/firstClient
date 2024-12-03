import express from "express";
import * as reportController from "./report.controller.js";

const router = express.Router();

// Add a new distribution
router.get("/distribution", reportController.distribution);

// Get all distributions
router.get("/unpaid-clients", reportController.unpaidClients);

router.get("/getReports", reportController.getCostAndProfitReport);

router.get("/profit-analysis", reportController.profitAnalysis);

export default router;
