import express from "express";
import "dotenv/config";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";
import connectDB from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(cors())

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  connectDB();
});
