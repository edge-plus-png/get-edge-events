// src/lib/db.ts  (or lib/db.ts depending on your structure)

import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;