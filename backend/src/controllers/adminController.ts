import { Request, Response } from "express";
import { adminService } from "../services/AdminService";
import { catchAsync } from "../utils/catchAsync";

export const setupUser = catchAsync(async (req: Request, res: Response) => {
  const { email, username, role, name, surname } = req.body;
  const user = await adminService.createUser({
    email,
    username,
    role,
    name,
    surname,
  });

  res.status(201).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      username: user.username,
      password: user.password,
    },
  });
});

export const setupTechnician = catchAsync(
  async (req: Request, res: Response) => {
    const { email, username, name, surname, category_id } = req.body;

    // 1. Create the user with TECHNICIAN role
    const user = await adminService.createUser({
      email,
      username,
      role: "TECHNICIAN",
      name,
      surname,
    });

    // 2. Assign the category to the new technician
    if (category_id) {
      await adminService.assignTechnicianCategory(user.id, Number(category_id));
    }

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        password: user.password,
        category_id,
      },
    });
  }
);

export const setTechnicianCategory = catchAsync(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const categoryId = Number(req.body.category_id);

    const result = await adminService.assignTechnicianCategory(
      userId,
      categoryId
    );
    res.status(200).json({ success: true, data: result });
  }
);
