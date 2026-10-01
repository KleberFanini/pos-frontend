import type { Allocation, Course, Department, Professor, DashboardReport, DayOfWeek } from '../types';

// Mock initial data
const initialDepartments: Department[] = [
  { id: 1, name: 'Engenharia de Software' },
  { id: 2, name: 'Ciência da Computação' },
  { id: 3, name: 'Sistemas de Informação' },
  { id: 4, name: 'Design & Mídia Digital' },
];

const initialCourses: Course[] = [
  { id: 1, name: 'Desenvolvimento Web Frontend' },
  { id: 2, name: 'Arquitetura de Software REST API' },
  { id: 3, name: 'Banco de Dados Relacional' },
  { id: 4, name: 'UX/UI Design & Prototipagem' },
  { id: 5, name: 'Estruturas de Dados Avançadas' },
];

const initialProfessors: Professor[] = [
  { id: 1, name: 'Tiago Santos', cpf: '01234567890', departmentId: 1, department: initialDepartments[0] },
  { id: 2, name: 'Keven Leone', cpf: '98765432100', departmentId: 1, department: initialDepartments[0] },
  { id: 3, name: 'Ana Beatriz', cpf: '11122233344', departmentId: 2, department: initialDepartments[1] },
  { id: 4, name: 'Kleber Fanini', cpf: '55566677788', departmentId: 3, department: initialDepartments[2] },
  { id: 5, name: 'Myllena Lelis', cpf: '99988877766', departmentId: 4, department: initialDepartments[3] },
];

const initialAllocations: Allocation[] = [
  {
    id: 1,
    dayOfWeek: 'MONDAY',
    startHour: '08:00:00',
    endHour: '10:00:00',
    professorId: 2,
    courseId: 1,
    professor: initialProfessors[1],
    course: initialCourses[0],
  },
  {
    id: 2,
    dayOfWeek: 'WEDNESDAY',
    startHour: '10:00:00',
    endHour: '12:00:00',
    professorId: 1,
    courseId: 2,
    professor: initialProfessors[0],
    course: initialCourses[1],
  },
  {
    id: 3,
    dayOfWeek: 'TUESDAY',
    startHour: '14:00:00',
    endHour: '17:00:00',
    professorId: 3,
    courseId: 3,
    professor: initialProfessors[2],
    course: initialCourses[2],
  },
  {
    id: 4,
    dayOfWeek: 'THURSDAY',
    startHour: '19:00:00',
    endHour: '22:00:00',
    professorId: 4,
    courseId: 5,
    professor: initialProfessors[3],
    course: initialCourses[4],
  },
];

class MockStorage {
  private departments: Department[] = [];
  private courses: Course[] = [];
  private professors: Professor[] = [];
  private allocations: Allocation[] = [];
  private nextDepId = 5;
  private nextCourseId = 6;
  private nextProfId = 6;
  private nextAllocId = 5;

  constructor() {
    this.init();
  }

  private init() {
    const savedDeps = localStorage.getItem('pa_departments');
    if (savedDeps) {
      this.departments = JSON.parse(savedDeps);
    } else {
      this.departments = [...initialDepartments];
      this.saveDepartments();
    }

    const savedCourses = localStorage.getItem('pa_courses');
    if (savedCourses) {
      this.courses = JSON.parse(savedCourses);
    } else {
      this.courses = [...initialCourses];
      this.saveCourses();
    }

    const savedProfs = localStorage.getItem('pa_professors');
    if (savedProfs) {
      this.professors = JSON.parse(savedProfs);
    } else {
      this.professors = [...initialProfessors];
      this.saveProfessors();
    }

    const savedAllocations = localStorage.getItem('pa_allocations');
    if (savedAllocations) {
      this.allocations = JSON.parse(savedAllocations);
    } else {
      this.allocations = [...initialAllocations];
      this.saveAllocations();
    }
  }

  private saveDepartments() {
    localStorage.setItem('pa_departments', JSON.stringify(this.departments));
  }
  private saveCourses() {
    localStorage.setItem('pa_courses', JSON.stringify(this.courses));
  }
  private saveProfessors() {
    localStorage.setItem('pa_professors', JSON.stringify(this.professors));
  }
  private saveAllocations() {
    localStorage.setItem('pa_allocations', JSON.stringify(this.allocations));
  }

