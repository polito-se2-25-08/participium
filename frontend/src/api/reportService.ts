import type { Report } from '../types';
import type { ApiResponse } from '../interfaces/dto/Response';

const API_BASE = import.meta.env.VITE_API_ENDPOINT

export interface CreateReportData {
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  anonymous: boolean;
  user_id?: number;
  photos: string[];
}

export const reportService = {
  async createReport(reportData: CreateReportData): Promise<ApiResponse<Report>> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(reportData),
      });

      const result: ApiResponse<Report> = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating report:', error);
      const message = error instanceof Error ? error.message : "Cannot reach server";
      return { success: false, data: { message } };
    }
  },

  async getAllReports(): Promise<ApiResponse<Report[]>> {
    try {
      const response = await fetch(`${API_BASE}/reports`);

      const result: ApiResponse<Report[]> = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching reports:', error);
      const message = error instanceof Error ? error.message : "Cannot reach server";
      return { success: false, data: { message } };
    }
  },

  async getReportById(id: number): Promise<ApiResponse<Report>> {
    try {
      const response = await fetch(`${API_BASE}/reports/${id}`);

      const result: ApiResponse<Report> = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching report:', error);
      const message = error instanceof Error ? error.message : "Cannot reach server";
      return { success: false, data: { message } };
    }
  },
};
