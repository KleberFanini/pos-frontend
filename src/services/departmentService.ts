import { api, getBackendOnlineStatus, checkBackendStatus } from './api';
import type { Department, DepartmentRequestDTO } from '../types';
import { mockStorage } from './mockStore';

export const departmentService = {
  async getAll(): Promise<Department[]> {
    const isOnline = await checkBackendStatus();
    if (isOnline) {
      try {
        const res = await api.get<Department[]>('/departments');
        return res.data;
      } catch (err) {
        console.warn('Backend indisponível, usando armazenamento offline.');
      }
    }
    return mockStorage.getDepartments();
  },

  async getById(id: number): Promise<Department> {
    if (getBackendOnlineStatus()) {
      try {
        const res = await api.get<Department>(`/departments/${id}`);
        return res.data;
      } catch (err) {}
    }
    const dep = mockStorage.getDepartmentById(id);
    if (!dep) throw new Error('Departamento não encontrado');
    return dep;
  },

  async create(data: DepartmentRequestDTO): Promise<Department> {
    if (getBackendOnlineStatus()) {
      try {
        const res = await api.post<Department>('/departments', data);
        return res.data;
      } catch (err) {
        if ((err as any).response) throw err;
      }
    }
    return mockStorage.createDepartment(data.name);
  },

  async update(id: number, data: DepartmentRequestDTO): Promise<Department> {
    if (getBackendOnlineStatus()) {
      try {
        const res = await api.put<Department>(`/departments/${id}`, data);
        return res.data;
      } catch (err) {
        if ((err as any).response) throw err;
      }
    }
    return mockStorage.updateDepartment(id, data.name);
  },

  async delete(id: number): Promise<void> {
    if (getBackendOnlineStatus()) {
      try {
        await api.delete(`/departments/${id}`);
        return;
      } catch (err) {
        if ((err as any).response) throw err;
      }
    }
    mockStorage.deleteDepartment(id);
  },
};
