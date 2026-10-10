import express from 'express';
import type { Request, Response } from 'express';
import { dbState, inMemoryStore } from '../config/db.ts';
import type { ReturnDamageClaim } from '../types/index.ts';

const router = express.Router();

// GET all claims
router.get('/claims', async (_req: Request, res: Response) => {
  if (dbState.isConnected && dbState.db) {
    try {
      const dbClaims = await dbState.db
        .collection<ReturnDamageClaim>('claims')
        .find({}, { projection: { _id: 0 } })
        .toArray();
      return res.json(dbClaims);
    } catch (e) {
      console.warn('MongoDB claims error:', e);
    }
  }
  return res.json([]);
});

// PUT Resolve Claim & Refund
router.put('/claims/:id', async (req: Request, res: Response) => {
  const claim = inMemoryStore.claims.find((c) => c.id === req.params.id);
  if (claim) {
    const { claimStatus, damageDeduction, damageNotes } = req.body;
    claim.claimStatus = claimStatus || claim.claimStatus;
    claim.damageDeduction = Number(damageDeduction) || 0;
    claim.refundAmount = Math.max(0, claim.originalDeposit - claim.damageDeduction);
    if (damageNotes) claim.damageNotes = damageNotes;
  }

  if (dbState.isConnected && dbState.db) {
    try {
      await dbState.db.collection('claims').updateOne({ id: req.params.id }, { $set: req.body });
    } catch (e) {
      console.warn('MongoDB claim update error:', e);
    }
  }

  res.json(claim || { id: req.params.id, ...req.body });
});

export default router;
