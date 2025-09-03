#!/bin/bash

# Database Setup Script for Trading Journal
# This script sets up PostgreSQL using Docker and creates the database schema

set -e  # Exit on any error

echo "🚀 Setting up Trading Journal Database (PostgreSQL)"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Stop and remove existing containers if they exist
echo "🧹 Cleaning up existing containers..."
docker compose down -v 2>/dev/null || true

# Start PostgreSQL container
echo "🐘 Starting PostgreSQL container..."
docker compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
MAX_ATTEMPTS=30
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    if docker exec trading-journal-postgres pg_isready -U postgres -d trading_journal > /dev/null 2>&1; then
        echo "✅ PostgreSQL is ready!"
        break
    fi
    
    if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
        echo "❌ PostgreSQL failed to start after $MAX_ATTEMPTS attempts"
        exit 1
    fi
    
    echo "⏳ Attempt $ATTEMPT/$MAX_ATTEMPTS - PostgreSQL not ready yet..."
    sleep 2
    ATTEMPT=$((ATTEMPT + 1))
done

# Generate database migrations
echo "📝 Generating database migrations..."
npm run db:generate

# Run database migrations
echo "🔄 Running database migrations..."
npm run db:migrate

echo ""
echo "🎉 Database setup completed successfully!"
echo ""
echo "📊 Database Information:"
echo "  - Host: localhost"
echo "  - Port: 5432"
echo "  - Database: trading_journal"
echo "  - Username: postgres"
echo "  - Password: password123"
echo ""
echo "🔧 Useful commands:"
echo "  - Start containers: docker compose up -d"
echo "  - Stop containers: docker compose down"
echo "  - View logs: docker compose logs -f postgres"
echo "  - Connect to DB: docker exec -it trading-journal-postgres psql -U postgres -d trading_journal"
echo "  - Access pgAdmin: http://localhost:5050 (admin@tradingjournal.com / admin123)"
echo ""
