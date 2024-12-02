import express from "express";
import * as distributionController from "./distribution.controller.js";

const router = express.Router();

// Add a new distribution
router.post("/create", distributionController.addDistribution);

// Get all distributions
router.get("/get", distributionController.getDistributions);

// Update a distribution
router.put("/update/:id", distributionController.updateDistribution);

// Delete a distribution
router.delete("/delete/:id", distributionController.deleteDistribution);

export default router;
