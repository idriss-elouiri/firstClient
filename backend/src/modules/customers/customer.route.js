import express from "express";
import * as customerController from "./customer.controller.js";

const router = express.Router();

router.post(
  "/registerCustomer",
  customerController.registerCustomerHandler
);
router.get('/getCustomers', customerController.getCustomers);
router.get('/:CustomerId', customerController.getCustomer);
router.put('/update/:CustomerId', customerController.updateCustomer);
router.delete('/delete/:CustomerId', customerController.deleteCustomer);

export default router;