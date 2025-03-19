import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from '../models/user.interface';
import { UserRoles } from '../models/userRoles.enum';
import { Post } from '@/post/entities/post.entity';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 30 })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.STUDENT })
  roles: UserRoles;

  @OneToMany(() => Post, (post) => post.author_id, { cascade: true })
  posts: Post[];
}
