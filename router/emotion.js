import express from 'express';
import { addEmotion } from '../controller/emotion.js';

const router = express.Router();

router.post('/add-emotion', addEmotion);

export default router;
