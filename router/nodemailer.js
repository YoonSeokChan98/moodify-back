import express from 'express';
import { sendAuthNumberEmail,sendAuthNumberPasswordReset } from '../controller/nodemailer.js';

const router = express.Router();

router.post('/send-auth-number-email', sendAuthNumberEmail);
router.post('/send-auth-number-password-reset', sendAuthNumberPasswordReset);

export default router;
