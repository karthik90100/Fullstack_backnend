import { pool } from '../../../../db/db.config.js';

export const getCartByUser = async (user_id) => {
    const query = `
        SELECT
            ci.cart_item_id,
            ci.created_at,
            p.product_id,
            p.product_name,
            p.product_images,
            p.description
        FROM cart_items ci
        JOIN products p ON p.product_id = ci.product_id
        WHERE ci.user_id = $1
        ORDER BY ci.created_at ASC;
    `;
    const res = await pool.query(query, [user_id]);
    return res.rows;
};

// ON CONFLICT DO NOTHING so duplicate adds are idempotent
export const addToCart = async (user_id, product_id) => {
    const query = `
        INSERT INTO cart_items (user_id, product_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, product_id) DO NOTHING
        RETURNING *;
    `;
    const res = await pool.query(query, [user_id, product_id]);
    return res.rows[0] ?? null;
};

export const removeFromCart = async (user_id, product_id) => {
    const query = `
        DELETE FROM cart_items
        WHERE user_id = $1 AND product_id = $2
        RETURNING *;
    `;
    const res = await pool.query(query, [user_id, product_id]);
    return res.rows[0] ?? null;
};

export const clearCartByUser = async (user_id) => {
    const query = `DELETE FROM cart_items WHERE user_id = $1 RETURNING *;`;
    const res = await pool.query(query, [user_id]);
    return res.rows;
};
