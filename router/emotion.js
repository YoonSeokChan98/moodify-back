import express from 'express';
import { addEmotion ,writeEmotionDiary} from '../controller/emotion.js';

const router = express.Router();

router.post('/add-emotion', addEmotion);
router.post('/write-emotion-diary', writeEmotionDiary)

export default router;
