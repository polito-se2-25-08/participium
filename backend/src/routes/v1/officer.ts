import { Router } from "express";
import {
  getAllReports,
  getReportById,
  updateReportStatus,
} from "../../controllers/OfficerController";

const router = Router();

router.get("/v1/reports", getAllReports);
router.get("/v1/report/:id", getReportById);
router.patch("/v1/status:id", updateReportStatus);

export default router;
