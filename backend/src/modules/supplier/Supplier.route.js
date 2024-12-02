import express from 'express';
import * as supplierController from "./Supplier.controller.js";
import { supplierShcema } from './Supplier.shcema.js';
import { validateZod } from '../../middlewares/validate-zod.js';

const router = express.Router();

router.post('/create', validateZod(supplierShcema), supplierController.createSupplier)
router.get('/getSuppliers', supplierController.getSuppliers)
router.delete('/delete/:supplierId', supplierController.deleteSupplier)
router.put('/update/:supplierId', supplierController.updateSupplier)
router.get('/:supplierId', supplierController.getSupplier);




export default router;