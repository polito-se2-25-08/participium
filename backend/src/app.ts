import "dotenv/config";
import express from "express";
import officerRoutes from "./routes/v1/officer";
import userRoutes from "./routes/v1/user";

const app = express();
const host = "localhost";
const port = 3000;

app.get("/health", (req, res) => res.send("OK"));
app.use("/api", officerRoutes);
app.use("/api", userRoutes);

// Global error handler (MUST be last)
app.use(errorHandler);

//  Start server
app.listen(port, () => {
	console.log(`Express is listening at http://${host}:${port}`);
});

export default app;
