import { api, getBackendOnlineStatus, checkBackendStatus } from './api';
import type { Professor, ProfessorRequestDTO } from '../types';
import { mockStorage } from './mockStore';

const normalizeProfessor = (p: any): Professor => ({
  ...p,
  departmentId: p.departmentId ?? p.department?.id ?? 0,
});

export const professorService = {
  async getAll(): Promise<Professor[]> {
    const isOnline = await checkBackendStatus();
    if (isOnline) {
      try {
        const res = await api.get<Professor[]>('/professors');
        return res.data.map(normalizeProfessor);
      } catch (err) {
        console.warn('Backend indisponível, usando armazenamento offline.');
      }
    }
    return mockStorage.getProfessors();
  },

  async getById(id: number): Promise<Professor> {
    if (getBackendOnlineStatus()) {
      try {
        const res = await api.get<Professor>(`/professors/${id}`);
        return normalizeProfessor(res.data);
      } catch (err) {}
    }
    const p = mockStorage.getProfessorById(id);
    if (!p) throw new Error('Professor não encontrado');
    return p;
  },

  async create(data: ProfessorRequestDTO): Promise<Professor> {
    if (getBackendOnlineStatus()) {
      try {
        const res = await api.post<Professor>('/professors', data);
        return res.data;
      } catch (err) {
        if ((err as any).response) throw err;
      }
    }
    return mockStorage.createProfessor(data.name, data.cpf, data.departmentId);
  },

  async update(id: number, data: ProfessorRequestDTO): Promise<Professor> {
    if (getBackendOnlineStatus()) {
      try {
        const res = await api.put<Professor>(`/professors/${id}`, data);
        return res.data;
      } catch (err) {
        if ((err as any).response) throw err;
      }
    }
    return mockStorage.updateProfessor(id, data.name, data.cpf, data.departmentId);
  },

  async delete(id: number): Promise<void> {
    if (getBackendOnlineStatus()) {
      try {
        await api.delete(`/professors/${id}`);
        return;
      } catch (err) {
        if ((err as any).response) throw err;
      }
    }
    mockStorage.deleteProfessor(id);
  },

  async exportScheduleCSV(id: number, profName: string): Promise<void> {
    let csvData = '';
    if (getBackendOnlineStatus()) {
      try {
        const res = await api.get(`/professors/${id}/schedule/export/csv`, {
          responseType: 'text',
        });
        csvData = res.data;
      } catch (err) {
        csvData = mockStorage.exportScheduleCSV(id);
      }
    } else {
      csvData = mockStorage.exportScheduleCSV(id);
    }

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `agenda_prof_${profName.replace(/\s+/g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  async exportScheduleICS(id: number, profName: string): Promise<void> {
    let icsData = '';
    if (getBackendOnlineStatus()) {
      try {
        const res = await api.get(`/professors/${id}/schedule/export/ics`, {
          responseType: 'text',
        });
        icsData = res.data;
      } catch (err) {
        icsData = mockStorage.exportScheduleICS(id);
      }
    } else {
      icsData = mockStorage.exportScheduleICS(id);
    }

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `agenda_prof_${profName.replace(/\s+/g, '_').toLowerCase()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
