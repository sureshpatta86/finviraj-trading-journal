import { pgTable, varchar, text, decimal, timestamp, integer, boolean } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const users = pgTable('users', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  emailVerified: timestamp('emailVerified'),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const accounts = pgTable('accounts', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar('userId', { length: 128 }).notNull(),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
})

export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  sessionToken: varchar('sessionToken', { length: 255 }).notNull().unique(),
  userId: varchar('userId', { length: 128 }).notNull(),
  expires: timestamp('expires').notNull(),
})

export const verificationTokens = pgTable('verificationTokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expires: timestamp('expires').notNull(),
})

export const trades = pgTable('trades', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar('userId', { length: 128 }).notNull(),
  symbol: varchar('symbol', { length: 20 }).notNull(),
  side: varchar('side', { length: 10 }).notNull(), // 'buy' or 'sell'
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  totalValue: decimal('totalValue', { precision: 12, scale: 2 }).notNull(),
  fees: decimal('fees', { precision: 8, scale: 2 }).default('0'),
  executedAt: timestamp('executedAt').notNull(),
  strategy: varchar('strategy', { length: 100 }),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Enhanced trades table with comprehensive trading psychology and setup tracking
export const enhancedTrades = pgTable('enhanced_trades', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar('userId', { length: 128 }).notNull(),
  symbol: varchar('symbol', { length: 100 }).notNull(), // Increased for options data
  entryDate: varchar('entryDate', { length: 10 }).notNull(), // YYYY-MM-DD
  entryTime: varchar('entryTime', { length: 5 }).notNull(), // HH:MM
  type: varchar('type', { length: 10 }).notNull(), // 'Call' or 'Put'
  entryPrice: decimal('entryPrice', { precision: 10, scale: 2 }).notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  stopLoss: decimal('stopLoss', { precision: 10, scale: 2 }),
  riskPerTrade: decimal('riskPerTrade', { precision: 10, scale: 2 }),
  followSetup: varchar('followSetup', { length: 3 }).notNull(), // 'yes' or 'no'
  mood: varchar('mood', { length: 20 }).notNull(), // 'Neutral', 'Calm', 'Anxious', 'Confident', 'Panicked'
  tradeNotes: text('tradeNotes'),
  setup: text('setup'),
  mistakes: varchar('mistakes', { length: 50 }), // 'Emotional decision', 'FOMO', 'Over trading', 'Poor Risk to reward', 'None'
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const portfolios = pgTable('portfolios', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar('userId', { length: 128 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  initialBalance: decimal('initialBalance', { precision: 12, scale: 2 }).notNull(),
  currentBalance: decimal('currentBalance', { precision: 12, scale: 2 }).notNull(),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const positions = pgTable('positions', {
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
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
