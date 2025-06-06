import express from 'express';
import { generateMusic } from '../controller/music.js';

const router = express.Router();

router.post('/generate-music', generateMusic);

export default router;
