import { pool } from '../db.config.js';

const initializeSchema = async () => {
  // 1. Roles Table
  const createRolesTable = `
    CREATE TABLE IF NOT EXISTS roles (
      role_id SERIAL PRIMARY KEY,
      role_name VARCHAR(255) UNIQUE NOT NULL,
      permissions JSONB NOT NULL DEFAULT '{}'
    );
  `;

  // 2. Users Table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      otp VARCHAR(10),
      two_factor_enabled BOOLEAN DEFAULT FALSE,
      role_id INTEGER REFERENCES roles(role_id) ON DELETE SET NULL
    );
  `;

  // 3. Insert Admin Role
  const insertAdminRole = `
  INSERT INTO roles (role_name, permissions) 
  VALUES (
    'admin',
    '{"*": 2}'::jsonb
  )
  ON CONFLICT (role_name) DO UPDATE 
  SET permissions = EXCLUDED.permissions;
`;


  const insertCustomerRole = `
  INSERT INTO roles (role_name, permissions) 
  VALUES (
    'customer',
    '{"*": 2}'::jsonb
  )
  ON CONFLICT (role_name) DO UPDATE 
  SET permissions = EXCLUDED.permissions;
`;

  // 4. Products Table
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      product_id SERIAL PRIMARY KEY,
      product_name VARCHAR(255) NOT NULL,
      product_images TEXT[],
      description TEXT
    );
  `;

  // 5. Orders Table
  const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      order_id   SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      status     VARCHAR(50) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  // 6. Order Items Table
  const createOrderItemsTable = `
    CREATE TABLE IF NOT EXISTS order_items (
      item_id    SERIAL PRIMARY KEY,
      order_id   INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(product_id)
    );
  `;

  // 7. Cart Items Table
  const createCartItemsTable = `
    CREATE TABLE IF NOT EXISTS cart_items (
      cart_item_id SERIAL PRIMARY KEY,
      user_id      INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      product_id   INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
      created_at   TIMESTAMP DEFAULT NOW(),
      UNIQUE (user_id, product_id)
    );
  `;

  try {
    // Execute sequentially to respect foreign key constraints
    await pool.query(createRolesTable);
    console.log('Roles table created successfully!');

    await pool.query(createUsersTable);
    console.log('Users table created successfully!');

    await pool.query(insertAdminRole);
    console.log('Admin role inserted successfully!');

    await pool.query(insertCustomerRole);
    console.log('Customer role inserted successfully!');

    await pool.query(createProductsTable);
    console.log('Products table created successfully!');

    await pool.query(createOrdersTable);
    console.log('Orders table created successfully!');

    await pool.query(createOrderItemsTable);
    console.log('Order items table created successfully!');

    await pool.query(createCartItemsTable);
    console.log('Cart items table created successfully!');

  } catch (err) {
    console.error('Error initializing schema:', err);
  } finally {
    pool.end();
  }
};

initializeSchema();
