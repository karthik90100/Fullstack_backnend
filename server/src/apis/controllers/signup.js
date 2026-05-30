import bcrypt from "bcrypt";
import { pool } from "../../../../db/db.config.js";

export const signupUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if email already registered
        const existing = await pool.query(
            `SELECT user_id FROM users WHERE email = $1;`,
            [email]
        );
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: "Email already in use." });
        }

        // Look up customer role by name so we never hardcode an ID
        const roleRes = await pool.query(
            `SELECT role_id FROM roles WHERE role_name = 'customer' LIMIT 1;`
        );
        if (roleRes.rows.length === 0) {
            return res.status(500).json({ message: "Customer role not found. Run schema first." });
        }
        const role_id = roleRes.rows[0].role_id;

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (username, email, password, role_id)
             VALUES ($1, $2, $3, $4)
             RETURNING user_id, username, email, role_id;`,
            [username, email, hashedPassword, role_id]
        );

        res.status(201).json({ user: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
