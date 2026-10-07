import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, inMemoryStore, type ReturnDamageClaim } from './_db.ts';

function parseClaimRoute(req: VercelRequest) {
  const url = new URL(req.url || '', 'http://localhost');
  const parts = url.pathname.split('/').filter(Boolean);
  const baseIdx = parts.indexOf('claims');
  const query = req.query || {};
  if (baseIdx === -1) {
    return { id: (query.id as string) || '' };
  }
  const id = parts[baseIdx + 1] || (query.id as string) || '';
  return { id };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = await getDb();
  const { id: claimId } = parseClaimRoute(req);

  // 1. GET Claims
  if (req.method === 'GET') {
    if (db) {
      try {
        const dbClaims = await db
          .collection<ReturnDamageClaim>('claims')
          .find({}, { projection: { _id: 0 } })
          .sort({ returnDate: -1 })
          .toArray();
        if (dbClaims.length > 0) {
          return res.status(200).json(dbClaims);
        }
      } catch (err) {
        console.warn('MongoDB claims error:', err);
      }
    }
    return res.status(200).json(inMemoryStore.claims);
  }

  // 2. PUT Resolve Claim (/api/claims/:id)
  if (req.method === 'PUT') {
    const { claimStatus, damageDeduction, damageNotes } = req.body || {};
    const claim = inMemoryStore.claims.find((c) => c.id === claimId);

    if (claim) {
      if (claimStatus) claim.claimStatus = claimStatus;
      if (typeof damageDeduction === 'number') {
        claim.damageDeduction = damageDeduction;
        claim.refundAmount = Math.max(0, claim.originalDeposit - damageDeduction);
      }
      if (damageNotes) claim.damageNotes = damageNotes;
    }

    if (db && claimId) {
      try {
        const updateFields: any = {};
        if (claimStatus) updateFields.claimStatus = claimStatus;
        if (typeof damageDeduction === 'number') {
          updateFields.damageDeduction = damageDeduction;
          updateFields.refundAmount = claim ? claim.refundAmount : 0;
        }
        if (damageNotes) updateFields.damageNotes = damageNotes;
        await db.collection('claims').updateOne({ id: claimId }, { $set: updateFields });
      } catch (err) {
        console.warn('MongoDB claim update error:', err);
      }
    }

    return res.status(200).json(claim || { id: claimId, claimStatus, damageDeduction, damageNotes });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
