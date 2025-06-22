import express from 'express';
import { getAllUserEmotion} from '../controller/emotion.js';

const router = express.Router();

// router.post('/add-emotion', addEmotion);
router.get('/get-all-user-emotion', getAllUserEmotion)

export default router;
