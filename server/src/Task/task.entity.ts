import { WatchList } from './../WatchList/watchList.entity';
import { Project } from 'src/Project/project.entity';
import { User } from 'src/User/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PriorityEnum, StatusEnum } from './enums';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  deadline: Date;

  @Column({ enum: StatusEnum, default: 'Open' })
  status: string;

  @Column({ enum: PriorityEnum, default: 'Low' })
  priority: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @BeforeInsert()
  validateDeadline() {
    if (this.deadline <= new Date()) {
      throw new Error('Deadline must be in the future.');
    }
  }

  @ManyToOne(() => User, (user) => user.createdTasks)
  createdByUser: User;

  @ManyToOne(() => User, (user) => user.assignedTasks)
  assignedToUser: User;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @OneToMany(() => WatchList, (watchList) => watchList.task)
  watchLists: WatchList[];
}
