export type DayOfWeek = 
  | 'MONDAY' 
  | 'TUESDAY' 
  | 'WEDNESDAY' 
  | 'THURSDAY' 
  | 'FRIDAY' 
  | 'SATURDAY' 
  | 'SUNDAY';

export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  MONDAY: 'Segunda-feira',
  TUESDAY: 'Terça-feira',
  WEDNESDAY: 'Quarta-feira',
  THURSDAY: 'Quinta-feira',
  FRIDAY: 'Sexta-feira',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
};

export interface Department {
  id: number;
  name: string;
}

export interface DepartmentRequestDTO {
  name: string;
}

export interface Course {
  id: number;
  name: string;
}

export interface CourseRequestDTO {
  name: string;
}

export interface Professor {
  id: number;
  name: string;
  cpf: string;
  departmentId: number;
  department?: Department;
}

export interface ProfessorRequestDTO {
  name: string;
  cpf: string;
  departmentId: number;
}

export interface Allocation {
  id: number;
  dayOfWeek: DayOfWeek;
  startHour: string; // "HH:mm:ss" or "HH:mm"
  endHour: string;   // "HH:mm:ss" or "HH:mm"
  professorId: number;
  courseId: number;
  professor?: Professor;
  course?: Course;
}

export interface AllocationRequestDTO {
  dayOfWeek: DayOfWeek;
  startHour: string;
  endHour: string;
  professorId: number;
  courseId: number;
}

export interface ProfessorWorkload {
  professorId: number;
  professorName: string;
  departmentName: string;
  totalHours: number;
  formattedWorkload: string;
}

export interface DashboardReport {
  totalProfessors: number;
  totalDepartments: number;
  totalCourses: number;
  totalAllocations: number;
  workloads: ProfessorWorkload[];
}

export interface ApiError {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  details?: Record<string, string>;
}
