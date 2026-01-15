import type { NextApiRequest, NextApiResponse } from 'next';
import { API_CONFIG } from '@/config/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Normalize email and name from request body
    const normalizedBody = {
      ...req.body,
      email: req.body.email ? String(req.body.email).toLowerCase().trim() : req.body.email,
      name: req.body.name ? String(req.body.name).trim() : req.body.name,
      role: 'delivery' // Set the role to delivery
    };
    
    // For delivery registration, we need to call the auth register endpoint with role
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
      data = { success: false, message: text || 'Failed to parse response', error: parseError.message };
    }

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Delivery registration API error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Internal server error' 
    });
  }
}