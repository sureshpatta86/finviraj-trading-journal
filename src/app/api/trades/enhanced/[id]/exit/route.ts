import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { enhancedTrades } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'
import { exitTradeSchema } from '@/lib/validations'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: tradeId } = await params
    const body = await request.json()
    
    // Validate the request body
    const validatedData = exitTradeSchema.parse(body)
    
    // Check if trade exists and belongs to the user
    const existingTrade = await db
      .select({
        id: enhancedTrades.id,
        userId: enhancedTrades.userId,
        symbol: enhancedTrades.symbol,
        entryDate: enhancedTrades.entryDate,
        entryTime: enhancedTrades.entryTime,
        type: enhancedTrades.type,
        entryPrice: enhancedTrades.entryPrice,
        quantity: enhancedTrades.quantity,
        stopLoss: enhancedTrades.stopLoss,
        riskPerTrade: enhancedTrades.riskPerTrade,
        followSetup: enhancedTrades.followSetup,
        mood: enhancedTrades.mood,
        tradeNotes: enhancedTrades.tradeNotes,
        setup: enhancedTrades.setup,
        mistakes: enhancedTrades.mistakes,
        createdAt: enhancedTrades.createdAt,
        updatedAt: enhancedTrades.updatedAt,
      })
      .from(enhancedTrades)
      .where(
        and(
          eq(enhancedTrades.id, tradeId),
          eq(enhancedTrades.userId, session.user.id)
        )
      )
      .limit(1)
    
    if (existingTrade.length === 0) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    // Since existing trades without status should be exitable (backward compatibility),
    // we'll allow exiting all existing trades found in the database
    // In the future, when all trades have status, we can uncomment this check:
    // if (existingTrade[0].status && existingTrade[0].status !== 'in-progress') {
    //   return NextResponse.json(
    //     { error: 'Trade is already completed or cancelled' },
    //     { status: 400 }
    //   )
    // }
    
    // Calculate realized P&L
    const entryPrice = parseFloat(existingTrade[0].entryPrice.toString())
    const quantity = parseFloat(existingTrade[0].quantity.toString())
    const exitPrice = validatedData.exitPrice
    const realizedPnl = (exitPrice - entryPrice) * quantity
    
    // Create exit data object to include in trade notes for persistence
    const exitData = {
      exitDate: validatedData.exitDate,
      exitTime: validatedData.exitTime,
      exitPrice: exitPrice,
      realizedPnl: realizedPnl,
      exitNotes: validatedData.exitNotes,
      isExited: true,
      exitTimestamp: new Date().toISOString()
    }
    
    // Append exit data to trade notes as JSON for persistence until migration
    const currentNotes = existingTrade[0].tradeNotes || ''
    const exitDataString = `\n\n[EXIT_DATA:${JSON.stringify(exitData)}]`
    const updatedNotes = currentNotes + exitDataString
    
    // Update the trade with exit information stored in notes
    const exitedTrade = await db
      .update(enhancedTrades)
      .set({
        tradeNotes: updatedNotes,
        updatedAt: new Date(),
        // When migration is applied, uncomment these fields:
        // status: 'completed',
        // exitDate: validatedData.exitDate,
        // exitTime: validatedData.exitTime,
        // exitPrice: exitPrice.toString(),
        // realizedPnl: realizedPnl.toString(),
        // exitNotes: validatedData.exitNotes,
      })
      .where(
        and(
          eq(enhancedTrades.id, tradeId),
          eq(enhancedTrades.userId, session.user.id)
        )
      )
      .returning({
        id: enhancedTrades.id,
        userId: enhancedTrades.userId,
        symbol: enhancedTrades.symbol,
        entryDate: enhancedTrades.entryDate,
        entryTime: enhancedTrades.entryTime,
        type: enhancedTrades.type,
        entryPrice: enhancedTrades.entryPrice,
        quantity: enhancedTrades.quantity,
        stopLoss: enhancedTrades.stopLoss,
        riskPerTrade: enhancedTrades.riskPerTrade,
        followSetup: enhancedTrades.followSetup,
        mood: enhancedTrades.mood,
        tradeNotes: enhancedTrades.tradeNotes,
        setup: enhancedTrades.setup,
        mistakes: enhancedTrades.mistakes,
        createdAt: enhancedTrades.createdAt,
        updatedAt: enhancedTrades.updatedAt,
      })
    
    // Add the calculated exit information to the response
    const exitedTradeWithPnL = {
      ...exitedTrade[0],
      status: 'completed',
      exitDate: validatedData.exitDate,
      exitTime: validatedData.exitTime,
      exitPrice: exitPrice,
      realizedPnl: realizedPnl,
      exitNotes: validatedData.exitNotes,
    }
    
    return NextResponse.json(exitedTradeWithPnL)
  } catch (error) {
    console.error('Error exiting trade:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
