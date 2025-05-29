import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { AppError } from '../middleware/error.middleware';

export class CVParserService {
  static async parseCV(file: Express.Multer.File): Promise<string> {
    try {
      if (file.mimetype === 'application/pdf') {
        const data = await pdfParse(file.buffer);
        return data.text;
      } else if (
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        return result.value;
      } else {
        throw new AppError(400, 'Unsupported file type');
      }
    } catch (error) {
      throw new AppError(500, 'Error parsing CV file');
    }
  }
} 