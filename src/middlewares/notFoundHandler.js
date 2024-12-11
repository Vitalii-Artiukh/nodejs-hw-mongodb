import { HttpError } from 'http-errors';

export const notFoundHandler = (error, req, res, next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({
      status: error.status,
      data: error,
    });
    return;
  }

  res.status(404).json({
    status: 404,
    message: 'Route not found',
    data: error.message,
  });
  // res.status(404).json({
  //   message: 'Not found',
  // });
};
