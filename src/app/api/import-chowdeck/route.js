import { NextResponse } from 'next/server';
import { db } from '@/../firebase-admin.config';

function bandFromMinimumOrder(minimumOrderAmount) {
  if (minimumOrderAmount == null) return null;
  const value = Number(minimumOrderAmount);
  if (Number.isNaN(value)) return null;
  if (value <= 5000) return '₦';
  if (value <= 10000) return '₦₦';
  return '₦₦₦';
}

function toDateOrNull(val) {
  if (!val) return null;
  const date = new Date(val);
  return Number.isNaN(date.getTime()) ? null : date;
}

function transformSpot(input) {
  const now = new Date();

  const externalId = String(
    input.external_id ?? input.id ?? ''
  ).trim() || undefined;

  const computedBand = bandFromMinimumOrder(input.minimum_order_amount);
  const priceBand = computedBand || input.price_band || null;

  return {
    name: input.name ?? '',
    description: input.description ?? '',
    address: input.address ?? '',
    location: {
      lat: input.location?.lat ?? input.coordinates?.lat ?? null,
      lng: input.location?.lng ?? input.coordinates?.lng ?? null,
    },
    category: Array.isArray(input.category)
      ? input.category
      : Array.isArray(input.tags)
        ? input.tags
        : [],
    price_band: priceBand,
    price_range: input.price_range ?? undefined,
    is_open: typeof input.is_open === 'boolean' ? input.is_open : true,
    rating: typeof input.rating === 'number' ? input.rating : 0,
    review_count: typeof input.review_count === 'number' ? input.review_count : 0,
    image_url: input.image_url ?? (Array.isArray(input.images) ? input.images[0] : undefined),
    geocoded_address: input.geocoded_address ?? input.address ?? '',
    geocoding_confidence: 1,
    geocoding_status: input.geocoding_status ?? 'success',
    source: input.source ?? 'Chowdeck',
    source_url: input.source_url ?? null,
    external_id: externalId,
    status: input.status ?? 'active',
    created_at: toDateOrNull(input.created_at) ?? now,
    updated_at: now,
    scraped_at: toDateOrNull(input.scraped_at) ?? now,
  };
}

function dedupeByExternalId(spots) {
  const seen = new Set();
  const out = [];
  for (const spot of spots) {
    const key = spot.external_id ?? '';
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(spot);
  }
  return out;
}

export async function POST(request) {
  try {
    if (!db) {
      return NextResponse.json({ success: false, message: 'Database not available' }, { status: 503 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const inputSpots = Array.isArray(body)
      ? body
      : Array.isArray(body.spots)
        ? body.spots
        : [];

    if (inputSpots.length === 0) {
      return NextResponse.json({ success: false, message: 'No spots provided' }, { status: 400 });
    }

    const transformed = inputSpots.map(transformSpot);
    const deduped = dedupeByExternalId(transformed);

    let added = 0;
    let updated = 0;
    let skipped = 0;

    for (const spot of deduped) {
      try {
        if (!spot.external_id) {
          skipped++;
          continue;
        }

        const existing = await db
          .collection('spots')
          .where('external_id', '==', spot.external_id)
          .limit(1)
          .get();

        if (!existing.empty) {
          const doc = existing.docs[0];
          const existingData = doc.data() || {};
          const { created_at: existingCreatedAt } = existingData;
          const { created_at: incomingCreatedAt, ...rest } = spot;
          const updateData = {
            ...rest,
            created_at: existingCreatedAt || incomingCreatedAt || new Date(),
            updated_at: new Date(),
          };
          await doc.ref.set(updateData, { merge: true });
          updated++;
          await new Promise((r) => setTimeout(r, 30));
          continue;
        }

        await db.collection('spots').add(spot);
        added++;
        await new Promise((r) => setTimeout(r, 50));
      } catch (_err) {
        skipped++;
      }
    }

    return NextResponse.json({ success: true, added, updated, skipped, total: deduped.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
