import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import {Invoices, Customers} from '@/db/schema';

if (!process.env.XATA_DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ 
  connectionString: process.env.XATA_DATABASE_URL, 
  max: 20 
});

export const db = drizzle(pool,{
  schema: {
      Invoices,
      Customers
  }
});