import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';
import { PublicAccess } from 'src/auth/decorators/public.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { InstructorService } from './instructor.service';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CodeCheckDTO } from './dto/code-check.dto';
import { RoutineUpdateDTO } from 'src/routines/dto/routine.update.dto';
import { RoutineCreateDTO } from 'src/routines/dto/routine.create.dto';
import { IsStudentsCodePipe } from './pipes/isStudents.pipe';
import { RemoveFieldsRoutineUpdatePipe } from 'src/pipes/remove-fields-routine-update';
import { UpdateStudentRoutinesDTO } from './dto/update-student-routines.dto';

@ApiTags('Instructor')
@Controller('instructor')
@UseGuards(AuthGuard, RolesGuard)
export class InstructorController {

    constructor(private readonly instructorService:InstructorService){}

    @Get('/code')
    @ApiHeader({name:"token",required:true})
    @Roles('INSTRUCTOR')
    public async code(@Req() request: Request){
        return await this.instructorService.code(request.idUser);
    }

    @Post('/code/regenerate')
    @ApiHeader({name:"token",required:true})
    @Roles('INSTRUCTOR')
    public async regenerateCode(@Req() request: Request){
        return await this.instructorService.regenerateCode(request.idUser);
    }
    
    @Post('/code/check')
    @PublicAccess()
    public async checkCode(@Body() body:CodeCheckDTO){
        return await this.instructorService.checkCode(body.code);
    }

    
    @Post('/routines')
    @ApiProperty()
    @ApiHeader({name:'token',required: true})
    @Roles('INSTRUCTOR')
    public async created(@Req() request: Request, @Body() body:RoutineCreateDTO){
      return await this.instructorService.createRoutine(request.idUser,body)
    }
    
    @Get('/routines')
    @ApiHeader({name:"token",required:true})
    @Roles('INSTRUCTOR')
    public async routines(@Req() request: Request){
        return await this.instructorService.routines(request.idUser);
    }
    @Get('/routines/:id_routine')
    @ApiHeader({name:"token",required:true})
    @Roles('INSTRUCTOR')
    public async routine(@Req() request: Request,@Param('id_routine') id_routine: number){
        return await this.instructorService.routineDetails(request.idUser,id_routine);
    }

    @Patch('/routines/:id_routine')
    @UsePipes(new RemoveFieldsRoutineUpdatePipe())
    @ApiProperty({name:'id_routine'})
    @ApiHeader({name:'token',required: true})
    @Roles('INSTRUCTOR')
    public async updateRoutine(@Req() request: Request,@Param('id_routine') id_routine: number,@Body() body:RoutineUpdateDTO){
      return await this.instructorService.updateRoutine(request.idUser,id_routine,body)
    }
    @Get('/students')
    @ApiProperty()
    @ApiHeader({name:'token',required: true})
    @Roles('INSTRUCTOR')
    public async students(@Req() request: Request){
        return await this.instructorService.getStudents(request.idUser)
    }

    
    @Get('/students/:id_student')
    @ApiProperty({name:'id_student'})
    @ApiHeader({name:'token',required: true})
    @Roles('INSTRUCTOR')
    public async studentDetails(@Req() request: Request,@Param('id_student') id_student: number){
      return await this.instructorService.getStudentDetail(request.idUser,id_student)
    }

    @Patch('/students/:id_student/routines')
    @ApiProperty({name:'id_student'})
    @ApiHeader({name:'token',required: true})
    @Roles('INSTRUCTOR')
    public async updateStudentRoutines(@Req() request: Request,@Param('id_student') id_student: number, @Body() body:UpdateStudentRoutinesDTO){
      return await this.instructorService.updateStudentRoutines(request.idUser,id_student, body?.routineIds)
    }

}
