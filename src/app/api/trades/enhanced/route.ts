import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { enhancedTrades } from '@/lib/schema'
import { enhancedTradeSchema } from '@/lib/validations'
import { eq } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'

// GET all enhanced trades for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const trades = await db
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
      .where(eq(enhancedTrades.userId, userId))

    // Helper function to extract exit data from trade notes
    const extractExitData = (tradeNotes: string | null) => {
      if (!tradeNotes) return null
      
      const exitDataMatch = tradeNotes.match(/\[EXIT_DATA:(.+?)\]/s)
      if (exitDataMatch) {
        try {
          return JSON.parse(exitDataMatch[1])
        } catch (error) {
          console.error('Error parsing exit data:', error)
          return null
        }
      }
      return null
    }

    // Add default status for all trades and check for exit data in notes
    const tradesWithStatus = trades.map(trade => {
      const exitData = extractExitData(trade.tradeNotes)
      
      if (exitData && exitData.isExited) {
        // Trade has exit data stored in notes
        return {
          ...trade,
          status: 'completed' as const,
          exitDate: exitData.exitDate,
          exitTime: exitData.exitTime,
          exitPrice: exitData.exitPrice,
          realizedPnl: exitData.realizedPnl,
          exitNotes: exitData.exitNotes,
          // Clean up trade notes by removing exit data
          tradeNotes: trade.tradeNotes?.replace(/\n\n\[EXIT_DATA:.+?\]/s, '') || null
        }
      } else {
        // Trade is still in progress
        return {
          ...trade,
          status: 'in-progress' as const
        }
      }
    })

    return NextResponse.json({ trades: tradesWithStatus })
  } catch (error) {
    console.error('Error fetching enhanced trades:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trades' },
      { status: 500 }
    )
  }
}

// POST - Create new enhanced trade
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...tradeData } = body
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Validate the request body
    const validatedData = enhancedTradeSchema.parse(tradeData)

    // Convert numeric fields to strings for decimal database columns
    const newTradeData = {
      id: createId(),
      userId,
      ...validatedData,
      entryPrice: validatedData.entryPrice.toString(),
      quantity: validatedData.quantity.toString(),
      stopLoss: validatedData.stopLoss?.toString(),
      riskPerTrade: validatedData.riskPerTrade?.toString(),
    }

    const [newTrade] = await db
      .insert(enhancedTrades)
      .values(newTradeData)
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

    // Add default status to response since it's not in DB yet
    const tradeWithStatus = {
      ...newTrade,
      status: 'in-progress' as const
    }

    return NextResponse.json(
      { trade: tradeWithStatus, message: 'Trade created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating enhanced trade:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid trade data', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create trade' },
      { status: 500 }
    )
  }
}

// PUT - Update enhanced trade
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Trade ID is required' },
        { status: 400 }
      )
    }

    // Validate the update data (partial validation)
    const validatedData = enhancedTradeSchema.partial().parse(updateData)

    // Build update object with proper types for database
    const dbUpdateData = {
      updatedAt: new Date(),
      ...(validatedData.symbol && { symbol: validatedData.symbol }),
      ...(validatedData.entryDate && { entryDate: validatedData.entryDate }),
      ...(validatedData.entryTime && { entryTime: validatedData.entryTime }),
      ...(validatedData.type && { type: validatedData.type }),
      ...(validatedData.entryPrice !== undefined && { entryPrice: validatedData.entryPrice.toString() }),
      ...(validatedData.quantity !== undefined && { quantity: validatedData.quantity.toString() }),
      ...(validatedData.stopLoss !== undefined && { stopLoss: validatedData.stopLoss?.toString() }),
      ...(validatedData.riskPerTrade !== undefined && { riskPerTrade: validatedData.riskPerTrade?.toString() }),
      ...(validatedData.followSetup && { followSetup: validatedData.followSetup }),
      ...(validatedData.mood && { mood: validatedData.mood }),
      ...(validatedData.tradeNotes !== undefined && { tradeNotes: validatedData.tradeNotes }),
      ...(validatedData.setup !== undefined && { setup: validatedData.setup }),
      ...(validatedData.mistakes !== undefined && { mistakes: validatedData.mistakes }),
    }

    const [updatedTrade] = await db
      .update(enhancedTrades)
      .set(dbUpdateData)
      .where(eq(enhancedTrades.id, id))
      .returning()

    if (!updatedTrade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      trade: updatedTrade,
      message: 'Trade updated successfully',
    })
  } catch (error) {
    console.error('Error updating enhanced trade:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid trade data', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update trade' },
      { status: 500 }
    )
  }
}

// DELETE - Delete enhanced trade
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Trade ID is required' },
        { status: 400 }
      )
    }

    const [deletedTrade] = await db
      .delete(enhancedTrades)
      .where(eq(enhancedTrades.id, id))
      .returning()

    if (!deletedTrade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Trade deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting enhanced trade:', error)
    return NextResponse.json(
      { error: 'Failed to delete trade' },
      { status: 500 }
    )
  }
}
