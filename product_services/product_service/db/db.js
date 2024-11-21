import pkg from 'pg';
const { Pool, Client } = pkg;
import dotenv from "dotenv";

dotenv.config();

const DBConfig = {
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  host: process.env.HOST || localhost,
  port: process.env.PORTDB || 5432,
};

const nameDB = process.env.NAMEDB || "products";

export const pool = new Pool({
  connectionString: process.env.DATABSE_URL,
});

const ensureDB = async () => {
  const client = new Client({ ...DBConfig, database: "postgres" });

  try {
    await client.connect();

    const availabilityDB = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`, 
        [nameDB]
      );

      if(availabilityDB.rowCount === 0){
        await client.query(`CREATE DATABSE ${nameDB}`)
      }

  } catch (e) {
    return e;
  }
  finally{
    await client.end();
  }
};

export {ensureDB};