import { Router } from "express";
import {
  getAllReports,
  getReportById,
  updateReportStatus,
  approveReport,
  rejectReport,
} from "../../controllers/OfficerController";
import { protect, restrictTo } from "../../middleware/authMiddleware";

const router = Router();

// All officer routes require authentication and OFFICER role
router.use(protect);
router.use(restrictTo("OFFICER"));

router.get("/reports", getAllReports);
router.get("/report/:id", getReportById);
router.patch("/status/:id", updateReportStatus);
router.patch("/reports/:id/approve", approveReport);
router.patch("/reports/:id/reject", rejectReport);

export default router;
