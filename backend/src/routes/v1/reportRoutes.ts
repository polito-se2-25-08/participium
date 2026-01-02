import express from "express";
import * as ReportController from "../../controllers/ReportController";
import * as ReportMessageController from "../../controllers/ReportMessageController";
import * as ReportCommentController from "../../controllers/ReportCommentController";
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

router.get("/reports", protect, ReportController.getAllReports);

router.get("/reports/pending", protect, ReportController.getPendingReports);

// Active reports are public - accessible by unregistered users
router.get("/reports/active", ReportController.getActiveReports);

router.get("/reports/:id", protect, ReportController.getReportById);

router.patch(
	"/reports/:id/status",
	protect,
	restrictTo("TECHNICIAN", "EXTERNAL_MAINTAINER"),
	ReportController.updateReportStatus
);

router.get(
	"/reports/:id/messages",
	protect,
	ReportMessageController.getMessages
);

// Comment routes (internal comments for reports)
router.post(
	"/reports/:id/comments",
	protect,
	ReportCommentController.addComment
);

router.get(
	"/reports/:id/comments",
	protect,
	ReportCommentController.getComments
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

router.post(
	"/reports/:id/public-messages",
	protect,
	ReportMessageController.sendPublicMessage
);

router.post(
	"/reports/:id/internal-messages",
	protect,
	ReportMessageController.sendInternalMessage
);

export default router;
