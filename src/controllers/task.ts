import { promises as fsPromise } from 'fs';
import { Response } from 'express';
import { validationResult } from 'express-validator';
import { createObjectCsvWriter } from 'csv-writer';
import { User } from '../models/User';
import { Task } from '../models/Task';
import { Request } from '../types';
import { convertHMS } from '../utils/format-time';
import mongoose from 'mongoose';

const createTask = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  if (req.user?.haveTaskInProg) {
    return res.status(400).json({
      errors: [{ msg: "Can't create new task until finish the openning" }],
    });
  }

  try {
    const task = new Task({
      description: req.body.description,
      user: req.user?.id,
    });

    await task.save();
    await User.findByIdAndUpdate(req.user?.id, {
      $set: { haveTaskInProg: true, taskId: task.id },
    });

    return res
      .status(201)
      .json({ success: true, msg: 'Task has been created' });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ errors: [{ msg: 'Server Error Please try again' }] });
  }
};

const stopTheTask = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new Error();

    const { id, haveTaskInProg, taskId } = req.user;

    if (!haveTaskInProg) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'You do not have a task in progress' }] });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ errors: [{ msg: 'Task Not Found' }] });
    }
    task.inProgress = false;

    await task.save();
    await User.findByIdAndUpdate(id, {
      $set: { haveTaskInProg: false, taskId: null },
    });

    return res.json({ success: true, msg: 'The task has stopped successfuly' });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ errors: [{ msg: 'Server Error Please try again' }] });
  }
};

const downloadSummary = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new Error();

    const tasks: {
      _id: string;
      description: string;
      start: Date[];
      end: Date[];
    }[] = await Task.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.user.id) },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%d', date: '$createdAt' } },
          description: { $push: '$description' },
          start: { $push: '$createdAt' },
          end: { $push: '$updatedAt' },
        },
      },
    ]);

    if (tasks.length === 0) {
      return res.status(404).json({ errors: [{ msg: 'No Tasks Found' }] });
    }

    const formattedTask = tasks.map((task) => {
      const start = task.start.map((val) => new Date(val).getTime());
      const end = task.end.map((val) => new Date(val).getTime());
      const sum = start.map((val, index) => end[index] - val);
      return {
        ...task,
        totalHours: convertHMS(
          sum.reduce((acc, cur) => acc + cur, 0) / 60 / 1000
        ),
      };
    });

    const csvWriter = createObjectCsvWriter({
      path: './src/summary-files/data.csv',
      header: [
        { id: '_id', title: 'Day' },
        { id: 'description', title: 'Description' },
        { id: 'totalHours', title: 'Total Hours' },
      ],
    });
    await csvWriter.writeRecords(formattedTask);

    const file = await fsPromise.readFile('./src/summary-files/data.csv');

    return res.json({ success: true, file });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ errors: [{ msg: 'Server Error Please try again' }] });
  }
};

export { createTask, stopTheTask, downloadSummary };
