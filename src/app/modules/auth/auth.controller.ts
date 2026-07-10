import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { validateSignup, validateLogin } from './auth.validation';
import { registerUser, loginUser } from './auth.service';

export const signup = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const error = validateSignup(req.body);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error,
    });
    return;
  }

  const user = await registerUser(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'User registered successfully',
    data: user,
  });
});

export const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const error = validateLogin(req.body);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error,
    });
    return;
  }

  const result = await loginUser(req.body.email, req.body.password);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Login successful',
    data: result,
  });
});