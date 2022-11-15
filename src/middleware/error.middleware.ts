import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = (error: any, _request: Request, response: Response, next: NextFunction) => {
  const status = error.statusCode || error.status || 500;

  response.status(status).send(error).end();
};
