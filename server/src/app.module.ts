import { WatchList } from './WatchList/watchList.entity';
import { AuthMiddleware } from './auth.middleware';
import { Project } from './Project/project.entity';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './User/user.entity';
import { UserController } from './User/user.controller';
import { UserService } from './User/user.service';
import { ProjectController } from './Project/project.controller';
import { ProjectService } from './Project/project.service';
import { Task } from './Task/task.entity';
import { TaskController } from './Task/task.controller';
import { TaskService } from './Task/task.service';
import { WatchListService } from './WatchList/watchList.service';
import { WatchListController } from './WatchList/watchList.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'taskify',
      entities: [User, Project, Task, WatchList],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Project, Task, WatchList]),
  ],
  controllers: [
    AppController,
    UserController,
    ProjectController,
    TaskController,
    WatchListController,
  ],
  providers: [
    AppService,
    UserService,
    ProjectService,
    TaskService,
    WatchListService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