  // Departments
  getDepartments(): Department[] {
    return [...this.departments].sort((a, b) => a.name.localeCompare(b.name));
  }
  getDepartmentById(id: number): Department | undefined {
    return this.departments.find((d) => d.id === Number(id));
  }
  createDepartment(name: string): Department {
    const newDep: Department = { id: Date.now(), name };
    this.departments.push(newDep);
    this.saveDepartments();
    return newDep;
  }
  updateDepartment(id: number, name: string): Department {
    const dep = this.getDepartmentById(id);
    if (!dep) throw new Error('Departamento não encontrado');
    dep.name = name;
    this.saveDepartments();
    return dep;
  }
  deleteDepartment(id: number): void {
    this.departments = this.departments.filter((d) => d.id !== Number(id));
    this.saveDepartments();
  }

  // Courses
  getCourses(): Course[] {
    return [...this.courses].sort((a, b) => a.name.localeCompare(b.name));
  }
  getCourseById(id: number): Course | undefined {
    return this.courses.find((c) => c.id === Number(id));
  }
  createCourse(name: string): Course {
    const newCourse: Course = { id: Date.now(), name };
    this.courses.push(newCourse);
    this.saveCourses();
    return newCourse;
  }
  updateCourse(id: number, name: string): Course {
    const course = this.getCourseById(id);
    if (!course) throw new Error('Curso não encontrado');
    course.name = name;
    this.saveCourses();
    return course;
  }
  deleteCourse(id: number): void {
    this.courses = this.courses.filter((c) => c.id !== Number(id));
    this.saveCourses();
  }

  // Professors
  getProfessors(): Professor[] {
    return this.professors.map((p) => ({
      ...p,
      department: this.getDepartmentById(p.departmentId),
    })).sort((a, b) => a.name.localeCompare(b.name));
  }
  getProfessorById(id: number): Professor | undefined {
    const p = this.professors.find((prof) => prof.id === Number(id));
    if (!p) return undefined;
    return { ...p, department: this.getDepartmentById(p.departmentId) };
  }
  createProfessor(name: string, cpf: string, departmentId: number): Professor {
    const dep = this.getDepartmentById(departmentId);
    const newProf: Professor = {
      id: Date.now(),
      name,
      cpf,
      departmentId,
      department: dep,
    };
    this.professors.push(newProf);
    this.saveProfessors();
    return newProf;
  }
  updateProfessor(id: number, name: string, cpf: string, departmentId: number): Professor {
    const p = this.professors.find((prof) => prof.id === Number(id));
    if (!p) throw new Error('Professor não encontrado');
    p.name = name;
    p.cpf = cpf;
    p.departmentId = departmentId;
    p.department = this.getDepartmentById(departmentId);
    this.saveProfessors();
    return p;
  }
  deleteProfessor(id: number): void {
    this.professors = this.professors.filter((p) => p.id !== Number(id));
    this.saveProfessors();
  }

  // Allocations
  getAllocations(): Allocation[] {
    return this.allocations.map((a) => ({
      ...a,
      professor: this.getProfessorById(a.professorId),
      course: this.getCourseById(a.courseId),
    }));
  }
  getAllocationById(id: number): Allocation | undefined {
    const a = this.allocations.find((alloc) => alloc.id === Number(id));
    if (!a) return undefined;
    return {
      ...a,
      professor: this.getProfessorById(a.professorId),
      course: this.getCourseById(a.courseId),
    };
  }
  createAllocation(
    dayOfWeek: DayOfWeek,
    startHour: string,
    endHour: string,
    professorId: number,
    courseId: number
  ): Allocation {
    // Check conflict for professor
    const profAllocations = this.allocations.filter(
      (a) => a.professorId === Number(professorId) && a.dayOfWeek === dayOfWeek
    );
    for (const alloc of profAllocations) {
      if (this.hasTimeOverlap(startHour, endHour, alloc.startHour, alloc.endHour)) {
        const err: any = new Error(`Conflito de horário! O professor já possui alocação em ${dayOfWeek} entre ${alloc.startHour} e ${alloc.endHour}.`);
        err.response = { status: 409, data: { message: err.message } };
        throw err;
      }
    }

    const newAlloc: Allocation = {
      id: Date.now(),
      dayOfWeek,
      startHour: this.formatTime(startHour),
      endHour: this.formatTime(endHour),
      professorId,
      courseId,
      professor: this.getProfessorById(professorId),
      course: this.getCourseById(courseId),
    };
    this.allocations.push(newAlloc);
    this.saveAllocations();
    return newAlloc;
  }
  updateAllocation(
    id: number,
    dayOfWeek: DayOfWeek,
    startHour: string,
    endHour: string,
    professorId: number,
    courseId: number
  ): Allocation {
    const alloc = this.allocations.find((a) => a.id === Number(id));
    if (!alloc) throw new Error('Alocação não encontrada');

    // Check conflict
    const profAllocations = this.allocations.filter(
      (a) => a.id !== Number(id) && a.professorId === Number(professorId) && a.dayOfWeek === dayOfWeek
    );
    for (const other of profAllocations) {
      if (this.hasTimeOverlap(startHour, endHour, other.startHour, other.endHour)) {
        const err: any = new Error(`Conflito de horário! O professor já possui alocação em ${dayOfWeek} entre ${other.startHour} e ${other.endHour}.`);
        err.response = { status: 409, data: { message: err.message } };
        throw err;
      }
    }

    alloc.dayOfWeek = dayOfWeek;
    alloc.startHour = this.formatTime(startHour);
    alloc.endHour = this.formatTime(endHour);
    alloc.professorId = professorId;
    alloc.courseId = courseId;
    alloc.professor = this.getProfessorById(professorId);
    alloc.course = this.getCourseById(courseId);
    this.saveAllocations();
    return alloc;
  }
  deleteAllocation(id: number): void {
    this.allocations = this.allocations.filter((a) => a.id !== Number(id));
    this.saveAllocations();
  }

