import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
    placeOrder,
    getMyOrders,
    listAllOrders,
    getOrder,
    updateStatus,
    removeOrder,
} from "../controllers/orders.js";

const router = express.Router();

// Customer routes
router.post("/orders",             verifyToken, placeOrder);
router.get("/orders/my",           verifyToken, getMyOrders);

// Admin routes
router.get("/orders",              verifyToken, listAllOrders);
router.get("/orders/:id",          verifyToken, getOrder);
router.put("/orders/:id/status",   verifyToken, updateStatus);
router.delete("/orders/:id",       verifyToken, removeOrder);

export default router;
