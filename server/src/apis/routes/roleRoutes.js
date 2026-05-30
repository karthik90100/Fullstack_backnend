import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getAllRoles, createRole, updateRole, deleteRole } from "../../infra/db/roles.js";

const router = express.Router();

router.get("/roles", verifyToken, async (req, res) => {
    try {
        const roles = await getAllRoles();
        res.json({ roles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.post("/roles", verifyToken, async (req, res) => {
    try {
        const { role_name, permissions } = req.body;
        const role = await createRole(role_name, permissions);
        res.status(201).json({ role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.put("/roles/:id", verifyToken, async (req, res) => {
    try {
        const { permissions } = req.body;
        const role = await updateRole(req.params.id, { permissions });
        res.json({ role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.delete("/roles/:id", verifyToken, async (req, res) => {
    try {
        const role = await deleteRole(req.params.id);
        res.json({ role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
