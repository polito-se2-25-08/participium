import express from "express";
import * as ReportController from "../../controllers/ReportController";
import * as ReportMessageController from "../../controllers/ReportMessageController";
import * as NotificationController from "../../controllers/NotificationController";
import { protect, restrictTo } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validateMiddleware";
import { createReportSchema } from "../../validators/reportValidators";

const router = express.Router();

// Report routes
router.post(
	"/reports",
	protect,
	validate(createReportSchema),
	ReportController.createReport
);

router.get("/reports", ReportController.getAllReports);

router.get("/reports/active", ReportController.getActiveReports);

router.get("/reports/:id", ReportController.getReportById);

router.patch(
	"/reports/:id/status",
	protect,
	restrictTo("TECHNICIAN", "EXTERNAL_MAINTAINER"),
	ReportController.updateReportStatus
);

// Message routes (on specific report)
router.post(
	"/reports/:id/messages",
	protect,
	ReportMessageController.sendMessage
);

router.get(
	"/reports/:id/messages",
	protect,
	ReportMessageController.getMessages
);

// Notification routes
router.get(
	"/notifications",
	protect,
	NotificationController.getUnreadNotifications
);

router.patch(
	"/notifications/:id/read",
	protect,
	NotificationController.markNotificationAsRead
);

export default router;
