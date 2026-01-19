import postgres from 'postgres'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables')
}

// Create the SQL connection
const sql = postgres(connectionString, {
  max: 10, // Maximum number of connections in the pool
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10 // Connection timeout in seconds
})

// Test the connection
async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`
    console.log(' Database connected successfully at:', result[0].now)
    return true
  } catch (error) {
    console.error(' Database connection failed:', error.message)
    return false
  }
}

export { sql, testConnection }
export default sql
