import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../../infra/db/product.js";

const router = express.Router();

router.get("/products", verifyToken, async (req, res) => {
    try {
        const products = await getAllProducts();
        res.json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.post("/products", verifyToken, async (req, res) => {
    try {
        const { product_name, description, product_images } = req.body;
        const product = await createProduct(product_name, product_images ?? null, description);
        res.status(201).json({ product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.put("/products/:id", verifyToken, async (req, res) => {
    try {
        const { product_name, description, product_images } = req.body;
        const product = await updateProduct(req.params.id, { product_name, description, product_images });
        res.json({ product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.delete("/products/:id", verifyToken, async (req, res) => {
    try {
        const product = await deleteProduct(req.params.id);
        res.json({ product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
