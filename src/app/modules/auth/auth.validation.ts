import { IUser, IUserLogin } from './auth.interface';

export const validateSignup = (data: Partial<IUser>): string | null => {
  if (!data.name || data.name.trim() === '') {
    return 'Name is required';
  }
  if (!data.email || data.email.trim() === '') {
    return 'Email is required';
  }
  if (!data.password || data.password.trim() === '') {
    return 'Password is required';
  }
  if (data.role && !['contributor', 'maintainer'].includes(data.role)) {
    return 'Role must be contributor or maintainer';
  }
  return null;
};

export const validateLogin = (data: Partial<IUserLogin>): string | null => {
  if (!data.email || data.email.trim() === '') {
    return 'Email is required';
  }
  if (!data.password || data.password.trim() === '') {
    return 'Password is required';
  }
  return null;
};