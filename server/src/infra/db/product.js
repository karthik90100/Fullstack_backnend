import { pool } from '../../../../db/db.config.js';

// Create a Product
export const createProduct = async (product_name, product_images, description) => {
  const query = `
    INSERT INTO products (product_name, product_images, description)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [product_name, product_images, description];
  
  try {
    const res = await pool.query(query, values);
    return res.rows[0]; 
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Read / Get All Products
export const getAllProducts = async () => {
  const query = `SELECT * FROM products ORDER BY product_id ASC;`;
  
  try {
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    console.error('Error getting all products:', error);
    throw error;
  }
};

// Read / Get A Single Product By ID
export const getProductById = async (product_id) => {
  const query = `SELECT * FROM products WHERE product_id = $1;`;
  
  try {
    const res = await pool.query(query, [product_id]);
    return res.rows[0];
  } catch (error) {
    console.error('Error getting product by id:', error);
    throw error;
  }
};

// Update a Product
export const updateProduct = async (product_id, updates) => {
  // Using COALESCE allows us to update only the fields that are passed
  const query = `
    UPDATE products
    SET 
      product_name = COALESCE($1, product_name), 
      product_images = COALESCE($2, product_images), 
      description = COALESCE($3, description)
    WHERE product_id = $4
    RETURNING *;
  `;
  
  const values = [
    updates.product_name || null, 
    updates.product_images || null, 
    updates.description || null, 
    product_id
  ];
  
  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a Product
export const deleteProduct = async (product_id) => {
  const query = `
    DELETE FROM products
    WHERE product_id = $1
    RETURNING *;
  `;
  
  try {
    const res = await pool.query(query, [product_id]);
    return res.rows[0];
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
