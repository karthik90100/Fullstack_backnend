import express from "express";

import { loginUser } from "../controllers/login.js";
import { signupUser } from "../controllers/signup.js";
import { userDetails } from "../controllers/me.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Signup Route — creates a customer account
router.post("/signup", signupUser);

// Login Route
router.post("/login", loginUser);


// Me Route — returns fresh user + permissions from DB
router.get("/me", verifyToken, userDetails);

// Logout — clears the auth cookie
router.post("/logout", (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" });
    res.json({ message: "Logged out" });
});


// Protected Route
router.get(
    "/dashboard",
    verifyToken,
    (req, res) => {

        res.json({
            message: "Protected Route",
            user: req.user
        });
    }
);


export default router;