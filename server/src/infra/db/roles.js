import { pool } from '../../../../db/db.config.js';

// Create a Role
export const createRole = async (role_name, permissions = {}) => {
    const query = `
    INSERT INTO roles (role_name, permissions)
    VALUES ($1, $2::jsonb)
    RETURNING *;
  `;
    const values = [role_name, permissions];

    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        console.error('Error creating role:', error);
        throw error;
    }
};

// Read / Get All Roles
export const getAllRoles = async () => {
    const query = `SELECT * FROM roles ORDER BY role_id ASC;`;

    try {
        const res = await pool.query(query);
        return res.rows;
    } catch (error) {
        console.error('Error getting all roles:', error);
        throw error;
    }
};

// Update a Role
export const updateRole = async (role_id, updates) => {
    // Use COALESCE in SQL or handle undefined in JS to allow partial updates
    const query = `
    UPDATE roles
    SET 
      role_name = COALESCE($1, role_name), 
      permissions = COALESCE($2::jsonb, permissions)
    WHERE role_id = $3
    RETURNING *;
  `;

    const values = [
        updates.role_name || null,
        updates.permissions ? updates.permissions : null,
        role_id
    ];

    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        console.error('Error updating role:', error);
        throw error;
    }
};

// Delete a Role
export const deleteRole = async (role_id) => {
    const query = `
    DELETE FROM roles
    WHERE role_id = $1
    RETURNING *;
  `;

    try {
        const res = await pool.query(query, [role_id]);
        return res.rows[0];
    } catch (error) {
        console.error('Error deleting role:', error);
        throw error;
    }
};

