
import { Pool, PoolClient } from 'pg';

// AWS RDS PostgreSQL connection configuration
let pool: Pool | null = null;

// Initialize the connection pool to AWS RDS
const initializePool = () => {
  if (!pool) {
    pool = new Pool({
      user: process.env.AWS_RDS_USERNAME || 'postgres',
      host: process.env.AWS_RDS_HOST || 'localhost',
      database: process.env.AWS_RDS_DATABASE || 'dtwin',
      password: process.env.AWS_RDS_PASSWORD || 'postgres',
      port: parseInt(process.env.AWS_RDS_PORT || '5432'),
      ssl: process.env.AWS_RDS_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
      connectionTimeoutMillis: 2000, // How long to wait for a connection to become available
    });

    // Log connection errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });

    console.log('AWS RDS connection pool initialized');
  }
  return pool;
};

// Get a client from the pool
export const getClient = async (): Promise<PoolClient> => {
  if (!pool) {
    initializePool();
  }
  return pool!.connect();
};

// Execute a query with a client from the pool and release it afterwards
export const query = async <T = any>(text: string, params: any[] = []): Promise<T[]> => {
  const client = await getClient();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
};

// Perform a transaction with multiple queries
export const transaction = async <T = any>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export const rdsClient = {
  query,
  transaction,
  getClient,
};
