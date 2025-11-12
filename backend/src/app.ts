import express from "express";
import userRoutes from "./routes/v1/userRoutes";
import {errorHandler} from "./middleware/errorHandler";
import dotenv from "dotenv";
import adminRoutes from "./routes/v1/adminRoutes";



const app = express();
dotenv.config();
// DEBUG: Log everything about the request
app.use((req, res, next) => {
	console.log("=== INCOMING REQUEST ===");
	console.log(`Method: ${req.method}`);
	console.log(`Path: ${req.path}`);
	console.log(`Content-Type: ${req.get("Content-Type")}`);
	console.log(`Body:`, req.body);
	console.log(`Raw body type:`, typeof req.body);
	console.log("========================");
	next();
}); /////////////////
const host = "localhost";
const port = 3000;

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.send("OK");
});

// Mount API routes
app.use("/api/users", userRoutes);

// Mount admin routes
app.use("/api/admin", adminRoutes);

// Global error handler (MUST be last)
app.use(errorHandler);

//  Start server
app.listen(port, () => {
  console.log(`Express is listening at http://${host}:${port}`);
});

export default app;
