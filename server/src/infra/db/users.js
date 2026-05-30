import { pool } from '../../../../db/db.config.js';
import bcrypt from 'bcrypt';

// Create a User
export const createUser = async (username, email, password, role_id = 2, otp = null, two_factor_enabled = false) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const query = `
    INSERT INTO users (username, email, password, role_id, otp, two_factor_enabled)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING user_id, username, email, role_id, otp, two_factor_enabled;
  `;
  const values = [username, email, hashedPassword, role_id, otp, two_factor_enabled];
  
  try {
    const res = await pool.query(query, values);
    return res.rows[0]; 
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Read / Get All Users
export const getAllUsers = async () => {
  const query = `
    SELECT users.user_id, users.username, users.email,
           COALESCE(roles.role_name, 'unknown') AS role_name
    FROM users
    LEFT JOIN roles ON users.role_id = roles.role_id
    ORDER BY users.user_id ASC;
  `;
  
  try {
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

// Read / Get A Single User By ID
export const getUserById = async (user_id) => {
  const query = `
    SELECT user_id, username, email, role_id, otp, two_factor_enabled 
    FROM users 
    WHERE user_id = $1;
  `;
  
  try {
    const res = await pool.query(query, [user_id]);
    return res.rows[0];
  } catch (error) {
    console.error('Error getting user by id:', error);
    throw error;
  }
};

// Read / Get A Single User By Email (Useful for Login)
export const getUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  
  try {
    const res = await pool.query(query, [email]);
    return res.rows[0];
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

// Update a User
export const updateUser = async (user_id, updates) => {
  // Use COALESCE to allow partial updates. If a field is not provided, it keeps the old value.
  const query = `
    UPDATE users
    SET 
      username = COALESCE($1, username), 
      email = COALESCE($2, email), 
      password = COALESCE($3, password),
      otp = COALESCE($4, otp),
      two_factor_enabled = COALESCE($5, two_factor_enabled),
      role_id = COALESCE($6, role_id)
    WHERE user_id = $7
    RETURNING user_id, username, email, role_id, otp, two_factor_enabled;
  `;
  
  if (updates.password) {
    const saltRounds = 10;
    updates.password = await bcrypt.hash(updates.password, saltRounds);
  }

  const values = [
    updates.username || null,
    updates.email || null,
    updates.password || null,
    updates.otp || null,
    updates.two_factor_enabled !== undefined ? updates.two_factor_enabled : null,
    updates.role_id || null,
    user_id
  ];
  
  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete a User
export const deleteUser = async (user_id) => {
  const query = `
    DELETE FROM users
    WHERE user_id = $1
    RETURNING user_id, username, email;
  `;
  
  try {
    const res = await pool.query(query, [user_id]);
    return res.rows[0];
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

