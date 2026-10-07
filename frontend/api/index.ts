import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../backend/app.ts';

let cachedApp: any = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!cachedApp) {
      cachedApp = await createApp();
    }
    return cachedApp(req, res);
  } catch (err: any) {
    console.error('[API Serverless Error]:', err);
    res.status(500).json({
      error: 'Backend Serverless Error',
      message: err?.message || String(err),
      timestamp: new Date().toISOString()
    });
  }
}
