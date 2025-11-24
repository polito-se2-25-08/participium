import express from "express";
import * as ReportController from "../../controllers/ReportController";
import { protect } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validateMiddleware";
import { createReportSchema } from "../../validators/reportValidators";

const router = express.Router();

// POST /api/v1/reports - Create a new report (protected - requires authentication)
router.post("/v1/reports", protect, validate(createReportSchema), ReportController.createReport);

// GET /api/v1/reports - Get all reports
router.get("/v1/reports", ReportController.getAllReports);

//GET /api/v1/reports/active - Get active reports
router.get("/v1/reports/active", ReportController.getActiveReports);

// GET /api/v1/reports/:id - Get a specific report
router.get("/v1/reports/:id", ReportController.getReportById);

export default router;
