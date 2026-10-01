import { api, getBackendOnlineStatus, checkBackendStatus } from './api';
import type { Allocation, AllocationRequestDTO } from '../types';
import { mockStorage } from './mockStore';

const normalizeAllocation = (a: any): Allocation => ({
  ...a,
  professorId: a.professorId ?? a.professor?.id ?? 0,
  courseId: a.courseId ?? a.course?.id ?? 0,
});

export const allocationService = {
  async getAll(): Promise<Allocation[]> {
    const isOnline = await checkBackendStatus();
    if (isOnline) {
      try {
        const res = await api.get<Allocation[]>('/allocations');
        return res.data.map(normalizeAllocation);
      } catch (err) {
        console.warn('Backend indisponível, usando armazenamento offline.');
      }
    }
    return mockStorage.getAllocations();
  },

  async getById(id: number): Promise<Allocation> {
    if (getBackendOnlineStatus()) {
      try {
        const res = await api.get<Allocation>(`/allocations/${id}`);
        return normalizeAllocation(res.data);
      } catch (err) {}
    }
    const a = mockStorage.getAllocationById(id);
    if (!a) throw new Error('Alocação não encontrada');
    return a;
  },

  async create(data: AllocationRequestDTO): Promise<Allocation> {
    if (getBackendOnlineStatus()) {
      try {
        const res = await api.post<Allocation>('/allocations', data);
        return res.data;
      } catch (err) {
        if ((err as any).response) throw err;
      }
    }
    return mockStorage.createAllocation(
      data.dayOfWeek,
      data.startHour,
      data.endHour,
      data.professorId,
      data.courseId
    );
  },

  async update(id: number, data: AllocationRequestDTO): Promise<Allocation> {
    if (getBackendOnlineStatus()) {
      try {
        const res = await api.put<Allocation>(`/allocations/${id}`, data);
        return res.data;
      } catch (err) {
        if ((err as any).response) throw err;
      }
    }
    return mockStorage.updateAllocation(
      id,
      data.dayOfWeek,
      data.startHour,
      data.endHour,
      data.professorId,
      data.courseId
    );
  },

  async delete(id: number): Promise<void> {
    if (getBackendOnlineStatus()) {
      try {
        await api.delete(`/allocations/${id}`);
        return;
      } catch (err) {
        if ((err as any).response) throw err;
      }
    }
    mockStorage.deleteAllocation(id);
  },
};
