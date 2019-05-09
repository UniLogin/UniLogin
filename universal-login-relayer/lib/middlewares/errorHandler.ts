import {Request, Response, NextFunction} from 'express';
import {NotFound, PaymentError, Conflict, ValidationFailed} from '../utils/errors';

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    const status = getCodeForException(err);
    res.status(status)
    .type('json')
    .send(JSON.stringify({error: err.toString()}));
}

export function getCodeForException(err: Error) {
  if (err instanceof ValidationFailed) {
    return 400;
  } else if (err instanceof PaymentError) {
    return 402;
  } else if (err instanceof NotFound) {
    return 404;
  } else if (err instanceof Conflict) {
    return 409;
  } else {
    return 500;
  }
}

