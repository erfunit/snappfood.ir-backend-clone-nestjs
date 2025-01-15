import { UserEntity } from 'src/modules/users/entity/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
    }
  }
}
