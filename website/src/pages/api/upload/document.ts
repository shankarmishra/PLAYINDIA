import type { NextApiRequest, NextApiResponse } from 'next';
import { API_CONFIG } from '@/config/api';
import fs from 'fs';
import FormData from 'form-data';
import { IncomingForm, Fields, Files } from 'formidable';

// Disable default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = new IncomingForm();
  
  // Wrap form.parse in a Promise to properly handle async/await with timeout
  const parseForm = (): Promise<{fields: Fields, files: Files}> => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Form parsing timed out'));
      }, 10000); // 10 second timeout
      
      form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
        clearTimeout(timeout);
        if (err) {
          console.error('Form parse error:', err);
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });
  };

  try {
    const { fields, files } = await parseForm();

    // Get the uploaded file
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read the file
    let fileBuffer;
    try {
      fileBuffer = fs.readFileSync(file.filepath);
    } catch (error) {
      console.error('Error reading uploaded file:', error);
      return res.status(400).json({
        message: 'Error reading uploaded file',
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Prepare form data to send to backend
    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: file.originalFilename || 'unnamed-file',
      contentType: file.mimetype || 'application/octet-stream'
    });

    // Forward the file to the backend API
    // Use document verification endpoint - the backend has specific routes like /api/verification/aadhaar, /api/verification/pan, etc.
    const docTypeArray = fields.documentType;
    const docType = Array.isArray(docTypeArray) ? docTypeArray[0] : docTypeArray || 'general';
    const response = await fetch(API_CONFIG.BASE_URL + '/api/verification/' + docType, {
      method: 'POST',
      body: formData as any, // Type assertion to bypass strict typing
      headers: {
        ...formData.getHeaders() // This adds Content-Type header with boundary
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Upload API error:', error);
    return res.status(error.httpStatusCode || 500).json({ 
      message: error.message || 'Error processing request'
    });
  }
}