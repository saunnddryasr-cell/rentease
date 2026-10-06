import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './backend/app.ts';
import { dbState } from './backend/config/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = await createApp();
  const PORT = Number(process.env.PORT) || 3000;

  // Mount Vite development middlewares or production static files
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RentEase Full-Stack] Server active on http://0.0.0.0:${PORT}`);
    console.log(`[RentEase DB Engine] ${dbState.statusMessage}`);
    console.log(`[RentEase External] Backend: ${dbState.externalBackend}`);
    console.log(`[RentEase External] Frontend: ${dbState.frontendUrl}`);
  });
}

startServer().catch((err) => {
  console.error('[RentEase Full-Stack] Fatal server boot failure:', err);
  process.exit(1);
});
