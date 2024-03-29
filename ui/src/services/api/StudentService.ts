import Routine, { ReducedRoutine } from '../../model/routines/Routine';
import { StudentDetail } from '../../model/student/Student';
import APIService from './APIService';

export default class StudentService extends APIService {
  protected static PATH = '/students';

  static async me() {
    const localData = sessionStorage.getItem('student');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (parsed?.instructor) return Promise.resolve({ data: parsed, hasError: false });
      } catch (_) {}
    }
    const res = await this.get<StudentDetail>('/me');
    if (!res.hasError) {
      sessionStorage.setItem('student', JSON.stringify(res.data));
    }
    return res;
  }

  static async getRoutines() {
    return await this.get<ReducedRoutine[]>('/routines');
  }

  static async getRoutineDetail(routineId: number) {
    return await this.get<Routine>(`/routines/${routineId}`);
  }
}
