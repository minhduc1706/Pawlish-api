import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./errors/errorHandler";
import routes from "./routes";
import { seedCartData } from "./seedCart";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(helmet({ contentSecurityPolicy: false }));

app.use("/api/v1", routes);
// seedCartData();

// app.use("/", (req, res) => {
//   res.status(200).send("API is working");
// });

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
