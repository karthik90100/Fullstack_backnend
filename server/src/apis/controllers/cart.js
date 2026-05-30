import {
    getCartByUser,
    addToCart,
    removeFromCart,
    clearCartByUser,
} from "../../infra/db/cart.js";

export const getCart = async (req, res) => {
    try {
        const items = await getCartByUser(req.user.id);
        res.json({ items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const addCartItem = async (req, res) => {
    try {
        const { product_id } = req.body;
        if (!product_id) return res.status(400).json({ message: "product_id is required." });
        const item = await addToCart(req.user.id, product_id);
        res.status(201).json({ item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const item = await removeFromCart(req.user.id, req.params.product_id);
        res.json({ item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const clearCart = async (req, res) => {
    try {
        const items = await clearCartByUser(req.user.id);
        res.json({ items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
