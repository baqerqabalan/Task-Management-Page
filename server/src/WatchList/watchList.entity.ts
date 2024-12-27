import { Task } from 'src/Task/task.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('watchlist')
export class WatchList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  taskId: number;

  @ManyToOne(() => Task, (task) => task.watchLists)
  task: Task;
}
