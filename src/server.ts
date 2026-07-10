import app from './app';
import { env } from './app/config/env';
import pool from './app/config/db';

const startServer = async (): Promise<void> => {
  try {
    // test database connection
    await pool.query('SELECT 1');
    console.log('Database connected successfully');

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

startServer();