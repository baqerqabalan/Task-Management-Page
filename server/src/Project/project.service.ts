import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  // Injecting the Project repository
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  // Method to get all projects
  async getProjects(): Promise<Project[]> {
    return await this.projectRepository.find();
  }

  //Method to get project by Id
  async getProjectById(projectId: number): Promise<Project> {
    return await this.projectRepository.findOne({ where: { id: projectId } });
  }
}
