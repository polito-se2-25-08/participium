import express from "express";
import { validate } from "../../middleware/validateMiddleware";
import {
  setupSchema,
  assignRoleSchema,
  setupTechnicianSchema,
} from "../../validators/userValidators";
import {
  setupUser,
  setupTechnician,
  setupExternalMaintainer,
  updateTechnicianCategories,
  getTechnicianCategories,
  deleteUser,
} from "../../controllers/adminController";
import {
  getAllUsers,
  getUserById,
  //assignRole,
  updateUser,
} from "../../controllers/userController";
import { protect, restrictTo } from "../../middleware/authMiddleware";

const router = express.Router();

// All routes require authentication and ADMIN role
router.use(protect);
router.use(restrictTo("ADMIN"));

/* // User creation by admin (existing functionality)
router.post("/v1/admin/register", validate(setupSchema), setupUser);

// List all users with their roles
router.get("/v1/admin/users", getAllUsers);

// Get a single user by ID
router.get("/v1/admin/users/:id", getUserById);

// Assign or update a user's role
router.put("/v1/admin/users/:id/role", validate(assignRoleSchema), updateUser);

// Assign or update a technician category
router.put("/v1/admin/technicians/:id/category", setTechnicianCategory); 
*/

// User creation by admin (existing functionality)
router.post("/register", validate(setupSchema), setupUser);

// Technician creation by admin (new functionality)
router.post(
  "/register-technician",
  validate(setupTechnicianSchema),
  setupTechnician
);

// External Maintainer creation by admin
router.post(
  "/register-external-maintainer",
  validate(setupSchema),
  setupExternalMaintainer
);

// List all users with their roles
router.get("/users", getAllUsers);

// Get a single user by ID
router.get("/users/:id", getUserById);

// Assign or update a user's role
router.put("/users/:id/role", validate(assignRoleSchema), updateUser);

// Update technician categories (replaces existing ones)
router.put("/technicians/:id/categories", updateTechnicianCategories);

// Get technician categories
router.get("/technicians/:id/categories", getTechnicianCategories);

// Delete a user by ID
router.delete("/users/:id", deleteUser);

export default router;
