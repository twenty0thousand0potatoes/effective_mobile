import express, { Request, Response, NextFunction }  from "express";
import dotenv from "dotenv";
import { execSync } from "child_process";
import { ensureDB } from "./db/db.js";
import { history_route } from "./routes/history.routes.js";

dotenv.config({ override: true });

const app = express();
const PORT = 5500;

app.use(express.json());
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Global error handler:', err);
  
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
    });
  });
app.use("/api/history", history_route);

async function startServer() {
  try {
    await ensureDB();
    execSync("npx prisma migrate dev --name init", { stdio: "inherit" });

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (e) {
    if (e instanceof Error) {
      console.error("Error starting server:", e.message);
    } else {
      console.error("Unexpected error:", e);
    }
    process.exit(1);
  }
}

startServer();
