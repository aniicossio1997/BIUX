import { InstructorCode } from '../../model/instructor/InstructorCode';
import Routine, { ReducedRoutine, RoutineCreateRequest } from '../../model/routines/Routine';
import { ReducedStudent } from '../../model/student/Student';
import { StudentFullDetails } from '../../model/student/Student';
import { User } from '../../model/user/User';
import APIService from './APIService';

export default class InstructorService extends APIService {
  protected static PATH = '/instructor';

  static async getCode() {
    return this.get<InstructorCode>('/code');
  }

  static async regenerateCode() {
    return this.post<InstructorCode>('/code/regenerate');
  }

  static async checkCode(code: string) {
    return this.post<{ valid: boolean; user: User }>('/code/check', { code });
  }

  static async createRoutine(data: RoutineCreateRequest) {
    return await this.post<Routine>('/routines', data);
  }

  static async getRoutines() {
    return await this.get<ReducedRoutine[]>('/routines');
  }

  static async getRoutineDetail(id: number) {
    return await this.get<Routine>(`/routines/${id}`);
  }

  static async editRoutine(id: number, data: Partial<RoutineCreateRequest>) {
    return await this.patch<Routine>(`/routines/${id}`, data);
  }

  static async getStudents() {
    return await this.get<ReducedStudent[]>('/students');
  }
  static async getStudent(studentUserId: number) {
    return await this.get<StudentFullDetails>(`/students/${studentUserId}`);
  }

  static async updateStudentRoutines(studentUserId: number, routineIds: number[]) {
    return await this.patch<ReducedRoutine[]>(`/students/${studentUserId}/routines`, {routineIds});
  }
}
