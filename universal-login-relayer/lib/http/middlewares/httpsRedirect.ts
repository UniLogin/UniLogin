import {NextFunction, Request, Response} from 'express';

export function httpsRedirect(req: Request, res: Response, next: NextFunction) {
  if (req.protocol !== 'https') {
    res.redirect(302, `https://${req.hostname}${req.originalUrl}`);
  } else {
    next();
  }
}
