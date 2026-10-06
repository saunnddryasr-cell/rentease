import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app.ts';

const PORT = Number(process.env.BACKEND_PORT) || 5000;

async function run() {
  const app = await createApp();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RentEase Dedicated Backend] Running independently on http://0.0.0.0:${PORT}`);
  });
}

run().catch((err) => {
  console.error('[RentEase Dedicated Backend] Failed to start:', err);
  process.exit(1);
});
