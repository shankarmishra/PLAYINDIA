import type { NextApiRequest, NextApiResponse } from 'next';
import { API_CONFIG } from '@/config/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Normalize email, name, and mobile from request body
    let normalizedMobile = req.body.mobile;
    if (normalizedMobile && typeof normalizedMobile === 'string') {
      // Remove all non-digit characters
      normalizedMobile = normalizedMobile.replace(/\D/g, '');
      // If it starts with 91 and has 12 digits, remove the 91 prefix
      if (normalizedMobile.length === 12 && normalizedMobile.startsWith('91')) {
        normalizedMobile = normalizedMobile.substring(2);
      }
      // If it starts with 0 and has 11 digits, remove the 0
      if (normalizedMobile.length === 11 && normalizedMobile.startsWith('0')) {
        normalizedMobile = normalizedMobile.substring(1);
      }
      // Ensure it's exactly 10 digits
      if (normalizedMobile.length !== 10) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid 10-digit mobile number'
        });
      }
    }
    
    const normalizedBody = {
      ...req.body,
      email: req.body.email ? String(req.body.email).toLowerCase().trim() : req.body.email,
      name: req.body.name ? String(req.body.name).trim() : req.body.name,
      mobile: normalizedMobile,
    };
    
    const response = await fetch(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(normalizedBody),
    });

    // Handle response parsing safely
    let data;
    const contentType = response.headers.get('content-type');
    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { success: false, message: text || 'Request failed', error: text };
      }
    } catch (parseError: any) {
      const text = await response.text().catch(() => 'Unknown error');
      data = { 
        success: false, 
        message: text || 'Failed to parse response', 
        error: parseError.message 
      };
    }

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Registration API error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Internal server error' 
    });
  }
}