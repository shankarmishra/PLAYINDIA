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
    
    // Convert to strings and trim
    const nameStr = name ? String(name).trim() : '';
    const emailStr = email ? String(email).trim() : '';
    const passwordStr = password ? String(password) : '';
    const mobileStr = mobile ? String(mobile).trim() : '';
    
    // Normalize email
    const normalizedEmail = emailStr ? emailStr.toLowerCase() : '';
    
    // Validate required fields - check each one individually with specific error messages
    if (!nameStr || nameStr.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }
    
    if (!emailStr || emailStr.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    if (!passwordStr || passwordStr.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }
    
    if (!mobileStr || mobileStr.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }
    
    // Validate name length
    if (nameStr.length < 2 || nameStr.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 2 and 50 characters'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email'
      });
    }
    
    // Validate password length
    if (passwordStr.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }
    
    // Validate password complexity
    const hasUpperCase = /[A-Z]/.test(passwordStr);
    const hasLowerCase = /[a-z]/.test(passwordStr);
    const hasNumber = /\d/.test(passwordStr);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordStr);
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      });
    }
    
    // Normalize mobile number
    let formattedMobile = mobileStr.replace(/\D/g, '');
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
    
    // Create JSON payload for user registration (backend expects JSON, not FormData)
    const userRegistrationData: any = {
      name: nameStr,
      email: normalizedEmail,
      password: passwordStr,
      mobile: formattedMobile,
      role: 'seller'
    };
    
    // Add other store fields to registration data
    if (fields.storeName) {
      userRegistrationData.storeName = Array.isArray(fields.storeName) ? fields.storeName[0] : fields.storeName;
    }
    if (fields.ownerName) {
      userRegistrationData.ownerName = Array.isArray(fields.ownerName) ? fields.ownerName[0] : fields.ownerName;
    }
    if (fields.address) {
      userRegistrationData.address = Array.isArray(fields.address) ? fields.address[0] : fields.address;
    }
    if (fields.city) {
      userRegistrationData.city = Array.isArray(fields.city) ? fields.city[0] : fields.city;
    }
    if (fields.state) {
      userRegistrationData.state = Array.isArray(fields.state) ? fields.state[0] : fields.state;
    }
    if (fields.pincode) {
      userRegistrationData.pincode = Array.isArray(fields.pincode) ? fields.pincode[0] : fields.pincode;
    }
    if (fields.gstNumber) {
      userRegistrationData.gstNumber = Array.isArray(fields.gstNumber) ? fields.gstNumber[0] : fields.gstNumber;
    }
    if (fields.businessType) {
      userRegistrationData.businessType = Array.isArray(fields.businessType) ? fields.businessType[0] : fields.businessType;
    }
    // Handle category - backend expects a single enum value, not an array
    // Map frontend categories to backend enum values
    if (fields.category) {
      let categoryArray: string[] = [];
      try {
        // Try to parse if it's a JSON string
        const categoryValue = Array.isArray(fields.category) ? fields.category[0] : fields.category;
        if (typeof categoryValue === 'string') {
          try {
            categoryArray = JSON.parse(categoryValue);
          } catch {
            // If not JSON, treat as single value
            categoryArray = [categoryValue];
          }
        } else if (Array.isArray(categoryValue)) {
          categoryArray = categoryValue;
        }
      } catch (e) {
        console.error('Error parsing category:', e);
      }
      
      // Map frontend category names to backend enum values
      const categoryMap: { [key: string]: string } = {
        'Tennis': 'tennis',
        'Football': 'football',
        'Cricket': 'cricket',
        'Badminton': 'badminton',
        'Basketball': 'multi-sports',
        'Cycling': 'multi-sports',
        'Running': 'multi-sports',
        'Gym Equipment': 'gym',
        'Sports Accessories': 'accessories',
        'Sports Wear': 'sports-wear',
        'Multi-Sports': 'multi-sports'
      };
      
      // Convert frontend categories to backend enum values
      const mappedCategories = categoryArray
        .map((cat: string) => categoryMap[cat] || cat.toLowerCase())
        .filter((cat: string) => ['cricket', 'football', 'badminton', 'tennis', 'gym', 'multi-sports', 'sports-wear', 'accessories'].includes(cat));
      
      // If multiple categories, use 'multi-sports', otherwise use the first valid one
      if (mappedCategories.length > 1) {
        userRegistrationData.category = 'multi-sports';
      } else if (mappedCategories.length === 1) {
        userRegistrationData.category = mappedCategories[0];
      } else {
        // Default to 'multi-sports' if no valid category found
        userRegistrationData.category = 'multi-sports';
      }
    } else {
      // Default category if none provided
      userRegistrationData.category = 'multi-sports';
    }
        
    // Register user first (backend expects JSON)
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
        
    // Add store-specific fields (excluding registration fields)
    Object.keys(fields).forEach(key => {
      if (key !== 'name' && key !== 'email' && key !== 'password' && key !== 'mobile' && key !== 'role') {
        let value = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
        
        // Special handling for category - ensure it's a single enum value
        if (key === 'category') {
          // Use the already processed category from userRegistrationData
          value = userRegistrationData.category || 'multi-sports';
        }
        
        if (value !== undefined && value !== null && value !== '') {
          storeProfileFormData.append(key, String(value));
        }
      }
    });
    
    // Ensure category is set in store profile (always append, FormData allows duplicates)
    storeProfileFormData.append('category', userRegistrationData.category || 'multi-sports');
        
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
      const storeProfileUrl = API_CONFIG.ENDPOINTS.STORES?.PROFILE || `${API_CONFIG.ENDPOINTS.STORES?.BASE || `${API_CONFIG.BASE_URL}/api/stores`}/profile`;
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
        console.log('Store profile updated successfully:', {
          success: storeData.success,
          hasData: !!storeData.data,
          storeDocuments: storeData.data?.documents,
          fullResponse: storeData
        });
      } else {
        const errorText = await storeResponse.text().catch(() => 'Unknown error');
        console.error('Store profile update failed:', {
          status: storeResponse.status,
          statusText: storeResponse.statusText,
          error: errorText
        });
        console.warn('Store profile update failed, but user was registered. Error:', errorText);
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
