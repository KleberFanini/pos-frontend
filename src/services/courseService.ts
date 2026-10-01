import { api, getBackendOnlineStatus, checkBackendStatus } from './api';
import type { Course, CourseRequestDTO } from '../types';
import { mockStorage } from './mockStore';

export const courseService = {
  async getAll(): Promise<Course[]> {
    const isOnline = await checkBackendStatus();
    if (isOnline) {
      try {
        const res = await api.get<Course[]>('/courses');
        return res.data;
      } catch (err) {
        console.warn('Backend indisponível, usando armazenamento offline.');
      }
    }
    return mockStorage.getCourses();
  },

  async getById(id: number): Promise<Course> {
    if (getBackendOnlineStatus()) {
      try {
        const res = await api.get<Course>(`/courses/${id}`);
        return res.data;
      } catch (err) {}
    }
    const course = mockStorage.getCourseById(id);
    if (!course) throw new Error('Curso não encontrado');
    return course;
  },

  async create(data: CourseRequestDTO): Promise<Course> {
    if (getBackendOnlineStatus()) {
      try {
        const res = await api.post<Course>('/courses', data);
        return res.data;
      } catch (err) {
        if ((err as any).response) throw err;
      }
    }
    return mockStorage.createCourse(data.name);
  },

  async update(id: number, data: CourseRequestDTO): Promise<Course> {
    if (getBackendOnlineStatus()) {
      try {
        const res = await api.put<Course>(`/courses/${id}`, data);
        return res.data;
      } catch (err) {
        if ((err as any).response) throw err;
      }
    }
    return mockStorage.updateCourse(id, data.name);
  },

  async delete(id: number): Promise<void> {
    if (getBackendOnlineStatus()) {
      try {
        await api.delete(`/courses/${id}`);
        return;
      } catch (err) {
        if ((err as any).response) throw err;
      }
    }
    mockStorage.deleteCourse(id);
  },
};
