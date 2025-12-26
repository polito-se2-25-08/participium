import { externalCompanyRepository } from "../repositories/ExternalCompanyRepository";

export const externalCompanyService = {
  async getAllCompanies() {
    return await externalCompanyRepository.getAllCompanies();
  },

  async getCompanyById(id: number) {
    return await externalCompanyRepository.getCompanyById(id);
  },

  async getCompaniesByCategory(categoryId: number) {
    return await externalCompanyRepository.getCompaniesByCategory(categoryId);
  },

  async assignExternalMaintainerCompany(
    user_id: number,
    company_id: number
  ): Promise<void> {
    return await externalCompanyRepository.assignExternalMaintainerCompany(
      user_id,
      company_id
    );
  },
};
