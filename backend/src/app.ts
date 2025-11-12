import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';

const app = express();

const host = 'localhost';
const port = 3000;

//////////
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

//app.post('/')

app.listen(port, () => {
  return console.log(`Express is listening at http://${host}:${port}`);
});

// Error handling (must be last)
app.use(errorHandler);

export default app;