  // Dashboard & Workload calculation
  getDashboardReport(): DashboardReport {
    const profs = this.getProfessors();
    const allocs = this.getAllocations();

    const workloads = profs.map((prof) => {
      const profAllocs = allocs.filter((a) => a.professorId === prof.id);
      let totalMinutes = 0;
      profAllocs.forEach((a) => {
        const start = this.timeToMinutes(a.startHour);
        const end = this.timeToMinutes(a.endHour);
        if (end > start) {
          totalMinutes += end - start;
        }
      });
      const totalHours = Math.round((totalMinutes / 60) * 100) / 100;
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      const formattedWorkload = `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;

      return {
        professorId: prof.id,
        professorName: prof.name,
        departmentName: prof.department?.name || 'Sem Departamento',
        totalHours,
        formattedWorkload,
      };
    });

    return {
      totalProfessors: profs.length,
      totalDepartments: this.departments.length,
      totalCourses: this.courses.length,
      totalAllocations: allocs.length,
      workloads,
    };
  }

  // Helper for schedule CSV/ICS export offline
  exportScheduleCSV(profId: number): string {
    const prof = this.getProfessorById(profId);
    const allocs = this.allocations.filter((a) => a.professorId === Number(profId));
    let csv = 'Dia da Semana,Horario Inicio,Horario Fim,Disciplina / Curso,Departamento\n';
    allocs.forEach((a) => {
      const course = this.getCourseById(a.courseId)?.name || 'N/A';
      const dep = prof?.department?.name || 'N/A';
      csv += `"${a.dayOfWeek}","${a.startHour}","${a.endHour}","${course}","${dep}"\n`;
    });
    return csv;
  }

  exportScheduleICS(profId: number): string {
    const prof = this.getProfessorById(profId);
    const allocs = this.allocations.filter((a) => a.professorId === Number(profId));
    let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Fafire//Professor Allocation//PT\n';
    allocs.forEach((a, index) => {
      const course = this.getCourseById(a.courseId)?.name || 'Aula';
      ics += 'BEGIN:VEVENT\n';
      ics += `UID:alloc-${a.id}-${index}@fafire.edu.br\n`;
      ics += `SUMMARY:${course} - Prof. ${prof?.name || ''}\n`;
      ics += `DESCRIPTION:Aula da disciplina ${course}\n`;
      ics += `RRULE:FREQ=WEEKLY;BYDAY=${a.dayOfWeek.substring(0, 2)}\n`;
      ics += 'END:VEVENT\n';
    });
    ics += 'END:VCALENDAR\n';
    return ics;
  }

  private timeToMinutes(t: string): number {
    const parts = t.split(':').map(Number);
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  }

  private hasTimeOverlap(s1: string, e1: string, s2: string, e2: string): boolean {
    const start1 = this.timeToMinutes(s1);
    const end1 = this.timeToMinutes(e1);
    const start2 = this.timeToMinutes(s2);
    const end2 = this.timeToMinutes(e2);
    return Math.max(start1, start2) < Math.min(end1, end2);
  }

  private formatTime(t: string): string {
    if (!t) return '00:00:00';
    if (t.length === 5) return `${t}:00`;
    return t;
  }
}

export const mockStorage = new MockStorage();
