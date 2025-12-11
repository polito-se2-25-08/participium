import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { initSocket } from "./socket";
import officerRoutes from "./routes/v1/officer";
import technicianRoutes from "./routes/v1/technicianRoutes";
import userRoutes from "./routes/v1/user";
import adminRoutes from "./routes/v1/adminRoutes";
import reportRoutes from "./routes/v1/reportRoutes";
import categoryRoutes from "./routes/v1/categoryRoutes";
import { errorHandler } from "./middleware/errorHandler";
import bot from "./bot";
import externalCompanyRoutes from "./routes/v1/externalCompanyRoutes";

const app = express();
const host = "localhost";
const port = 3000;

// Create HTTP server
const httpServer = createServer(app);

// Launch bot
//bot.launch().then(() => console.log("Telegram bot started"));

// Initialize Socket.IO
initSocket(httpServer);

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => res.send("OK"));

// Routes
app.use("/api/v1/external-company", externalCompanyRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", reportRoutes);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1/technician", technicianRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1", officerRoutes);


// Global error handler (MUST be last middleware)
app.use(errorHandler);

// Start server with Socket.IO
httpServer.listen(port, () => {
	console.log(`Express is listening at http://${host}:${port}`);
	console.log(`Socket.IO is ready for connections`);
});

export default app;
