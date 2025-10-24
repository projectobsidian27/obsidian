// PostgreSQL database connection for Vercel serverless functions
// Uses connection pooling compatible with serverless environments

import { Pool } from 'pg';

// Singleton pool instance
let pool: Pool | null = null;

/**
 * Get or create PostgreSQL connection pool
 * Optimized for serverless: creates pool lazily and reuses across invocations
 */
export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString,
      // Serverless-friendly settings
      max: 10, // Maximum pool size
      idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
      connectionTimeoutMillis: 10000, // Timeout after 10 seconds trying to connect
      ssl: {
        rejectUnauthorized: false, // For Render PostgreSQL
      },
    });

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });
  }

  return pool;
}

/**
 * Execute a query with automatic connection handling
 */
export async function query(text: string, params?: unknown[]) {
  const pool = getPool();
  const start = Date.now();

  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log slow queries in development
    if (process.env.NODE_ENV === 'development' && duration > 1000) {
      console.log('Slow query detected:', { text, duration, rows: result.rowCount });
    }

    return result;
  } catch (error) {
    console.error('Database query error:', { text, error });
    throw error;
  }
}

/**
 * Simple encryption for tokens (basic XOR cipher)
 * TODO: Replace with proper encryption (AES-256-GCM) in production
 */
export function encryptToken(token: string): string {
  const key = process.env.ENCRYPTION_KEY || 'default-key-change-me';
  let encrypted = '';

  for (let i = 0; i < token.length; i++) {
    encrypted += String.fromCharCode(
      token.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }

  return Buffer.from(encrypted).toString('base64');
}

/**
 * Simple decryption for tokens
 * TODO: Replace with proper decryption (AES-256-GCM) in production
 */
export function decryptToken(encryptedToken: string): string {
  const key = process.env.ENCRYPTION_KEY || 'default-key-change-me';
  const encrypted = Buffer.from(encryptedToken, 'base64').toString();
  let decrypted = '';

  for (let i = 0; i < encrypted.length; i++) {
    decrypted += String.fromCharCode(
      encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }

  return decrypted;
}

/**
 * Close pool connection (for graceful shutdown)
 * Not typically needed in serverless, but useful for testing
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
