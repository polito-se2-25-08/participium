import "dotenv/config";
import express from "express";
import officerRoutes from "./routes/v1/officer";
import userRoutes from "./routes/v1/user";
import adminRoutes from "./routes/v1/adminRoutes"
import {errorHandler} from "./middleware/errorHandler";
import cors from "cors";
const app = express();
const host = "localhost";
const port = 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());


app.get("/health", (req, res) => res.send("OK"));
app.use("/api", officerRoutes);
app.use("/api", userRoutes);
app.use("/api", adminRoutes);


//  Start server
app.listen(port, () => {
	console.log(`Express is listening at http://${host}:${port}`);
});

// Global error handler (MUST be last)
app.use(errorHandler);


export default app;
