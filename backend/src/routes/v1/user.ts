import { Router } from "express";

import { registerSchema, loginSchema } from "../../validators/userValidators";
import { validate } from "../../middleware/validateMiddleware";
import { protect } from "../../middleware/authMiddleware";
import {
	createVerificationCode,
	getAllUsers,
	loginUser,
	registerUser,
	updateUser,
	verifyUser,
} from "../../controllers/userController";
import { getReportsByUserId } from "../../controllers/ReportController";
import { create } from "axios";

const router = Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/users", getAllUsers);
router.patch("/users/:id", updateUser);
router.post("/users/:id/verify", createVerificationCode);
router.post("/users/:id/verify/check", verifyUser);

router.get("/users/:id/reports", getReportsByUserId);

router.get("/profile", protect, (req, res) => {
	res.json({ message: "Authorized!", user: (req as any).user });
});

export default router;
