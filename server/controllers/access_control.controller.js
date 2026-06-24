// server/controllers/access_control.controller.js

import {
  fetchAccessControlData,
  toggleUniversity,
  toggleSuperAdmin,
} from "../services/access_control.service.js";

export const getAccessControlData = async (req, res) => {
  try {
    const data = await fetchAccessControlData();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Access Control fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch access control data" });
  }
};

export const toggleUniversityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await toggleUniversity(id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Toggle university error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to toggle university status" });
  }
};

export const toggleSuperAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await toggleSuperAdmin(id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Toggle super admin error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to toggle super admin status" });
  }
};