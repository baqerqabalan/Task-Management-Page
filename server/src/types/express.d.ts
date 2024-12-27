import { User } from './User/user.entity';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
