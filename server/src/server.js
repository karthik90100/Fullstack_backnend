import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./apis/routes/authroutes.js";
import userRoutes from "./apis/routes/userRoutes.js";
import roleRoutes from "./apis/routes/roleRoutes.js";
import productRoutes from "./apis/routes/productRoutes.js";
import orderRoutes from "./apis/routes/orderRoutes.js";
import cartRoutes from "./apis/routes/cartRoutes.js";

dotenv.config();

const app = express();


// Middleware
app.use(express.json());

app.use(cookieParser());

app.use(
    cors({
        origin: true,
        credentials: true
    })
);


// Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", roleRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", cartRoutes);


// Test Route
app.get(
    "/",
    (req, res) => {

        res.send("Server Running");
    }
);


// Server
const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );
    }
);