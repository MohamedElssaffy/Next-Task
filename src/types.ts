import { Request as ExpressReq } from 'express';

export type Request = ExpressReq & {
  user?: {
    id: string;
    haveTaskInProg: boolean;
    taskId?: string;
  };
};
