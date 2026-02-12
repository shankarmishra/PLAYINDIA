import type { NextApiRequest, NextApiResponse } from 'next';
import { API_CONFIG } from '@/config/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Validate request body
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is required'
      });
    }

    // Normalize email (lowercase and trim) before sending to backend
    const normalizedBody = {
      ...req.body,
      email: req.body.email ? req.body.email.trim().toLowerCase() : req.body.email,
    };

    // Validate that we have either email or mobile
    if (!normalizedBody.email && !normalizedBody.mobile) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either email or mobile number'
      });
    }

    // Validate that we have password
    if (!normalizedBody.password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    const loginUrl = API_CONFIG.ENDPOINTS.AUTH.LOGIN;
    
    // Log the request for debugging
    console.log('Login API - Request URL:', loginUrl);
    console.log('Login API - Request body:', { 
      email: normalizedBody.email || null,
      mobile: normalizedBody.mobile || null,
      hasPassword: !!normalizedBody.password 
    });
    
    let response;
    try {
      response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(normalizedBody),
      });
      
      // Log response status for debugging
      console.log('Login API - Response status:', response.status);
    } catch (fetchError) {
      // Network error - backend server is not reachable
      console.error('Login API network error:', fetchError);
      return res.status(503).json({ 
        success: false,
        message: `Cannot connect to backend server. Please check if the server is running at ${API_CONFIG.BASE_URL}` 
      });
    }

    // Try to parse JSON response
    let data;
    try {
      const text = await response.text();
      if (!text) {
        console.error('Login API - Empty response from server');
        return res.status(500).json({ 
          success: false,
          message: 'Empty response from server' 
        });
      }
      data = JSON.parse(text);
      console.log('Login API - Response data:', { ...data, token: data.token ? '***' : undefined });
    } catch (parseError) {
      console.error('Login API parse error:', parseError);
      return res.status(500).json({ 
        success: false,
        message: 'Invalid response from server' 
      });
    }

    if (!response.ok) {
      console.error('Login API - Error response:', response.status, data);
      // Forward the error response from backend
      const statusCode = response.status || 500;
      return res.status(statusCode).json({
        success: false,
        message: data.message || data.error || 'Login failed',
        ...data
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Login API error:', error);
    res.status(500).json({ 
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}