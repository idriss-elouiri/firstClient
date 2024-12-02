import express from 'express';
import * as orderController from "./order.controller.js";

const router = express.Router();

router.post('/create', orderController.createOrder)
router.get('/getOrders', orderController.getOrders)
router.delete('/delete/:orderId', orderController.deleteOrder)
router.put('/update/:orderId', orderController.updateOrder)
router.get('/:orderId', orderController.getOrder);




export default router;