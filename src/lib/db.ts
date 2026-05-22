import fs from 'fs';
import path from 'path';
import { DatabaseSchema } from './types';
import { getInitialData } from './seed';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');
const TMP_FILE = path.join('/tmp', 'crm_db.json');

// Using globalThis to persist database in-memory across hot-reloads in development
// and as a fallback in serverless (Vercel) environments.
const globalForDb = globalThis as unknown as {
  db: DatabaseSchema | undefined;
};

export function getDb(): DatabaseSchema {
  // 1. If we already have it in memory, return it.
  if (globalForDb.db) {
    return globalForDb.db;
  }

  // 2. Try to read from local file system (development/persistent environments)
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      globalForDb.db = JSON.parse(data);
      return globalForDb.db!;
    }
  } catch (err) {
    console.warn('Failed to read from local db.json:', err);
  }

  // 3. Try to read from /tmp (Vercel serverless environment)
  try {
    if (fs.existsSync(TMP_FILE)) {
      const data = fs.readFileSync(TMP_FILE, 'utf-8');
      globalForDb.db = JSON.parse(data);
      return globalForDb.db!;
    }
  } catch (err) {
    console.warn('Failed to read from /tmp/crm_db.json:', err);
  }

  // 4. Initialize with seed data if no database exists
  const initialData = getInitialData();
  globalForDb.db = initialData;

  // Save the seed data to file so we have it persistent
  saveDb(initialData);

  return initialData;
}

export function saveDb(data: DatabaseSchema): boolean {
  globalForDb.db = data;

  // 1. Try to write to project folder (local dev)
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    // This is expected on Vercel deployment where the directory is read-only.
    // We swallow the warning and proceed to Vercel's writeable /tmp or in-memory backup.
  }

  // 2. Try to write to /tmp folder (serverless dev/production)
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn('Failed to write to /tmp/crm_db.json:', err);
  }

  // If both failed, we still have it saved in `globalForDb.db` (in-memory).
  return true;
}
