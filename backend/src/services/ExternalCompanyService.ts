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
};