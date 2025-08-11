import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, feedbackType, subject, message, rating } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Integrate with support ticket system
    // For now, we'll just log the feedback
    
    console.log('Feedback received:', {
      name,
      email,
      feedbackType,
      subject,
      message,
      rating,
      timestamp: new Date().toISOString()
    })

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json(
      { 
        success: true, 
        message: 'Feedback submitted successfully',
        id: Math.random().toString(36).substr(2, 9) // Generate a random ID
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error processing feedback:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
