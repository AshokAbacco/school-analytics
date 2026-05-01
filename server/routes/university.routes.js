//server\routes\university.routes.js
import express from "express";
import { getUniversityDashboard } from "../controllers/university.controller.js";

const router = express.Router();

router.get("/dashboard", getUniversityDashboard);

export default router;