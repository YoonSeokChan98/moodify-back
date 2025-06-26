import express from 'express';
import { addMembership, removeMembership } from '../controller/membership.js';

const router = express.Router();

router.post('/add-membership', addMembership);
router.delete('/remove-membership', removeMembership
);


export default router;