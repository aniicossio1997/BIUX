import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "../../users/entities/users.entity";
import { RoutinesEntity } from "../../routines/entities/routines.entity";


@Entity({name:'rutines_assignment'})
export class RoutineAssignmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id:string;


  //una rutina puede ser asignado muchas veces
  @ManyToOne(() => RoutinesEntity, routine => routine.assignments)
  routine: RoutinesEntity;

  //a un estudiante se le puede asignar muchas rutinas
  @ManyToOne(() => UsersEntity, user => user.routineAssignments)
  student: UsersEntity;
}