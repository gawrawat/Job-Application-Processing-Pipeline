import { Router } from 'express';
import multer from 'multer';
import { uploadApplication } from '../controllers/application.controller';

const router = Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  },
});

// Routes
router.post('/', upload.single('cv'), uploadApplication);

export const applicationRoutes = router; 