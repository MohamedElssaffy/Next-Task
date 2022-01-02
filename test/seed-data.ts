import { hash } from 'bcryptjs';
import mongoose from 'mongoose';
import { Task } from '../src/models/Task';
import { User } from '../src/models/User';

const taskId = new mongoose.Types.ObjectId();
const existUserOneId = new mongoose.Types.ObjectId();
const existUserTwoId = new mongoose.Types.ObjectId();

const user = {
  name: 'test',
  email: 'test@email.com',
  password: '12345678',
};

const existUserOne = {
  _id: existUserOneId,
  name: 'mohamed',
  email: 'mohamed@email.com',
  password: '12345678',
  haveTaskInProg: true,
  taskId,
};

const existUserTwo = {
  _id: existUserTwoId,
  name: 'mohamed2',
  email: 'mohamed2@email.com',
  password: '12345678',
};

const task = {
  _id: taskId,
  description: 'test decription',
  user: existUserOneId,
};

const setUpDB = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User({
    ...existUserOne,
    password: await hash(existUserOne.password, 12),
  }).save();
  await new User({
    ...existUserTwo,
    password: await hash(existUserTwo.password, 12),
  }).save();
  await new Task(task).save();
};

export {
  user,
  task,
  taskId,
  existUserOne,
  existUserTwo,
  existUserTwoId,
  existUserOneId,
  setUpDB,
};
