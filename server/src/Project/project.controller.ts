import { ProjectService } from './project.service';
import { Controller, Get, Res, HttpStatus, Param } from '@nestjs/common';
import { Response } from 'express';
import { Project } from './project.entity';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // GET route to fetch all projects
  @Get()
  async getProjects(@Res() res: Response): Promise<void> {
    try {
      const projects = await this.projectService.getProjects();
      res.status(HttpStatus.OK).json({ projects });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred while fetching projects',
        error: error.message,
      });
    }
  }

  //Get Project By Id
  @Get('/getProject/:projectId')
  async getProjectById(
    @Param('projectId') projectId: number,
  ): Promise<Project> {
    return await this.projectService.getProjectById(projectId);
  }
}
