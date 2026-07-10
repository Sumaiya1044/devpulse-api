import { IIssue, IIssueUpdate } from './issue.interface';

export const validateCreateIssue = (data: Partial<IIssue>): string | null => {
  if (!data.title || data.title.trim() === '') {
    return 'Title is required';
  }
  if (data.title.length > 150) {
    return 'Title must be at most 150 characters';
  }
  if (!data.description || data.description.trim() === '') {
    return 'Description is required';
  }
  if (data.description.length < 20) {
    return 'Description must be at least 20 characters';
  }
  if (!data.type) {
    return 'Type is required';
  }
  if (!['bug', 'feature_request'].includes(data.type)) {
    return 'Type must be bug or feature_request';
  }
  return null;
};

export const validateUpdateIssue = (data: Partial<IIssueUpdate>): string | null => {
  if (data.title !== undefined && data.title.trim() === '') {
    return 'Title cannot be empty';
  }
  if (data.title !== undefined && data.title.length > 150) {
    return 'Title must be at most 150 characters';
  }
  if (data.description !== undefined && data.description.trim() === '') {
    return 'Description cannot be empty';
  }
  if (data.description !== undefined && data.description.length < 20) {
    return 'Description must be at least 20 characters';
  }
  if (data.type !== undefined && !['bug', 'feature_request'].includes(data.type)) {
    return 'Type must be bug or feature_request';
  }
  if (data.status !== undefined && !['open', 'in_progress', 'resolved'].includes(data.status)) {
    return 'Status must be open, in_progress or resolved';
  }
  return null;
};