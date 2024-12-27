import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Login
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.userService.login(email, password);
  }

  // Get User By Id
  @Get('getUser/:userId')
  async getUserById(@Param('userId') userId: number): Promise<User> {
    return this.userService.findUserById(userId);
  }

  // GET route to fetch all users
  @Get()
  async getUsers(@Res() res: Response): Promise<void> {
    try {
      const users = await this.userService.getUsers();
      res.status(HttpStatus.OK).json({ users });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred while fetching users',
        error: error.message,
      });
    }
  }
}
