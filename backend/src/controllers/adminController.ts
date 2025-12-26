import { Request, Response } from "express";
import { adminService } from "../services/AdminService";
import { getCategoriesForTechnician } from "../services/TechnicianService";
import { externalCompanyService } from "../services/ExternalCompanyService";
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
    const { email, username, role, name, surname, category_ids } = req.body;

    // 1. Create the user with TECHNICIAN role
    const user = await adminService.createUser({
      email,
      username,
      role: "TECHNICIAN",
      name,
      surname,
    });

    // 2. Assign the categories to the new technician
    if (
      category_ids &&
      Array.isArray(category_ids) &&
      category_ids.length > 0
    ) {
      const numericIds = category_ids.map((id: string | number) => Number(id));
      await adminService.assignTechnicianCategories(user.id, numericIds);
    }

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        password: user.password,
        category_ids,
      },
    });
  }
);

export const setupExternalMaintainer = catchAsync(
  async (req: Request, res: Response) => {
    const { email, username, role, name, surname, external_company_id } =
      req.body;

    // 1. Create the user with EXTERNAL_MAINTAINER role
    const user = await adminService.createUser({
      email,
      username,
      role: "EXTERNAL_MAINTAINER",
      name,
      surname,
    });

    // 2. Assign the user to the external company
    if (external_company_id) {
      await externalCompanyService.assignExternalMaintainerCompany(
        user.id,
        Number(external_company_id)
      );
    }

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        password: user.password,
        external_company_id,
      },
    });
  }
);

export const updateTechnicianCategories = catchAsync(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const { category_ids } = req.body;

    const numericIds = (category_ids || []).map((id: string | number) =>
      Number(id)
    );

    const result = await adminService.updateTechnicianCategories(
      userId,
      numericIds
    );
    res.status(200).json({ success: true, data: result });
  }
);

export const getTechnicianCategories = catchAsync(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    const categoryIds = await getCategoriesForTechnician(userId);
    res.status(200).json({ success: true, data: categoryIds });
  }
);

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  await adminService.deleteUser(userId);
  res.status(204).json({ success: true, data: null });
});
