import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  // Injecting the User repository
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Method to get all users
  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  //Find User by Id
  async findUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  // Login Method
  async login(
    requestedEmail: string,
    candidatePassword: string,
  ): Promise<{ user: User; token: string }> {
    // 1-Find the user by email and check if his role is admin
    const user = await this.userRepository.findOne({
      where: { email: requestedEmail, role: 'admin' },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // 2-Check if the password is correct
    const isPasswordCorrect = await user.checkPassword(candidatePassword);
    if (!isPasswordCorrect) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    // 3-Generate JWT token
    const token = jwt.sign(
      { userId: user.id }, // Payload
      process.env.JWT_SECRET, // Secret
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    // 4-Return the user and the token
    return {
      user,
      token,
    };
  }
}
