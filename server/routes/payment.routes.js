import express from "express";
import { getPaymentsDashboard } from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/dashboard", getPaymentsDashboard);

export default router;