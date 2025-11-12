import express from "express";

import { registerSchema, loginSchema } from "../../validators/userValidators";
import { validate } from "../../middleware/validateMiddleware";
import { protect } from "../../middleware/authMiddleware";
import {
	getAllUsers,
	loginUser,
	registerUser,
} from "../../controllers/userController";

const router = express.Router();

router.post("/v1/register", validate(registerSchema), registerUser);
router.post("/v1/login", validate(loginSchema), loginUser);
router.get("/v1/users", getAllUsers);

router.get("/profile", protect, (req, res) => {
	res.json({ message: "Authorized!", user: (req as any).user });
});

export default router;
