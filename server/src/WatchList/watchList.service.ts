import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchList } from './watchList.entity';
import { Task } from 'src/Task/task.entity';

@Injectable()
export class WatchListService {
  constructor(
    @InjectRepository(WatchList)
    private readonly watchListRepository: Repository<WatchList>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // Find WatchList by taskId (to check if a task is already in a WatchList)
  async findByTaskId(id: number): Promise<WatchList> {
    return this.watchListRepository.findOne({
      where: { taskId: id },
    });
  }

  async getWatchList(): Promise<WatchList[]> {
    return this.watchListRepository.find({
      relations: ['task', 'task.assignedToUser'],
      select: {
        taskId: true,
        task: {
          name: true,
          status: true,
          assignedToUser: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // Remove task from WatchList
  async removeTaskFromWatchList(taskId: number): Promise<void> {
    const watchList = await this.findByTaskId(taskId);
    if (watchList) {
      // Remove the task from the WatchList
      await this.watchListRepository.remove(watchList);
    } else {
      throw new HttpException(
        'WatchList not found for the given task',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Add task to a new WatchList or existing one
  async addTaskToWatchList(taskId: number): Promise<WatchList> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    // Check if a WatchList already exists for this taskId
    let watchList = await this.findByTaskId(taskId);
    if (watchList) {
      return watchList;
    }

    // Create a new WatchList and associate the task with it
    watchList = this.watchListRepository.create({
      taskId: task.id,
    });

    // Save and return the new WatchList
    return this.watchListRepository.save(watchList);
  }
}
