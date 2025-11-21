import { Router } from "express";
import { getReportsForTechnician } from "../../controllers/TechnicianController";
import { validate } from "../../middleware/validateMiddleware";
import { protect, restrictTo } from "../../middleware/authMiddleware";

const router = Router();
// All routes require authentication and TECHNICIAN role
router.use(protect);
router.use(restrictTo("TECHNICIAN"));

// get reports assigned to a technician
// GET /v1/technician/reports
router.get("/v1/technician/reports", getReportsForTechnician);

export default router;
