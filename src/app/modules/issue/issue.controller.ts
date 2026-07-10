import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { validateCreateIssue, validateUpdateIssue } from './issue.validation';
import {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
} from './issue.service';

export const create = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const error = validateCreateIssue(req.body);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error,
    });
    return;
  }

  const issue = await createIssue(req.body, req.user!.id);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Issue created successfully',
    data: issue,
  });
});

export const getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { sort, type, status } = req.query as {
    sort?: string;
    type?: string;
    status?: string;
  };

  const issues = await getAllIssues({ sort, type, status });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Issues retrived successfully',
    data: issues,
  });
});

export const getSingle = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid issue id',
    });
    return;
  }

  const issue = await getSingleIssue(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Issue retrived successfully',
    data: issue,
  });
});

export const update = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid issue id',
    });
    return;
  }

  const error = validateUpdateIssue(req.body);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error,
    });
    return;
  }

  const issue = await updateIssue(id, req.body, req.user!.id, req.user!.role);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Issue updated successfully',
    data: issue,
  });
});

export const remove = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid issue id',
    });
    return;
  }

  await deleteIssue(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Issue deleted successfully',
  });
});