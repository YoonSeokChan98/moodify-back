import express from 'express';
import { signup, login, getOneUserInfo, updateUserInfo, removeUser, updateUserPassword, resetUserPassword } from '../controller/user.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/get-one-user-info', getOneUserInfo);
router.patch('/update-user-info', updateUserInfo);
router.patch('/remove-user', removeUser);
router.patch('/update-user-password', updateUserPassword);
router.patch('/reset-user-password', resetUserPassword);

export default router;
