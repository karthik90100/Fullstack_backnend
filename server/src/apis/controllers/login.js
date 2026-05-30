import bcrypt from "bcrypt";
import { pool } from "../../../../db/db.config.js";
import jwt from "jsonwebtoken";

export const registerUser = async (
    req,
    res
) => {

    try {

        const {
            email,
            password
        } = req.body;

        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Store in DB
        await pool.query(
            `
            INSERT INTO users
            (
                username,
                email,
                password
            )
            VALUES ($1, $2, $3)
            `,
            [
                username,
                email,
                hashedPassword
            ]
        );

        res.json({
            message: "User Registered"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};



export const loginUser = async (
    req,
    res
) => {

    try {

        const { email, password } =
            req.body;
        console.log(req.body)

        // Find user
        const result = await pool.query(
            `
            SELECT *
            FROM users join roles on users.role_id = roles.role_id
            WHERE email = $1
            `,
            [email]
        );

        if (result.rows.length === 0) {

            return res.status(401).json({
                message: "User Not Found"
            });
        }

        const user = result.rows[0];

        // Compare password
        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        // Access token
        const accessToken = jwt.sign(
            {
                id: user.user_id,
                role: user.role,
                email: user.email,
                permissions: user.permissions,
            },
            "mysecretkey123",
            {
                expiresIn: "1d"
            }
        );

        // Cookie
        res.cookie(
            "token",
            accessToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
            }
        );

        res.json({
            accessToken,
            role: user.role
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};