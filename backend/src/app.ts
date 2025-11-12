import "dotenv/config";
import express from "express";
import officerRoutes from "./routes/v1/officer";

const app = express();
const host = "localhost";
const port = 3000;

app.get("/health", (req, res) => res.send("OK"));
app.use("/api", officerRoutes);

app.listen(port, () => {
	console.log(`Express is listening at http://${host}:${port}`);
});

export default app;
