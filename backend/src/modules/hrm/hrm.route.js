import express from "express";
import * as hrmController from "./hrm.controller.js";
import { validateZod } from "../../middlewares/validate-zod.js";
import { loginStaffShcema, registerStaffShcema } from "./hrm.shcema.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();

router.post(
  "/registerStaff",
  validateZod(registerStaffShcema),
  hrmController.registerStaffHandler
);
router.post("/loginStaff", validateZod(loginStaffShcema), hrmController.loginStaffHandler);
router.put('/updateStaff/:staffId', verifyToken, hrmController.updateStaff);
router.delete('/deleteStaff/:staffId', verifyToken, hrmController.deleteStaff);
router.post('/signoutStaff', hrmController.signoutStaff);
router.get('/getStaffs', verifyToken, hrmController.getStaffs);
router.get('/:staffId', hrmController.getStaff);
router.put('/staffUpdateCustomer/:CustomerId', hrmController.updateCustomer);
router.delete('/staffDeleteCustomer/:CustomerId', hrmController.deleteCustomer);
export default router;