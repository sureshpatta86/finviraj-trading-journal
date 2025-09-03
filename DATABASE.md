# Database Management Guide

This guide explains how to manage the PostgreSQL database for the Trading Journal application.

## Quick Start

### First Time Setup
```bash
# Set up the database (creates containers and runs migrations)
npm run db:setup
```

### Daily Usage
```bash
# Start the database
npm run db:start

# Stop the database
npm run db:stop

# View database logs
npm run db:logs

# Connect to database directly
npm run db:connect
```

## Advanced Operations

### Reset Database (⚠️ Deletes all data)
```bash
npm run db:reset
```

### Database Migrations
```bash
# Generate new migrations after schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio for database management
npm run db:studio
```

## Database Access

### Connection Details
- **Host**: localhost
- **Port**: 5432
- **Database**: trading_journal
- **Username**: postgres
- **Password**: password123

### pgAdmin (Web Interface)
- **URL**: http://localhost:5050
- **Email**: admin@tradingjournal.com
- **Password**: admin123

### Direct Connection
```bash
# Using psql
docker exec -it trading-journal-postgres psql -U postgres -d trading_journal

# Or using npm script
npm run db:connect
```

## Troubleshooting

### Database Not Starting
1. Ensure Docker is running
2. Check if port 5432 is available: `lsof -i :5432`
3. Check Docker logs: `npm run db:logs`

### Connection Issues
1. Verify `.env` file has correct PostgreSQL settings
2. Check if containers are running: `docker ps`
3. Test connection: `npm run db:connect`

### Reset Everything
```bash
# Stop containers and remove volumes
docker compose down -v

# Rebuild and setup
npm run db:setup
```

## Schema Updates

When you modify `src/lib/schema.ts`:

1. Generate migrations:
   ```bash
   npm run db:generate
   ```

2. Apply migrations:
   ```bash
   npm run db:migrate
   ```

3. Verify changes in Drizzle Studio:
   ```bash
   npm run db:studio
   ```

## Backup and Restore

### Create Backup
```bash
docker exec trading-journal-postgres pg_dump -U postgres trading_journal > backup.sql
```

### Restore Backup
```bash
docker exec -i trading-journal-postgres psql -U postgres trading_journal < backup.sql
```
