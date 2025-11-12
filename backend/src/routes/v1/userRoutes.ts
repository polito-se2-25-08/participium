
/*import express from "express";
import { registerUser, loginUser, getAllUsers  } from "../../controllers/userController";
import { protect } from "../../middleware/authMiddleware";
import {validate} from "../../middleware/validateMiddleware"
import {registerSchema, loginSchema} from "../../validators/userValidators"

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/",  getAllUsers); //change to admin routes later with protection middleware

// Example protected route
router.get("/profile", protect, (req, res) => {
  res.json({ message: "Authorized!", user: (req as any).user });
});

export default router;
*/