import { IsDateString, IsEnum, IsInt, IsString } from 'class-validator';
import { PriorityEnum, StatusEnum } from './enums';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  deadline: Date;

  @IsEnum(StatusEnum)
  status: StatusEnum;

  @IsEnum(PriorityEnum)
  priority: PriorityEnum;

  @IsInt()
  assignedToUser: number;

  @IsInt()
  project: number;
}
