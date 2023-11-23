import express from 'express';
import programEnrollmentController from '../controllers/programEnrollmentController';

const router = express.Router();

router.get('/user/:userId', programEnrollmentController.getProgramDetailsByUserId);
router.put('/user/startDate', programEnrollmentController.setProgramStartDate);

export default router;
