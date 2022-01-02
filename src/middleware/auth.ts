import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from '../models/User';
import { Request } from '../types';

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies['auth'];
    if (!token) {
      return res.status(401).json({ errors: [{ msg: 'Please Login' }] });
    }

    const decoded = verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ errors: [{ msg: 'Please Login' }] });
    }

    req.user = {
      id: user.id,
      haveTaskInProg: user.haveTaskInProg,
      taskId: user.taskId,
    };

    return next();
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ errors: [{ msg: 'Server Error Please try again' }] });
  }
};

export { isAuth };
