
# Job Application Processing Pipeline

A scalable automation workflow for handling job applications, CV processing, and candidate communication.

## Features

- Modern web form for job applications
- CV document upload and storage
- Automated CV parsing and data extraction
- Integration with Google Sheets for data storage
- Automated email notifications
- Webhook integration for processing status updates

## Tech Stack

- Frontend: React with Material-UI
- Backend: Node.js/Express
- Storage: AWS S3
- Email: SendGrid
- Data Storage: Google Sheets API
- Hosting: Vercel (Frontend) & AWS Lambda (Backend)

## Project Structure

```
job-application-pipeline/
├── frontend/           # React frontend application
├── backend/           # Node.js/Express backend
├── docs/             # Documentation
└── scripts/          # Utility scripts
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd backend
   npm install
   ```
3. Set up environment variables (see .env.example files)
4. Run the development servers:
   ```bash
   # Frontend
   cd frontend
   npm start

   # Backend
   cd backend
   npm run dev
   ```

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001
```