import { Router } from "express";
import * as CategoryController from "../../controllers/CategoryController";

const router = Router();

// GET /api/v1/categories - Get all categories
router.get("/v1/categories", CategoryController.getAllCategories);

export default router;
