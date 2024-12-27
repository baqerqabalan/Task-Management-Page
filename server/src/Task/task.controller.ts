import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './createTaskDto';
import { Task } from './task.entity';
import { User } from 'src/User/user.entity';
import { Request } from 'express';
import { Project } from 'src/Project/project.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Post route to add a task
  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
  ): Promise<Task> {
    const user = req.user as User;
    if (!user) {
      throw new HttpException(
        'You are not logged in. Please Login',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.taskService.addTask(createTaskDto, user);
  }

  // Patch route to edit a task
  @Patch(':taskId')
  async editTask(
    @Param('taskId') taskId: number,
    @Body() taskDto: CreateTaskDto,
    @Req() req: Request,
  ): Promise<Task> {
    const user = req.user as User;
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.taskService.editTask(taskId, taskDto, user.id);
  }

  //Remove a task
  @Delete(':taskId')
  async removeTask(@Param('taskId') taskId: number): Promise<Task> {
    return this.taskService.removeTask(taskId);
  }

  //Get tasks based on query parameters
  @Get('getTasks')
  async getAllTasks(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('searchTerm') searchTerm: string,
    @Query('filterOption') filterOption: string,
  ): Promise<{ tasks: Task[]; totalCount: number }> {
    const tasks = await this.taskService.getTasks(
      page,
      pageSize,
      searchTerm,
      filterOption,
    );
    const totalCount = await this.taskService.getTotalTasksCount();
    return { tasks, totalCount };
  }

  //Get Project and User names
  @Get('getPorjectAndUserNames')
  async getProjectAndUserNames(): Promise<{
    projects: Project[];
    users: User[];
  }> {
    const projects = (await this.taskService.getProjectAndUsersNames())
      .projects;
    const users = (await this.taskService.getProjectAndUsersNames()).users;
    return { projects, users };
  }
}
