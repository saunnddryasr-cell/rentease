import type { VercelRequest, VercelResponse } from '@vercel/node';
import healthHandler from './health.ts';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return healthHandler(req, res);
}
