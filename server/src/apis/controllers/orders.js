import {
    createOrder,
    getOrdersByUser,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
} from "../../infra/db/orders.js";

export const placeOrder = async (req, res) => {
    try {
        const { product_ids } = req.body;
        if (!Array.isArray(product_ids) || product_ids.length === 0) {
            return res.status(400).json({ message: "product_ids must be a non-empty array." });
        }
        const order = await createOrder(req.user.id, product_ids);
        res.status(201).json({ order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await getOrdersByUser(req.user.id);
        res.json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Admin — all orders across all users
export const listAllOrders = async (req, res) => {
    try {
        const orders = await getAllOrders();
        res.json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getOrder = async (req, res) => {
    try {
        const order = await getOrderById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found." });
        res.json({ order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) return res.status(400).json({ message: "status is required." });
        const order = await updateOrderStatus(req.params.id, status);
        if (!order) return res.status(404).json({ message: "Order not found." });
        res.json({ order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const removeOrder = async (req, res) => {
    try {
        const order = await deleteOrder(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found." });
        res.json({ order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
