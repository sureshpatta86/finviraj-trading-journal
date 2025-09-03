import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

console.log('Testing database connection...');
console.log('Connection string:', connectionString.replace(/:([^:@]+)@/, ':****@'));

try {
  const client = postgres(connectionString);
  const db = drizzle(client);
  
  // Test the connection
  const result = await client`SELECT version() as version, current_database() as database, current_user as user`;
  
  console.log('✅ Database connection successful!');
  console.log('Database version:', result[0].version);
  console.log('Current database:', result[0].database);
  console.log('Current user:', result[0].user);
  
  await client.end();
  process.exit(0);
} catch (error) {
  console.error('❌ Database connection failed:');
  console.error(error.message);
  process.exit(1);
}
