import { Router } from "express";
import * as CategoryController from "../controllers/CategoryController";

const router = Router();

// GET /api/categories - Get all categories
router.get("/", CategoryController.getAllCategories);

export default router;
