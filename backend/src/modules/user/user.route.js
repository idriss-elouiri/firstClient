import express from 'express';
import * as userController from "./user.controller.js";
import { verifyToken } from '../../utils/verifyUser.js';

const router = express.Router();

router.put('/update/:userId', verifyToken, userController.updateUser);
router.delete('/delete/:userId', verifyToken, userController.deleteUser);
router.post('/signout', userController.signout);
router.get('/getusers', verifyToken, userController.getUsers);
router.get('/:userId', userController.getUser);
router.put('/adminUpdateStaff/:staffId', userController.updateStaff);
router.delete('/adminDeleteStaff/:staffId', userController.deleteStaff);
router.put('/adminUpdateCustomer/:CustomerId', userController.updateCustomer);
router.delete('/adminDeleteCustomer/:CustomerId', userController.deleteCustomer);



export default router;