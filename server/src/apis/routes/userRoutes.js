import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getAllUsers, createUser, deleteUser } from "../../infra/db/users.js";

const router = express.Router();

// GET all users
router.get("/users", verifyToken, async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// POST create user
router.post("/users", verifyToken, async (req, res) => {
    try {
        const { username, email, password, role_id } = req.body;
        const user = await createUser(username, email, password, role_id);
        res.status(201).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// DELETE user
router.delete("/users/:id", verifyToken, async (req, res) => {
    try {
        const user = await deleteUser(req.params.id);
        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
