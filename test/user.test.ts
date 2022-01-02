import request from 'supertest';

import { app } from '../src/app';
import { User } from '../src/models/User';
import { existUserOne, setUpDB, user } from './seed-data';

beforeEach(setUpDB);

test('Should register successfully', async () => {
  const response = await request(app)
    .post('/users/register')
    .send(user)
    .expect(201);

  // assert user is exist in DB
  const isUserExist = await User.findOne({ email: user.email });
  expect(isUserExist).not.toBeNull();

  expect(response.body.success).toBeTruthy();
});

test('Should login success', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({ email: existUserOne.email, password: existUserOne.password })
    .expect(200);

  expect(response.body.success).toBeTruthy();
});

test('Should register fail due to required', async () => {
  const response = await request(app)
    .post('/users/register')
    .send()
    .expect(400);

  // assert error array length
  expect(response.body.errors.length).toBe(4);
});

test('Should register fail due to password length and email is not email', async () => {
  const response = await request(app)
    .post('/users/register')
    .send({
      name: 'test',
      email: 'not emial',
      password: '123456',
    })
    .expect(400);

  // assert error array length
  expect(response.body.errors.length).toBe(2);
});

test('Should register fail due to duplicate email', async () => {
  const response = await request(app)
    .post('/users/register')
    .send({
      name: 'test',
      email: existUserOne.email,
      password: '12345678',
    })
    .expect(400);

  // assert error array length
  expect(response.body.errors.length).toBe(1);
});

test('Should not login with non existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send(user)
    .expect(400);

  // assert error array length
  expect(response.body.errors.length).toBe(1);
});
