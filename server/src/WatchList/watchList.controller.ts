import { TaskService } from './../Task/task.service';
import { WatchList } from './watchList.entity';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { WatchListService } from './watchList.service';

@Controller('watchList')
export class WatchListController {
  constructor(
    private readonly watchListService: WatchListService,
    private readonly taskService: TaskService,
  ) {}

  //Get All watchlist
  @Get()
  async getAllWatchList(): Promise<WatchList[]> {
    return this.watchListService.getWatchList();
  }
  // Add task to the watchlist
  @Post('add/:taskId')
  async addTaskToWatchList(
    @Param('taskId') taskId: number,
  ): Promise<WatchList> {
    // 1. Check if the task exists
    const task = await this.taskService.findTaskById(taskId);
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    // 2. Check if the task is already associated with a WatchList
    const existingWatchList = await this.watchListService.findByTaskId(taskId);
    if (existingWatchList) {
      // 2.1 If task already in a WatchList, so remove it
      await this.watchListService.removeTaskFromWatchList(taskId);
    } else {
      // 3. Create or add task to a new WatchList
      const updatedWatchList =
        await this.watchListService.addTaskToWatchList(taskId);

      // 4. Return the updated WatchList
      return updatedWatchList;
    }
  }
}
