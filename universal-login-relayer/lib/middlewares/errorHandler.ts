import {Request, Response, NextFunction} from 'express';
import {NotFound, PaymentError, Conflict, ValidationFailed, RelayerError} from '../utils/errors';

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    const status = getCodeForException(err);
    const content = getContentForException(err);
    res.status(status)
      .type('json')
      .send(content);
}

function getContentForException(err: Error) {
  if (err instanceof RelayerError) {
    const relayerError = <RelayerError>err;
    return {
      error: err.toString(),
      type: relayerError.errorType
    };
  } else {
    return {
      error: err.toString()
    };
  }
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

