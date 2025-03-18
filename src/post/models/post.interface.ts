export interface IPost {
  id?: number;
  title: string;
  content: string;
  author_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}
