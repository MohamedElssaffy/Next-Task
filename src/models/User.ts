import mongoose, { Schema } from 'mongoose';
import { IUser } from './types';

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  haveTaskInProg: {
    type: Boolean,
    default: false,
  },
  taskId: {
    type: mongoose.Types.ObjectId,
  },
});

const User = mongoose.model<IUser>('User', UserSchema);

export { User };
