import express from "express";
import dotenv from "dotenv";
import {product_router} from "./routes/product.routes.js";
import { stocks_router } from "./routes/stocks.routes.js";
import { ensureDB } from "./db/db.js";
import {execSync} from 'child_process';
import { checkHistoryServiceAvailability } from "./logger.action.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/products", product_router);
app.use("/api/stocks",stocks_router);

const PORT = process.env.PORT;

async function startServer() {
  try {
    await ensureDB();
    execSync("npx prisma migrate dev --name init", { stdio: "inherit" });
    await checkHistoryServiceAvailability();
    app.listen(PORT || 3000, (err) => {
      if (err) {
        console.log(`Server error: ${err}`);
      } else { 
        console.log(`Server start!`);
      } 
    });
  } catch (e) {
    console.error(e.message || e);
  }
}

startServer();
