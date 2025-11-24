import { Router } from "express";
import {
  getAllReports,
  getReportById,
  updateReportStatus,
  approveReport,
  rejectReport,
} from "../../controllers/OfficerController";

const router = Router();

router.get("/v1/reports", getAllReports);
router.get("/v1/report/:id", getReportById);
router.patch("/v1/status/:id", updateReportStatus);
router.patch("/v1/reports/:id/approve", approveReport);
router.patch("/v1/reports/:id/reject", rejectReport);

export default router;
