import express from "express";
import cors from "cors";
import userRoutes from "./routes/v1/userRoutes";
import {errorHandler} from "./middleware/errorHandler";
import dotenv from "dotenv";
import adminRoutes from "./routes/v1/adminRoutes";



const app = express();
dotenv.config();

const host = "localhost";
const port = 3000;

// CORS middleware - must be before routes
app.use(cors());

app.use(express.json());


// Health check
app.get("/health", (req, res) => {
  res.send({ status: 'O' });
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
