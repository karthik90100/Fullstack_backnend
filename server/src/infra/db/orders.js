import { pool } from '../../../../db/db.config.js';

// Place a new order from a list of product IDs — runs in a transaction.
// Optionally clears the user's cart after placing.
export const createOrder = async (user_id, product_ids) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const orderRes = await client.query(
            `INSERT INTO orders (user_id) VALUES ($1) RETURNING *;`,
            [user_id]
        );
        const order = orderRes.rows[0];

        for (const product_id of product_ids) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id) VALUES ($1, $2);`,
                [order.order_id, product_id]
            );
        }

        // Clear the user's persisted cart after order is placed
        await client.query(`DELETE FROM cart_items WHERE user_id = $1;`, [user_id]);

        await client.query('COMMIT');
        return order;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// All orders for the current user with item details
export const getOrdersByUser = async (user_id) => {
    const query = `
        SELECT
            o.order_id,
            o.status,
            o.created_at,
            COALESCE(
                json_agg(
                    json_build_object(
                        'product_id',     p.product_id,
                        'product_name',   p.product_name,
                        'product_images', p.product_images
                    )
                ) FILTER (WHERE p.product_id IS NOT NULL),
                '[]'
            ) AS items
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.order_id
        LEFT JOIN products    p  ON p.product_id = oi.product_id
        WHERE o.user_id = $1
        GROUP BY o.order_id
        ORDER BY o.created_at DESC;
    `;
    const res = await pool.query(query, [user_id]);
    return res.rows;
};

// All orders (admin view) with user info and item details
export const getAllOrders = async () => {
    const query = `
        SELECT
            o.order_id,
            o.status,
            o.created_at,
            u.user_id,
            u.username,
            u.email,
            COALESCE(
                json_agg(
                    json_build_object(
                        'product_id',   p.product_id,
                        'product_name', p.product_name
                    )
                ) FILTER (WHERE p.product_id IS NOT NULL),
                '[]'
            ) AS items
        FROM orders o
        JOIN users        u  ON u.user_id   = o.user_id
        LEFT JOIN order_items oi ON oi.order_id = o.order_id
        LEFT JOIN products    p  ON p.product_id = oi.product_id
        GROUP BY o.order_id, u.user_id
        ORDER BY o.created_at DESC;
    `;
    const res = await pool.query(query);
    return res.rows;
};

export const getOrderById = async (order_id) => {
    const query = `
        SELECT
            o.order_id,
            o.status,
            o.created_at,
            u.user_id,
            u.username,
            COALESCE(
                json_agg(
                    json_build_object(
                        'product_id',     p.product_id,
                        'product_name',   p.product_name,
                        'product_images', p.product_images
                    )
                ) FILTER (WHERE p.product_id IS NOT NULL),
                '[]'
            ) AS items
        FROM orders o
        JOIN users        u  ON u.user_id   = o.user_id
        LEFT JOIN order_items oi ON oi.order_id = o.order_id
        LEFT JOIN products    p  ON p.product_id = oi.product_id
        WHERE o.order_id = $1
        GROUP BY o.order_id, u.user_id;
    `;
    const res = await pool.query(query, [order_id]);
    return res.rows[0] ?? null;
};

export const updateOrderStatus = async (order_id, status) => {
    const query = `
        UPDATE orders SET status = $1
        WHERE order_id = $2
        RETURNING *;
    `;
    const res = await pool.query(query, [status, order_id]);
    return res.rows[0] ?? null;
};

export const deleteOrder = async (order_id) => {
    const query = `DELETE FROM orders WHERE order_id = $1 RETURNING *;`;
    const res = await pool.query(query, [order_id]);
    return res.rows[0] ?? null;
};
