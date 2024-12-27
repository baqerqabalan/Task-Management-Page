import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/User/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Check if the token exists in the request header
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }

      // If there's no token, set user to null and proceed
      if (!token) {
        req.user = null;
        return next();
      }

      // 2. Verify the token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          res
            .status(401)
            .json({ message: 'Invalid token, please log in again' });
        } else if (error.name === 'TokenExpiredError') {
          return res
            .status(401)
            .json({ message: 'Your session expired, Log in again' });
        }
        return res.status(500).json({ message: 'Token verification failed' });
      }

      // 3. Find the user in the database
      const currentUser = await this.userService.findUserById(decoded.id);
      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // 5. Save the user in the request object and continue
      req.user = currentUser;
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
}
