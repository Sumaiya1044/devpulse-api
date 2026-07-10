import express, { Application } from 'express';
import cors from 'cors';
import router from './app/routes/index';
import errorHandler from './app/middleware/errorHandler';
import notFound from './app/middleware/notFound';

const app: Application = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api', router);

// not found
app.use(notFound);

// error handler
app.use(errorHandler);

export default app;