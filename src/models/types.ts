import { Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  haveTaskInProg: boolean;
  taskId?: string;
}

interface ITask extends Document {
  descritpion: string;
  inProgress: boolean;
  user: string;
  createdAt: Date;
  updatedAt: Date;
}

export { IUser, ITask };
