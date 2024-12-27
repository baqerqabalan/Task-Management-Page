import { CreateTaskDto } from './createTaskDto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from 'src/User/user.entity';
import { Project } from 'src/Project/project.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  //Add Task Handler
  async addTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { assignedToUser, project, ...taskData } = createTaskDto;

    let assignedUser = null;
    let assignedProject = null;

    // Check if assignee user is found
    if (assignedToUser) {
      assignedUser = await this.userRepository.findOne({
        where: { id: assignedToUser },
      });

      if (!assignedUser) {
        throw new HttpException(
          "User you're assigning the task to is not found",
          HttpStatus.NOT_FOUND,
        );
      }
    }

    // Check if project is found
    if (project) {
      assignedProject = await this.projectRepository.findOne({
        where: { id: project },
      });

      if (!assignedProject) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }
    }

    // Create the task with the provided data and relationships
    const task = this.taskRepository.create({
      ...taskData,
      createdByUser: user,
      assignedToUser: assignedUser,
      project: assignedProject,
    });

    // Save the task and return the result
    return this.taskRepository.save(task);
  }

  //Handle Edit Task
  async editTask(
    taskId: number,
    taskDto: CreateTaskDto,
    createdByUserId: number,
  ): Promise<Task> {
    //1-Check if task exists
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['createdByUser'],
    });

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    //2-Check if the editor of the task is the one who created it (Admin)
    if (task.createdByUser.id !== createdByUserId) {
      throw new HttpException(
        'You are not allowed to edit this task',
        HttpStatus.FORBIDDEN,
      );
    }

    Object.assign(task, taskDto); // Merge updates into the existing task
    return this.taskRepository.save(task);
  }

  //Handle Remove the task
  async removeTask(taskId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    await this.taskRepository.delete(taskId);

    return task;
  }

  //Handle Get Tasks based on query parameters
  async getTasks(
    page: number,
    pageSize: number,
    searchTerm: string,
    filterOption: string,
  ): Promise<any[]> {
    const pageNum = page || 1;
    const pageLimit = pageSize || 10;
    const skip = (pageNum - 1) * pageLimit;

    const taskRepository = this.taskRepository;

    // 1-Start building the query
    const queryBuilder = taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedToUser', 'user')
      .leftJoinAndSelect('task.project', 'project')
      .addSelect(
        `(SELECT COUNT(*) FROM watchlist WHERE watchlist."taskId" = task.id) > 0 AS isInWatchlist`,
      )
      .skip(skip)
      .take(pageLimit);

    // 2-Apply filter by status
    if (filterOption && filterOption !== 'all') {
      queryBuilder.andWhere('task.status = :filterOption', { filterOption });
    }

    // 2-Apply search by name or description
    if (searchTerm) {
      queryBuilder.andWhere(
        '(LOWER(task.name) LIKE LOWER(:searchTerm) OR LOWER(task.description) LIKE LOWER(:searchTerm))',
        { searchTerm: `%${searchTerm}%` },
      );
    }

    // 4-Execute the query
    const tasks = await queryBuilder.getRawMany();

    // 5-Map the raw results to a more structured format
    const tasksWithWatchlistStatus = tasks.map((task) => ({
      id: task.task_id,
      name: task.task_name,
      description: task.task_description,
      deadline: task.task_deadline,
      status: task.task_status,
      priority: task.task_priority,
      createdAt: task.task_createdAt,
      assignedToUser: {
        id: task.user_id,
        firstName: task.user_firstName,
        lastName: task.user_lastName,
      },
      project: {
        id: task.project_id,
        name: task.project_name,
      },
      isInWatchlist: task.isinwatchlist,
    }));

    return tasksWithWatchlistStatus;
  }

  //Method to get total tasks for pagination purposes
  async getTotalTasksCount(): Promise<number> {
    return await this.taskRepository.count();
  }

  //Method to find task by Id
  async findTaskById(taskId: number): Promise<Task> {
    return await this.taskRepository.findOne({ where: { id: taskId } });
  }

  //Method to get Available Projects and Users
  async getProjectAndUsersNames(): Promise<{
    projects: Project[];
    users: User[];
  }> {
    const projects = await this.projectRepository.find({
      select: { id: true, name: true },
    });
    const users = await this.userRepository.find({
      select: { id: true, firstName: true, lastName: true },
    });
    return { projects, users };
  }

  //Task scheduler method to update the status of tasks who reached their deadline
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleTaskDeadlines(): Promise<void> {
    const currentDate = new Date().toISOString();

    await this.taskRepository
      .createQueryBuilder()
      .update('tasks')
      .set({ status: 'Exceeds Deadline' })
      .where('deadline < :currentDate', { currentDate })
      .andWhere('status IN (:...statuses)', {
        statuses: ['Open', 'In Progress'],
      })
      .execute();
  }
}
