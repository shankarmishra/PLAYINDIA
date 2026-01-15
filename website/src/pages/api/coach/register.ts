import type { NextApiRequest, NextApiResponse } from 'next';
import { API_CONFIG } from '../../../config/api';
import fs from 'fs';
import { Readable } from 'stream';
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

    // Debug: Log received fields
    console.log('Received fields:', Object.keys(fields));
    
    // Extract basic user registration fields
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;
    const mobile = Array.isArray(fields.mobile) ? fields.mobile[0] : fields.mobile;
    
    // Validate required fields are present
    console.log('Field values:', { name: name, email: email, password: password, mobile: mobile });
    
    if (!name || !email || !password || !mobile) {
      console.log('Missing required fields:', { name, email, password, mobile });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, password, mobile',
        details: { name: !!name, email: !!email, password: !!password, mobile: !!mobile }
      });
    }
    
    // Normalize mobile number - remove all non-digits and country code, keep only 10 digits
    let formattedMobile = mobile as string;
    if (typeof formattedMobile === 'string') {
      // Remove all non-digit characters
      formattedMobile = formattedMobile.replace(/\D/g, '');
      // If it starts with 91 and has 12 digits, remove the 91 prefix
      if (formattedMobile.length === 12 && formattedMobile.startsWith('91')) {
        formattedMobile = formattedMobile.substring(2);
      }
      // If it starts with 0 and has 11 digits, remove the 0
      if (formattedMobile.length === 11 && formattedMobile.startsWith('0')) {
        formattedMobile = formattedMobile.substring(1);
      }
      // Ensure it's exactly 10 digits
      if (formattedMobile.length !== 10) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid 10-digit mobile number'
        });
      }
    }
    
    // Create JSON data for user registration (backend expects JSON, not FormData)
    const userRegistrationData = {
      name: name as string,
      email: email as string,
      password: password as string,
      mobile: formattedMobile,
      role: 'coach'
    };
    
    console.log('Submitting user registration with data:', userRegistrationData);
        
    // Register user first
    console.log('Making request to backend:', API_CONFIG.ENDPOINTS.AUTH.REGISTER);
        
    let userResponse;
    try {
      userResponse = await fetch(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userRegistrationData)
      });
    } catch (error: any) {
      console.error('Network error when contacting backend:', error);
      return res.status(500).json({
        success: false,
        message: 'Network error: Could not reach backend server',
        error: error.message
      });
    }
        
    if (!userResponse.ok) {
      // Handle non-JSON responses (like 429 rate limit errors)
      // Always read as text first, then try to parse as JSON
      // This prevents "body already consumed" errors
      let errorData;
      try {
        const text = await userResponse.text();
        // Try to parse as JSON
        try {
          errorData = JSON.parse(text);
        } catch {
          // If not JSON, use text as message
          errorData = { message: text || 'Request failed', error: text };
        }
      } catch (parseError: any) {
        // If reading text fails, create a generic error
        console.error('Error reading error response:', parseError);
        errorData = { 
          message: `Request failed with status ${userResponse.status}`, 
          error: parseError.message || 'Unknown error' 
        };
      }
      
      console.error('Backend registration failed:', errorData);
      return res.status(userResponse.status).json({
        success: false,
        message: errorData.message || 'User registration failed',
        error: errorData.error || errorData
      });
    }
        
    // Parse successful response
    // Always read as text first, then try to parse as JSON
    let userData;
    try {
      const text = await userResponse.text();
      // Try to parse as JSON
      try {
        userData = JSON.parse(text);
      } catch {
        // If not JSON, throw error
        throw new Error(`Invalid response format: ${text}`);
      }
    } catch (parseError: any) {
      console.error('Error parsing user registration response:', parseError);
      return res.status(500).json({
        success: false,
        message: 'Failed to parse registration response',
        error: parseError.message
      });
    }
    console.log('User registration successful:', userData);
    
    // Extract token from response (could be userData.token or userData.data.token)
    const token = userData.token || userData.data?.token;
    
    if (!token) {
      console.error('No token found in user registration response:', userData);
      // Still return success since user was created, but note the issue
      return res.status(200).json({
        ...userData,
        warning: 'User registered but coach profile update may fail - no token available'
      });
    }
        
    // If user registration was successful, update coach profile with additional data
    // Create form data for coach profile update
    const coachProfileFormData = new FormData();
        
    // Add remaining fields (coach-specific fields) to coach profile form data
    Object.keys(fields).forEach(key => {
      // Don't add basic user fields again
      if (key !== 'name' && key !== 'email' && key !== 'password' && key !== 'mobile' && key !== 'role') {
        const value = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
        if (value !== undefined && value !== null && value !== '') {
          coachProfileFormData.append(key, value as string);
        }
      }
    });
        
    // Add files to the coach profile form data
    console.log('Files to upload:', Object.keys(files));
    for (const key of Object.keys(files)) {
      const file = Array.isArray(files[key]) ? files[key][0] : files[key];
      if (file && typeof file !== 'string') {
        try {
          const fileBuffer = fs.readFileSync(file.filepath);
          const filename = file.originalFilename || 'file';
          console.log(`Uploading file ${key}: ${filename} (${fileBuffer.length} bytes)`);
          coachProfileFormData.append(key, fileBuffer, {
            filename,
            contentType: file.mimetype || 'application/octet-stream'
          });
        } catch (error) {
          console.error(`Error reading file ${key}:`, error);
          // Don't fail the whole registration if one file fails
          console.warn(`Skipping file ${key} due to error, continuing with other files`);
        }
      }
    }
        
    // Update coach profile
    const coachResponse = await fetch(API_CONFIG.ENDPOINTS.COACHES.BASE, {
      method: 'POST',
      body: coachProfileFormData as any,
      headers: {
        ...coachProfileFormData.getHeaders(),
        'Authorization': `Bearer ${token}` // Use the token from user registration
      }
    });
        
    // Parse coach profile response safely
    // Always read as text first, then try to parse as JSON
    let coachData;
    try {
      const text = await coachResponse.text();
      // Try to parse as JSON
      try {
        coachData = JSON.parse(text);
      } catch {
        // If not JSON, create error object
        coachData = { success: false, message: `Invalid response format: ${text}` };
      }
    } catch (parseError: any) {
      console.error('Error parsing coach profile response:', parseError);
      // Don't fail the whole registration if coach profile update fails
      coachData = { success: false, message: 'Coach profile update failed but user was registered' };
    }
        
    if (!coachResponse.ok) {
      // If coach profile update fails, return the user registration data but note the issue
      console.warn('Coach profile update failed:', coachData);
      // Still return success since the user was created
      return res.status(200).json(userData);
    }
        
    // Combine user and coach data for response
    const combinedData = {
      ...userData,
      coachProfile: coachData.data
    };

    res.status(200).json(combinedData);
  } catch (error: any) {
    console.error('Coach registration API error:', error);
    return res.status(error.httpStatusCode || 400).json({ 
      success: false,
      message: error.message || 'Error processing request',
      error: error.message
    });
  }
}