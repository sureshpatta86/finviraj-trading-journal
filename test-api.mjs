// Test the enhanced trades API endpoints

const API_BASE = 'http://localhost:3000/api/trades/enhanced'

// Test data
const testTrade = {
  userId: 'test_user_api',
  symbol: 'MSFT',
  entryDate: '2024-01-17',
  entryTime: '10:15',
  type: 'Call',
  entryPrice: 380.25,
  quantity: 20,
  stopLoss: 375.00,
  riskPerTrade: 250.00,
  followSetup: 'yes',
  mood: 'Confident',
  tradeNotes: 'Strong earnings guidance and cloud growth',
  setup: 'Bull flag breakout with institutional buying',
  mistakes: 'None'
}

async function testCreateTrade() {
  try {
    console.log('Testing POST /api/trades/enhanced...')
    
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testTrade),
    })

    const result = await response.json()
    console.log('Response:', response.status, result)
    
    if (result.trade) {
      return result.trade.id
    }
    return null
  } catch (error) {
    console.error('Error creating trade:', error)
    return null
  }
}

async function testGetTrades(userId) {
  try {
    console.log('Testing GET /api/trades/enhanced...')
    
    const response = await fetch(`${API_BASE}?userId=${userId}`)
    const result = await response.json()
    
    console.log('Response:', response.status, result)
    return result.trades || []
  } catch (error) {
    console.error('Error fetching trades:', error)
    return []
  }
}

async function testUpdateTrade(tradeId) {
  try {
    console.log('Testing PUT /api/trades/enhanced...')
    
    const updateData = {
      id: tradeId,
      mood: 'Nervous',
      mistakes: 'Emotional decision',
      tradeNotes: 'Updated: Market turned volatile after entry'
    }

    const response = await fetch(API_BASE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    const result = await response.json()
    console.log('Response:', response.status, result)
    return result.trade
  } catch (error) {
    console.error('Error updating trade:', error)
    return null
  }
}

async function testDeleteTrade(tradeId) {
  try {
    console.log('Testing DELETE /api/trades/enhanced...')
    
    const response = await fetch(`${API_BASE}?id=${tradeId}`, {
      method: 'DELETE',
    })

    const result = await response.json()
    console.log('Response:', response.status, result)
    return result
  } catch (error) {
    console.error('Error deleting trade:', error)
    return null
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Starting API Tests...\n')
  
  // Test creating a trade
  const tradeId = await testCreateTrade()
  if (!tradeId) {
    console.log('❌ Create test failed, stopping tests')
    return
  }
  console.log('✅ Trade created with ID:', tradeId, '\n')
  
  // Test getting trades
  const trades = await testGetTrades('test_user_api')
  console.log('✅ Found', trades.length, 'trades\n')
  
  // Test updating a trade
  const updatedTrade = await testUpdateTrade(tradeId)
  if (updatedTrade) {
    console.log('✅ Trade updated successfully\n')
  }
  
  // Test getting trades again to see the update
  await testGetTrades('test_user_api')
  
  // Test deleting a trade
  const deleteResult = await testDeleteTrade(tradeId)
  if (deleteResult) {
    console.log('✅ Trade deleted successfully\n')
  }
  
  console.log('🎉 All tests completed!')
}

// Export the test function so it can be called from the terminal
export { runTests }
