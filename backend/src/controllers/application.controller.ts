import { Request, Response, NextFunction } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { AppError } from '../middleware/error.middleware';
import { CVParserService } from '../services/cv-parser.service';
import { EmailService } from '../services/email.service';
import axios from 'axios';

const isTestMode = process.env.NODE_ENV === 'development' && !process.env.AWS_ACCESS_KEY_ID;

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const uploadApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      throw new AppError(400, 'No file uploaded');
    }

    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      throw new AppError(400, 'Missing required fields');
    }

    // Parse CV content
    const cvContent = await CVParserService.parseCV(req.file);

    if (isTestMode) {
      console.log('Test mode: Skipping external service calls');
      console.log('Application data:', {
        name,
        email,
        phone,
        cvContent: cvContent.substring(0, 100) + '...', // Log first 100 chars
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype
      });

      return res.status(201).json({
        status: 'success',
        message: 'Application submitted successfully (Test Mode)',
        data: {
          name,
          email,
          phone,
          fileName: req.file.originalname
        }
      });
    }

    // Upload file to S3
    const fileKey = `applications/${Date.now()}-${req.file.originalname}`;
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileKey,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        })
      );
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new AppError(500, 'Error uploading file to storage');
    }

    // Send data to webhook
    try {
      await axios.post(process.env.WEBHOOK_URL || '', {
        name,
        email,
        phone,
        cvUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
        cvContent,
      });
    } catch (error) {
      console.error('Webhook error:', error);
      throw new AppError(500, 'Error sending data to webhook');
    }

    // Send confirmation email
    try {
      await EmailService.sendConfirmationEmail(email, name);
    } catch (error) {
      console.error('Email error:', error);
      // Don't throw error here, just log it
    }

    res.status(201).json({
      status: 'success',
      message: 'Application submitted successfully',
    });
  } catch (error) {
    console.error('Application submission error:', error);
    next(error);
  }
}; 