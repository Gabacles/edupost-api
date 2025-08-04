import { User } from '@/user/entities/user.entity';

export interface IPost {
  id?: number;
  title: string;
  content: string;
  author_id: User;
  createdAt?: Date;
  updatedAt?: Date;
}
