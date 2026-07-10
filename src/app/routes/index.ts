import { Router } from 'express';
import authRouter from '../modules/auth/auth.route';
import issueRouter from '../modules/issue/issue.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/issues', issueRouter);

export default router;