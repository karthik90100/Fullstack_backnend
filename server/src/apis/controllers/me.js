import { pool } from "../../../../db/db.config.js";

export async function userDetails(req, res) {
    try {
        const { id } = req.user;

        const result = await pool.query(
            `SELECT users.user_id, users.username, users.email,
                    roles.role_name, roles.permissions
             FROM users
             JOIN roles ON users.role_id = roles.role_id
             WHERE users.user_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ data: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}
