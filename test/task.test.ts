import { sign } from 'jsonwebtoken';
import request from 'supertest';

import { app } from '../src/app';
import { Task } from '../src/models/Task';
import { User } from '../src/models/User';
import {
  existUserOne,
  existUserOneId,
  existUserTwo,
  existUserTwoId,
  setUpDB,
  user,
} from './seed-data';

let userHasTaskToken: string;
let userDontTaskToken: string;

beforeEach(setUpDB);

describe('For Login User', () => {
  describe('For User has task', () => {
    beforeEach(async () => {
      userHasTaskToken = sign({ id: existUserOneId }, process.env.JWT_SECRET);
    });

    test('Should not create a new task because it has one openning', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ description: 'test desc' })
        .set('Cookie', `auth=${userHasTaskToken}`)
        .expect(400);

      expect(response.body.errors.length).toBe(1);
    });

    test('Should Stop the task', async () => {
      const response = await request(app)
        .patch('/tasks/stop')
        .set('Cookie', `auth=${userHasTaskToken}`)
        .expect(200);

      expect(response.body.success).toBeTruthy();
    });

    test('Should get summary file', async () => {
      const response = await request(app)
        .post('/tasks/summary')
        .set('Cookie', `auth=${userHasTaskToken}`)
        .expect(200);

      expect(response.body.success).toBeTruthy();
    });
  });

  describe('For user dont have openning task', () => {
    beforeEach(async () => {
      userDontTaskToken = sign({ id: existUserTwoId }, process.env.JWT_SECRET);
    });

    test('Should Create a task', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ description: 'desc or test user dont have a task' })
        .set('Cookie', `auth=${userDontTaskToken}`)
        .expect(201);

      expect(response.body.success).toBeTruthy();

      // assert Task is exist in DB
      const isTaskExist = await Task.findOne({
        description: 'desc or test user dont have a task',
      });
      expect(isTaskExist).not.toBeNull();
    });

    test('Should not stop task because he dont have one', async () => {
      const response = await request(app)
        .patch('/tasks/stop')
        .set('Cookie', `auth=${userDontTaskToken}`)
        .expect(400);

      expect(response.body.errors.length).toBe(1);
    });
  });
});

describe('For not login user', () => {
  test('Should not access any route about tasks', async () => {
    // Create task route
    await request(app)
      .post('/tasks')
      .send({ description: 'should fail' })
      .expect(401);

    // Stop task route
    await request(app).patch('/tasks/stop').expect(401);

    // Summary route
    await request(app).post('/tasks/summary').expect(401);
  });
});
