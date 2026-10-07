import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../backend/app.ts';

let cachedApp: any = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!cachedApp) {
    cachedApp = await createApp();
  }
  return cachedApp(req, res);
}
