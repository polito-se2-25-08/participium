import type { Report } from '../types';

const API_BASE = 'http://localhost:3000/api';

export interface ApiResponse<T> {
  status: boolean;
  data: T;
}

export interface CreateReportData {
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  anonymous: boolean;
  user_id?: number;
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Report> = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },

  async getAllReports(): Promise<ApiResponse<Report[]>> {
    try {
      const response = await fetch(`${API_BASE}/reports`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Report[]> = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  async getReportById(id: number): Promise<ApiResponse<Report>> {
    try {
      const response = await fetch(`${API_BASE}/reports/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Report> = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  },
};
