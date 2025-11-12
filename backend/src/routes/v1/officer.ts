import { Router } from "express";
import { getAllReports } from "../../controllers/OfficerController";

const router = Router();

router.get("/v1/reports", getAllReports);

export default router;
