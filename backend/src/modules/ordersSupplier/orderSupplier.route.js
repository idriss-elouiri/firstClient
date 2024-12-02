import express from 'express';
import * as orderController from "./orderSupplier.controller.js";

const router = express.Router();

router.post('/create', orderController.createOrderSupplier)
router.get('/getOrders', orderController.getOrders)
router.delete('/delete/:orderId', orderController.deleteOrder)
router.delete('/update/:orderId', orderController.updateOrder)
router.get('/:orderId', orderController.getOrder);




export default router;