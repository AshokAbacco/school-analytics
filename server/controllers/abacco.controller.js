//server\controllers\abacco.controller.js
import {
  createAbaccoAdmin,
  loginAbaccoService
} from "../services/abacco.service.js";

export const registerAbaccoAdmin = async (req, res) => {
  try {
    const data = await createAbaccoAdmin(req.body);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Registration failed"
    });
  }
};

export const loginAbaccoAdmin = async (req, res) => {
  try {
    const data = await loginAbaccoService(req.body);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Login failed"
    });
  }
};