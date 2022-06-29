import { Router } from 'express';
import { getProducts } from '../handlers/routers/user_views.js';

const router = Router();

router.get('/prods', getProducts);

export default router;
