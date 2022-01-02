import { Router } from 'express';
import { check } from 'express-validator';
import { login, logout, register } from '../controllers/user';

const router = Router();

router.post(
  '/register',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    check('password', 'Password should be more than or equal 8').isLength({
      min: 8,
    }),
    check('name', 'Name is required').not().isEmpty(),
  ],
  register
);

router.post('/login', login);

router.post('/logout', logout);

export default router;
