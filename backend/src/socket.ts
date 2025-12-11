import { Server } from "socket.io";
import { Server as HttpServer } from "node:http";
import { MessageDTO } from "./dto/MessageDTO";
import { userRepository } from "./repositories/userRepository";
import { MessageService } from "./services/MessageService";
import { getReportById } from "./repositories/ReportRepository";
import { mapMessageDBToMessage } from "./controllers/mapper/MessageDBToMessage";
import { createNotification } from "./services/NotificationService";

export const connectedUsers = new Map<number, string>();
let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("register", (userId: number) => {
      connectedUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("send_report_message", async (messageDTO: MessageDTO) => {
      try {
        const userId = messageDTO.senderId;
        const reportId = messageDTO.reportId;
        const message = messageDTO.message;

        const user = await userRepository.findById(userId);

        console.log("User ID:", userId);
        console.log("Message:", message);
        console.log("Report ID:", reportId);

        if (!user) {
          throw new Error("User not found");
        }

        const savedMessage = await MessageService.saveMessage(
          message,
          reportId,
          userId
        );

        const isTechnician = user.role === "TECHNICIAN";

        if (isTechnician) {
          const report = await getReportById(reportId);
          const reportUserId = report.user_id;
          const socketId = connectedUsers.get(reportUserId);

          const mappedMessage = mapMessageDBToMessage(savedMessage);

          if (socketId) {
            io.to(socketId).emit("new_report_message", mappedMessage);
          } else {
            await createNotification({
              user_id: reportUserId,
              report_id: reportId,
              type: "NEW_MESSAGE",
              message: `New message on report #${report.title}`,
            });
          }
        }
      } catch (err) {
        console.error("Socket error:", err);
        socket.emit("error", {
          type: "SEND_MESSAGE_ERROR",
          message: "Failed to send message",
        });
      }
    });

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

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
