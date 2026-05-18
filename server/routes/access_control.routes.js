import express from "express";

import {
  getAccessControlData,
  toggleUniversityStatus,
  toggleSuperAdminStatus,
} from "../controllers/access_control.controller.js";

const router = express.Router();

// ─────────────────────────────────────────────
// GET ALL ACCESS CONTROL DATA
// ─────────────────────────────────────────────
router.get("/", getAccessControlData);

// ─────────────────────────────────────────────
// TOGGLE UNIVERSITY STATUS
// Active ↔ Deactivated
// ─────────────────────────────────────────────
router.patch(
  "/universities/:id/toggle",
  toggleUniversityStatus
);

// ─────────────────────────────────────────────
// TOGGLE SUPER ADMIN STATUS
// Active ↔ Inactive
// ─────────────────────────────────────────────
router.patch(
  "/super-admins/:id/toggle",
  toggleSuperAdminStatus
);

export default router;