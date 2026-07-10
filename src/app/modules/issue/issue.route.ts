import { Router } from 'express';
import verifyToken from '../../middleware/auth';
import verifyRole from '../../middleware/role';
import { create, getAll, getSingle, update, remove } from './issue.controller';

const router = Router();

router.post('/', verifyToken, create);
router.get('/', getAll);
router.get('/:id', getSingle);
router.patch('/:id', verifyToken, update);
router.delete('/:id', verifyToken, verifyRole('maintainer'), remove);

export default router;