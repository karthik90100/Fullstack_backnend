import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

// export const pool = new Pool({
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database:process.env.PG_DATABASE,
//   password:process.env.PG_PASSWORD,
//   port: Number(process.env.PG_PORT) || 5432,

// });

export const pool = new Pool({
  connectionString:String("postgresql://neondb_owner:npg_AJI2CwjrWnH1@ep-floral-mountain-aokb5jzr.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"),
    ssl: {
        rejectUnauthorized: false
    }
})