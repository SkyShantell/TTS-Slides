import { put, list } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const LOCAL = path.join(process.cwd(), '.localdata');
const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
const requireStorage = () => { if (process.env.VERCEL && !hasBlob()) throw new Error('Vercel Blob is not connected. In Vercel open Storage → Create Database → Blob, choose Public, and connect it to this project.'); };

async function ensureLocal(dir='') { await fs.mkdir(path.join(LOCAL, dir), { recursive:true }); }

function versionedKey(key) {
  const ext = path.extname(key);
  const base = ext ? key.slice(0, -ext.length) : key;
  return `${base}-${Date.now()}-${randomUUID().slice(0,8)}${ext}`;
}

export async function saveBytes(key, bytes, contentType='application/octet-stream') {
  requireStorage();
  if (hasBlob()) {
    const uniqueKey = versionedKey(key);
    const blob = await put(uniqueKey, bytes, { access:'public', addRandomSuffix:false, contentType });
    return blob.url;
  }
  await ensureLocal(path.dirname(key));
  const p = path.join(LOCAL, key);
  await fs.writeFile(p, Buffer.from(bytes));
  return `/api/local-file?key=${encodeURIComponent(key)}`;
}

export async function saveJSON(key, value) {
  return saveBytes(key, Buffer.from(JSON.stringify(value, null, 2)), 'application/json');
}

export async function readJSONFromUrl(url) {
  if (!url) return null;
  if (url.startsWith('/api/local-file?')) {
    const key = decodeURIComponent(url.split('key=')[1] || '');
    return JSON.parse(await fs.readFile(path.join(LOCAL, key), 'utf8'));
  }
  const r = await fetch(url, { cache:'no-store' });
  if (!r.ok) throw new Error(`Could not read saved JSON (${r.status})`);
  return r.json();
}

export async function listRecords(kind) {
  requireStorage();
  const prefix = `records/${kind}/`;
  if (hasBlob()) {
    const result = await list({ prefix, limit:1000 });
    const records = [];
    for (const b of result.blobs.filter(x => x.pathname.endsWith('.json'))) {
      try { records.push(await readJSONFromUrl(b.url)); } catch {}
    }
    return records.sort((a,b) => String(b.updated_at||b.created_at||'').localeCompare(String(a.updated_at||a.created_at||'')));
  }
  await ensureLocal(prefix);
  const dir = path.join(LOCAL, prefix);
  const names = await fs.readdir(dir).catch(() => []);
  const records=[];
  for (const name of names.filter(n=>n.endsWith('.json'))) {
    try { records.push(JSON.parse(await fs.readFile(path.join(dir,name),'utf8'))); } catch {}
  }
  return records.sort((a,b) => String(b.updated_at||b.created_at||'').localeCompare(String(a.updated_at||a.created_at||'')));
}

export async function getRecord(kind, id) {
  const records = await listRecords(kind);
  return records.find(r => r.id === id) || null;
}

export async function saveRecord(kind, record) {
  record.updated_at = new Date().toISOString();
  if (!record.created_at) record.created_at = record.updated_at;
  await saveJSON(`records/${kind}/${record.id}.json`, record);
  return record;
}
