import express from "express";

import {
  dashboardAnalytics,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get(
  "/analytics",
  dashboardAnalytics
);

export default router;