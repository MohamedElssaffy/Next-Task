import mongoose, { Schema } from 'mongoose';
import { ITask } from './types';

const TaskSchema: Schema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    inProgress: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model<ITask>('Task', TaskSchema);

export { Task };
