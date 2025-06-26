import express from 'express';
import { verifyPayment } from '../controller/payment.js';

const router = express.Router();

router.post('/verify-payment', verifyPayment);


export default router;