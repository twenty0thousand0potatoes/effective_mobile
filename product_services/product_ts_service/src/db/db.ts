import pkg from 'pg';
import dotenv from 'dotenv';

const {Pool, Client} = pkg;
dotenv.config();

const DBConfig = {
  user: 'postgres',
  password: 'superuser',
  host: 'localhost',
  port: 5432,
};

const nameDB = "products";

export const pool = new Pool({
  connectionString: 'postgresql://postgres:superuser@localhost:5432/products?schema=history_service',
});

export const ensureDB = async () => {
  const client = new Client({ ...DBConfig, database: "postgres" });

  try {
    await client.connect();

    const availabilityDB = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [nameDB]
    );

    if (availabilityDB.rowCount === 0) {
      console.log(`Database "${nameDB}" does not exist. Creating...`);
      await client.query(`CREATE DATABASE "${nameDB}"`);
      console.log(`Database "${nameDB}" created successfully.`);
    } else {
      console.log(`Database "${nameDB}" already exists.`);
    }
  } catch (e) {
    console.error("Error ensuring database:", e);
    throw e;
  } finally {
    await client.end();
  }
};
