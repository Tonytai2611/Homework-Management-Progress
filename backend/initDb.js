import sql from './db.js'

/**
 * Initialize database schema
 * Creates tables and indexes if they don't exist
 */
export async function initializeDatabase() {
    try {
        console.log('🔧 Initializing database schema...')

        // Create user_role enum type
        await sql`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('student', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `
        console.log('  ✅ Enum type "user_role" ready')

        // Create users table
        await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role user_role NOT NULL DEFAULT 'student',
        level VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
        console.log('  ✅ Table "users" ready')

        // Create indexes
        await sql`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `
        console.log('  ✅ Index "idx_users_email" ready')

        await sql`
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)
    `
        console.log('  ✅ Index "idx_users_role" ready')

        // Create update trigger function
        await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `
        console.log('  ✅ Function "update_updated_at_column" ready')

        // Create trigger
        await sql`
      DO $$ BEGIN
        CREATE TRIGGER update_users_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `
        console.log('  ✅ Trigger "update_users_updated_at" ready')

        console.log('✅ Database schema initialized successfully!\n')
        return true
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message)
        return false
    }
}
