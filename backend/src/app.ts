import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import officerRoutes from "./routes/v1/officer";
import technicianRoutes from "./routes/v1/technicianRoutes";
import userRoutes from "./routes/v1/user";
import adminRoutes from "./routes/v1/adminRoutes";
import reportRoutes from "./routes/v1/reportRoutes";
import categoryRoutes from "./routes/v1/categoryRoutes";
import externalCompanyRoutes from "./routes/v1/externalCompanyRoutes";
import { errorHandler } from "./middleware/errorHandler";
import bot from "./bot";
import { MessageService } from "./services/MessageService";
import { getReportById } from "./repositories/ReportRepository";
import { mapMessageDBToMessage } from "./controllers/mapper/MessageDBToMessage";
import { userRepository } from "./repositories/userRepository";
import is from "zod/v4/locales/is.js";

const app = express();
const host = "localhost";
const port = 3000;

// Create HTTP server
const httpServer = createServer(app);

// Launch bot
//bot.launch().then(() => console.log("Telegram bot started"));

// Initialize Socket.IO
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:5173",
		credentials: true,
	},
});

// Store connected users: { userId: socketId }
const connectedUsers = new Map<number, string>();

io.on("connection", (socket) => {
	console.log("Client connected:", socket.id);

	socket.on("register", (userId: number) => {
		connectedUsers.set(userId, socket.id);
		console.log(`User ${userId} registered with socket ${socket.id}`);
	});

	socket.on(
		"send_report_message",
		async (userId: number, message: string, reportId) => {
			const user = await userRepository.findById(userId);

			if (!user) {
				throw new Error("User not found");
			}

			if (connectedUsers.has(userId)) {
				const savedMessage = await MessageService.saveMessage(
					message,
					reportId,
					userId
				);

				const isTechnician = user.role === "TECHNICIAN";

				//if the message is sent by a technician notify the user
				if (isTechnician) {
					const report = await getReportById(reportId);
					const reportUserId = report.user_id;
					const socketId = connectedUsers.get(reportUserId);
					if (socketId) {
						const mappedMessage =
							mapMessageDBToMessage(savedMessage);
						io.to(socketId).emit("report_message", mappedMessage);
						console.log(
							`Message sent to user ${userId} for report ${reportId}`
						);
					}
				}
			}
		}
	);

	socket.on("disconnect", () => {
		for (const [userId, socketId] of connectedUsers.entries()) {
			if (socketId === socket.id) {
				connectedUsers.delete(userId);
				console.log(`User ${userId} disconnected`);
				break;
			}
		}
	});
});

// Make io and connectedUsers accessible to routes
export { io, connectedUsers };

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
