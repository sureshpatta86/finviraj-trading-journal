import { Config } from 'drizzle-kit'

export default {
  schema: './src/lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password123',
    database: process.env.DB_NAME || 'trading_journal',
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: false,
  },
} satisfies Config
