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

    // Extract basic user registration fields
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    let email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;
    const mobile = Array.isArray(fields.mobile) ? fields.mobile[0] : fields.mobile;
    
    // Normalize email
    if (email && typeof email === 'string') {
      email = email.toLowerCase().trim();
    }
    
    // Validate required fields
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, password, mobile'
      });
    }
    
    // Normalize mobile number
    let formattedMobile = mobile as string;
    if (typeof formattedMobile === 'string') {
      formattedMobile = formattedMobile.replace(/\D/g, '');
      if (formattedMobile.length === 12 && formattedMobile.startsWith('91')) {
        formattedMobile = formattedMobile.substring(2);
      }
      if (formattedMobile.length === 11 && formattedMobile.startsWith('0')) {
        formattedMobile = formattedMobile.substring(1);
      }
      if (formattedMobile.length !== 10) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid 10-digit mobile number'
        });
      }
    }
    
    // Create form data for user registration
    const userRegistrationFormData = new FormData();
    userRegistrationFormData.append('name', name as string);
    userRegistrationFormData.append('email', email as string);
    userRegistrationFormData.append('password', password as string);
    userRegistrationFormData.append('mobile', formattedMobile);
    userRegistrationFormData.append('role', 'seller');
    
    // Add other store fields
    if (fields.storeName) {
      userRegistrationFormData.append('storeName', Array.isArray(fields.storeName) ? fields.storeName[0] : fields.storeName);
    }
    if (fields.ownerName) {
      userRegistrationFormData.append('ownerName', Array.isArray(fields.ownerName) ? fields.ownerName[0] : fields.ownerName);
    }
    if (fields.address) {
      userRegistrationFormData.append('address', Array.isArray(fields.address) ? fields.address[0] : fields.address);
    }
    if (fields.city) {
      userRegistrationFormData.append('city', Array.isArray(fields.city) ? fields.city[0] : fields.city);
    }
    if (fields.state) {
      userRegistrationFormData.append('state', Array.isArray(fields.state) ? fields.state[0] : fields.state);
    }
    if (fields.pincode) {
      userRegistrationFormData.append('pincode', Array.isArray(fields.pincode) ? fields.pincode[0] : fields.pincode);
    }
    if (fields.gstNumber) {
      userRegistrationFormData.append('gstNumber', Array.isArray(fields.gstNumber) ? fields.gstNumber[0] : fields.gstNumber);
    }
    if (fields.businessType) {
      userRegistrationFormData.append('businessType', Array.isArray(fields.businessType) ? fields.businessType[0] : fields.businessType);
    }
    if (fields.category) {
      const category = Array.isArray(fields.category) ? fields.category : [fields.category];
      userRegistrationFormData.append('category', JSON.stringify(category));
    }
        
    // Register user first
    let userResponse;
    try {
      userResponse = await fetch(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: userRegistrationFormData as any,
        headers: {
          ...userRegistrationFormData.getHeaders()
        }
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
      let errorData;
      try {
        const text = await userResponse.text();
        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = { message: text || 'Request failed', error: text };
        }
      } catch (parseError: any) {
        errorData = { 
          message: `Request failed with status ${userResponse.status}`, 
          error: parseError.message || 'Unknown error' 
        };
      }
      
      return res.status(userResponse.status).json({
        success: false,
        message: errorData.message || 'User registration failed',
        error: errorData.error || errorData
      });
    }
        
    // Parse successful response
    let userData;
    try {
      const text = await userResponse.text();
      try {
        userData = JSON.parse(text);
      } catch {
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
    
    // Extract token from response
    const token = userData.token || userData.data?.token;
    
    if (!token) {
      console.error('No token found in user registration response:', userData);
      return res.status(200).json({
        ...userData,
        warning: 'User registered but store profile update may fail - no token available'
      });
    }
        
    // If user registration was successful, update store profile with documents
    const storeProfileFormData = new FormData();
        
    // Add store-specific fields
    Object.keys(fields).forEach(key => {
      if (key !== 'name' && key !== 'email' && key !== 'password' && key !== 'mobile' && key !== 'role') {
        const value = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
        if (value !== undefined && value !== null && value !== '') {
          storeProfileFormData.append(key, value as string);
        }
      }
    });
        
    // Add files to the store profile form data
    console.log('Files to upload:', Object.keys(files));
    for (const key of Object.keys(files)) {
      const file = Array.isArray(files[key]) ? files[key][0] : files[key];
      if (file && typeof file !== 'string') {
        try {
          const fileBuffer = fs.readFileSync(file.filepath);
          const filename = file.originalFilename || 'file';
          console.log(`Uploading file ${key}: ${filename} (${fileBuffer.length} bytes)`);
          storeProfileFormData.append(key, fileBuffer, {
            filename,
            contentType: file.mimetype || 'application/octet-stream'
          });
        } catch (error) {
          console.error(`Error reading file ${key}:`, error);
          console.warn(`Skipping file ${key} due to error, continuing with other files`);
        }
      }
    }
        
    // Update store profile with documents
    try {
      const storeProfileUrl = API_CONFIG.ENDPOINTS.STORES?.PROFILE || `${API_CONFIG.ENDPOINTS.STORES?.BASE || 'http://localhost:5000/api/stores'}/profile`;
      const storeResponse = await fetch(storeProfileUrl, {
        method: 'PUT',
        body: storeProfileFormData as any,
        headers: {
          ...storeProfileFormData.getHeaders(),
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (storeResponse.ok) {
        const storeData = await storeResponse.json().catch(() => ({}));
        console.log('Store profile updated successfully:', storeData);
      } else {
        console.warn('Store profile update failed, but user was registered');
      }
    } catch (err) {
      console.error('Error updating store profile:', err);
      // Don't fail the whole registration if store profile update fails
    }
        
    // Combine user and store data for response
    res.status(200).json(userData);
  } catch (error: any) {
    console.error('Store registration API error:', error);
    return res.status(error.httpStatusCode || 400).json({ 
      success: false,
      message: error.message || 'Error processing request',
      error: error.message
    });
  }
}
