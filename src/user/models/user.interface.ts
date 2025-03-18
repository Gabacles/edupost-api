import { Post } from "src/post/entities/post.entity";
import { UserRoles } from "./userRoles.enum";

export interface IUser {
    id: number;
    username: string;
    name: string;
    email: string;
    password: string;
    roles: UserRoles;
    posts?: Post[];
  }