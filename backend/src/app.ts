import express from "express";
import userRoutes from "./routes/v1/userRoutes";
import {errorHandler} from "./middleware/errorHandler";
import dotenv from "dotenv";


const app = express();
dotenv.config();

const host = "localhost";
const port = 3000;

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.send("OK");
});

// Mount API routes
app.use("/api/users", userRoutes);

// Global error handler (MUST be last)
app.use(errorHandler);

//  Start server
app.listen(port, () => {
  console.log(`Express is listening at http://${host}:${port}`);
});

export default app;
