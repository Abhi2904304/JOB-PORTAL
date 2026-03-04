import express from 'express';
import upload from '../config/multer.js';
import { getUserData, applyForJob, getUserJobApplications, updateUserResume } from '../controllers/userController.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user data
router.get('/user', protectUser, getUserData);

//Apply for a job
router.post('/apply', protectUser, applyForJob);

// Get  applied jobs data
router.get('/applications', protectUser, getUserJobApplications); 

// update user profile (resume)
router.post('/update-resume', protectUser, upload.single('resume'), updateUserResume);

export default router;