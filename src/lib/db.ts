import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

// Create connection with proper MySQL2 configuration
const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trading_journal',
  port: parseInt(process.env.DB_PORT || '3306'),
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
})

export const db = drizzle(connection, { schema, mode: 'default' })
