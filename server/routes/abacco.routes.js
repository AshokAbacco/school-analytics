import express from "express";
import {
  registerAbaccoAdmin,
  loginAbaccoAdmin
} from "../controllers/abacco.controller.js";

const router = express.Router();

// Register
router.post("/register", registerAbaccoAdmin);

// Login
router.post("/login", loginAbaccoAdmin);

export default router;