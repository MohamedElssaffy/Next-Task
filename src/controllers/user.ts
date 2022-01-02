import { Response } from 'express';
import { validationResult } from 'express-validator';
import { compare, hash } from 'bcryptjs';
import { User } from '../models/User';
import { Request } from '../types';
import { sign } from 'jsonwebtoken';

const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  try {
    const { name, email, password } = req.body;
    const hashPassword = await hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashPassword,
    });

    await user.save();
    return res
      .status(201)
      .json({ success: true, msg: 'User has been created, Please login' });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'This email is already taken' }] });
    }
    return res
      .status(500)
      .json({ errors: [{ msg: 'Server Error Please try again' }] });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const isPassMatch = await compare(password, user.password);

    if (!isPassMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const token = sign({ id: user.id }, process.env.JWT_SECRET as string);
    res.cookie('auth', token, { httpOnly: true });

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ errors: [{ msg: 'Server Error Please try again' }] });
  }
};

const logout = async (_: Request, res: Response) => {
  res.cookie('auth', '');
  return res.json('Logout Success');
};

export { register, login, logout };
