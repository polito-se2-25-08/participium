import express from "express";
import {validate} from "../../middleware/validateMiddleware"
import {setupSchema} from "../../validators/userValidators"
import { setupUser } from "../../controllers/adminController";

const router = express.Router();

//need to add control if account is admin
router.post("/v1/admin/register", validate(setupSchema), setupUser);

export default router;