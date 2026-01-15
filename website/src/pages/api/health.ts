import type { NextApiRequest, NextApiResponse } from 'next';
import { API_CONFIG } from '@/config/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Make a request to the backend health endpoint
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`);
    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ 
        status: 'healthy', 
        backend: data,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({ 
        status: 'unhealthy', 
        backend: data,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Unable to connect to backend',
      timestamp: new Date().toISOString()
    });
  }
}