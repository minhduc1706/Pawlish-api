import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./errors/errorHandler";
import routes from "./routes";
import { seedCartData } from "./seedCart";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } } }));

app.use("/api/v1", routes);
// seedCartData();

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
