import { mysqlTable, varchar, text, decimal, datetime, int, boolean } from 'drizzle-orm/mysql-core'
import { createId } from '@paralleldrive/cuid2'

export const users = mysqlTable('users', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  emailVerified: datetime('emailVerified'),
  image: text('image'),
  createdAt: datetime('createdAt').notNull().$defaultFn(() => new Date()),
  updatedAt: datetime('updatedAt').notNull().$defaultFn(() => new Date()),
})

export const accounts = mysqlTable('accounts', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar('userId', { length: 128 }).notNull(),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: int('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
})

export const sessions = mysqlTable('sessions', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  sessionToken: varchar('sessionToken', { length: 255 }).notNull().unique(),
  userId: varchar('userId', { length: 128 }).notNull(),
  expires: datetime('expires').notNull(),
})

export const verificationTokens = mysqlTable('verificationTokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expires: datetime('expires').notNull(),
})

export const trades = mysqlTable('trades', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar('userId', { length: 128 }).notNull(),
  symbol: varchar('symbol', { length: 20 }).notNull(),
  side: varchar('side', { length: 10 }).notNull(), // 'buy' or 'sell'
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  totalValue: decimal('totalValue', { precision: 12, scale: 2 }).notNull(),
  fees: decimal('fees', { precision: 8, scale: 2 }).default('0'),
  executedAt: datetime('executedAt').notNull(),
  strategy: varchar('strategy', { length: 100 }),
  notes: text('notes'),
  createdAt: datetime('createdAt').notNull().$defaultFn(() => new Date()),
  updatedAt: datetime('updatedAt').notNull().$defaultFn(() => new Date()),
})

export const portfolios = mysqlTable('portfolios', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar('userId', { length: 128 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  initialBalance: decimal('initialBalance', { precision: 12, scale: 2 }).notNull(),
  currentBalance: decimal('currentBalance', { precision: 12, scale: 2 }).notNull(),
  isActive: boolean('isActive').default(true),
  createdAt: datetime('createdAt').notNull().$defaultFn(() => new Date()),
  updatedAt: datetime('updatedAt').notNull().$defaultFn(() => new Date()),
})

export const positions = mysqlTable('positions', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar('userId', { length: 128 }).notNull(),
  portfolioId: varchar('portfolioId', { length: 128 }).notNull(),
  symbol: varchar('symbol', { length: 20 }).notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  averagePrice: decimal('averagePrice', { precision: 10, scale: 2 }).notNull(),
  currentPrice: decimal('currentPrice', { precision: 10, scale: 2 }),
  unrealizedPnl: decimal('unrealizedPnl', { precision: 10, scale: 2 }),
  realizedPnl: decimal('realizedPnl', { precision: 10, scale: 2 }).default('0'),
  isOpen: boolean('isOpen').default(true),
  createdAt: datetime('createdAt').notNull().$defaultFn(() => new Date()),
  updatedAt: datetime('updatedAt').notNull().$defaultFn(() => new Date()),
})
