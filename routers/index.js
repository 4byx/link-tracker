import v1Router from './v1/index.js';  
import {Router} from 'express';

const router = Router();
router.use('/v1', v1Router);

export default router;