// server/routes/idcard.routes.js
import express from "express";
import { getAllOrders, getOrderById } from "../controllers/idcard.controller.js";

const router = express.Router();

// GET /api/id-cards/orders — all orders across all schools
router.get("/orders", getAllOrders);

// GET /api/id-cards/orders/:id — single order with full details
router.get("/orders/:id", getOrderById);

export default router;