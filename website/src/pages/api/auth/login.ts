import type { NextApiRequest, NextApiResponse } from 'next';
import { API_CONFIG } from '@/config/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Normalize email (lowercase and trim) before sending to backend
    const normalizedBody = {
      ...req.body,
      email: req.body.email ? req.body.email.trim().toLowerCase() : req.body.email,
    };

    const loginUrl = API_CONFIG.ENDPOINTS.AUTH.LOGIN;
    
    let response;
    try {
      response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(normalizedBody),
      });
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
        return res.status(500).json({ 
          success: false,
          message: 'Empty response from server' 
        });
      }
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Login API parse error:', parseError);
      return res.status(500).json({ 
        success: false,
        message: 'Invalid response from server' 
      });
    }

    if (!response.ok) {
      return res.status(response.status).json(data);
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