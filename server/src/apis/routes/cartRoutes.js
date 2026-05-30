import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getCart, addCartItem, removeCartItem, clearCart } from "../controllers/cart.js";

const router = express.Router();

router.get("/cart",                   verifyToken, getCart);
router.post("/cart",                  verifyToken, addCartItem);
router.delete("/cart/:product_id",    verifyToken, removeCartItem);
router.delete("/cart",                verifyToken, clearCart);

export default router;
