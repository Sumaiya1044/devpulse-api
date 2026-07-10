import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../config/db';
import { env } from '../../config/env';
import { IUser, IJwtPayload } from './auth.interface';
import AppError from '../../utils/AppError';

export const registerUser = async (data: IUser): Promise<Omit<IUser, 'password'>> => {
  const { name, email, password, role } = data;

  // check if email already exists
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new AppError('Email already registered', 400);
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // insert user
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, role || 'contributor']
  );

  return result.rows[0];
};

export const loginUser = async (email: string, password: string): Promise<{ token: string; user: Omit<IUser, 'password'> }> => {
  // check if user exists
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    throw new AppError('Invalid email or password', 401);
  }

  const user = result.rows[0];

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // create jwt
  const payload: IJwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });

  const { password: _, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
};