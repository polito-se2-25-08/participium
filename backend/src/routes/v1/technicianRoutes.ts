import { Router } from "express";
import { getReportsForTechnician } from "../../controllers/TechnicianController";
import { protect, restrictTo } from "../../middleware/authMiddleware";

const router = Router();
// All routes require authentication and TECHNICIAN or EXTERNAL MAINTAINER role
router.use(protect);
router.use(restrictTo("TECHNICIAN", "EXTERNAL MAINTAINER"));

// get reports assigned to a technician
// GET /v1/technician/reports?status=ASSIGNED
//router.get("/v1/technician/reports", getReportsForTechnician);

router.get("/reports", getReportsForTechnician);

export default router;
