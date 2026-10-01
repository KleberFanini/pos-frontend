import { api, checkBackendStatus } from './api';
import type { DashboardReport, ProfessorWorkload } from '../types';
import { mockStorage } from './mockStore';

export const reportService = {
  async getDashboardReport(): Promise<DashboardReport> {
    const isOnline = await checkBackendStatus();
    if (isOnline) {
      try {
        const res = await api.get<any>('/reports/dashboard');
        const raw = res.data;
        return {
          totalProfessors: raw.totalProfessors ?? 0,
          totalDepartments: raw.totalDepartments ?? 0,
          totalCourses: raw.totalCourses ?? 0,
          totalAllocations: raw.totalAllocations ?? 0,
          workloads: raw.workloads || raw.professorWorkloads || [],
        };
      } catch (err) {
        console.warn('Backend indisponível para dashboard, usando mockStorage.');
      }
    }
    return mockStorage.getDashboardReport();
  },

  async getWorkloads(): Promise<ProfessorWorkload[]> {
    const isOnline = await checkBackendStatus();
    if (isOnline) {
      try {
        const res = await api.get<ProfessorWorkload[]>('/reports/workload');
        return res.data;
      } catch (err) {}
    }
    return mockStorage.getDashboardReport().workloads;
  },
};
