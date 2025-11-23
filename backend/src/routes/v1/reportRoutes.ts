import express from "express";
import * as ReportController from "../../controllers/ReportController";
import { protect } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validateMiddleware";
import { createReportSchema } from "../../validators/reportValidators";

const router = express.Router();

// POST /api/reports - Create a new report (protected - requires authentication)
router.post("/reports", protect, validate(createReportSchema), ReportController.createReport);

// GET /api/reports - Get all reports
router.get("/reports", ReportController.getAllReports);

// GET /api/reports/:id - Get a specific report
router.get("/reports/:id", ReportController.getReportById);

export default router;
