import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./errors/errorHandler";
import routes from "./routes";
import adminRoutes from "./routes/admin";
import cookieParser from "cookie-parser";
import seedDB from "./seedCart";
import cron from "node-cron";
import axios from "axios";
import "./cron/updateAppointmentStatus";
import seedAdmin from "./seedAdmin";
import { createServer } from "http";
import { configureSocket } from "./config/socket";
import { seedStaff } from "./seedStaff";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://pawlish-client.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(
  helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } } })
);


app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong");
});

app.use("/api/v1", routes);
app.use("/api/v1/admin", adminRoutes);

const httpServer = createServer(app);
const io = configureSocket(httpServer);

const BASE_URL = process.env.ONRENDER_URL || `http://localhost:${PORT}`;
console.log(`Self-ping to: ${BASE_URL}/ping`);
cron.schedule("*/10 * * * *", async () => {
  try {
    const response = await axios.get(`${BASE_URL}/ping`);
    console.log("Self-ping successful:", response.data);
  } catch (error) {
    console.log(error);
    console.error("Self-ping failed:", (error as Error).message);
  }
});

// Seed data (nếu cần)
// seedDB();
// seedAdmin();
seedStaff();
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
