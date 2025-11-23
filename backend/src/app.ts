import "dotenv/config";
import express from "express";
import cors from "cors";
import officerRoutes from "./routes/v1/officer";
import userRoutes from "./routes/v1/user";
import adminRoutes from "./routes/v1/adminRoutes";
import reportRoutes from "./routes/v1/reportRoutes";
import categoryRoutes from "./routes/v1/categoryRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const host = "localhost";
const port = 3000;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => res.send("OK"));

// Routes
app.use("/api/v1", officerRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", adminRoutes);
app.use("/api/v1", reportRoutes);
app.use("/api/v1", categoryRoutes);

// Global error handler (MUST be last middleware)
app.use(errorHandler);

// Start server
app.listen(port, () => {
	console.log(`Express is listening at http://${host}:${port}`);
});

export default app;
