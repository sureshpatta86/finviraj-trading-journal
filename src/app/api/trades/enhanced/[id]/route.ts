import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { enhancedTrades } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'
import { enhancedTradeSchema } from '@/lib/validations'

export async function PUT(
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
    const validatedData = enhancedTradeSchema.parse(body)
    
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

    // Since existing trades without status should be editable (backward compatibility),
    // we'll allow editing all existing trades found in the database
    // In the future, when all trades have status, we can uncomment this check:
    // if (existingTrade[0].status && existingTrade[0].status !== 'in-progress') {
    //   return NextResponse.json(
    //     { error: 'Cannot edit completed or cancelled trades' },
    //     { status: 400 }
    //   )
    // }
    
    // Update the trade
    const updatedTrade = await db
      .update(enhancedTrades)
      .set({
        symbol: validatedData.symbol,
        entryDate: validatedData.entryDate,
        entryTime: validatedData.entryTime,
        type: validatedData.type,
        entryPrice: validatedData.entryPrice.toString(),
        quantity: validatedData.quantity.toString(),
        stopLoss: validatedData.stopLoss?.toString(),
        riskPerTrade: validatedData.riskPerTrade?.toString(),
        followSetup: validatedData.followSetup,
        mood: validatedData.mood,
        tradeNotes: validatedData.tradeNotes,
        setup: validatedData.setup,
        mistakes: validatedData.mistakes,
        updatedAt: new Date(),
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
    
    return NextResponse.json(updatedTrade[0])
  } catch (error) {
    console.error('Error updating trade:', error)
    
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

export async function DELETE(
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

    // Since existing trades without status should be deletable (backward compatibility),
    // we'll allow deleting all existing trades found in the database
    // In the future, when all trades have status, we can uncomment this check:
    // if (existingTrade[0].status && existingTrade[0].status !== 'in-progress') {
    //   return NextResponse.json(
    //     { error: 'Cannot delete completed trades' },
    //     { status: 400 }
    //   )
    // }
    
    // Delete the trade (or mark as cancelled)
    // Since status field doesn't exist yet, we'll actually delete the record
    // In the future, when status field exists, we can mark as cancelled instead
    const deletedTrade = await db
      .delete(enhancedTrades)
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
      })
    
    return NextResponse.json({ message: 'Trade deleted successfully', trade: deletedTrade[0] })
  } catch (error) {
    console.error('Error deleting trade:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
