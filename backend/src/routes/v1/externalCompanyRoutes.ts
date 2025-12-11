import { Router } from "express";
import {
getAllExternalCompanies,
getExternalCompanyById,
getExternalCompaniesByCategory,
} from "../../controllers/externalCompanyController";


const router = Router();


// All routes require authentication
//router.use(protect);


// Only ADMIN, TECHNICIAN, EXTERNAL_MAINTAINER can fetch companies
//router.use(restrictTo( "TECHNICIAN", "EXTERNAL MAINTAINER", "ADMIN", "OFFICER", "CITIZEN"));
// GET /v1/external-company
router.get("/", getAllExternalCompanies);

// GET /v1/external-company/:id
router.get("/:id", getExternalCompanyById);


// GET /v1/external-company/category/:categoryId
router.get("/category/:categoryId", getExternalCompaniesByCategory);


export default router;