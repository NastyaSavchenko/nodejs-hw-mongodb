import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export function isValidId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return next(createHttpError.BadRequest('Invalid ID format'));
  }
  next();
}
