# Homework Management Backend

Backend server for the Homework Management System using **Supabase PostgreSQL** database.

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account with a PostgreSQL database

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `postgres` - PostgreSQL client for Node.js
- `dotenv` - Environment variable management

### 2. Configure Database Connection

1. Open the `.env` file in the backend directory
2. Replace `[YOUR-PASSWORD]` with your actual Supabase database password:

```env
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.lrwexdefmbgfgjrdnega.supabase.co:5432/postgres
```

**Connection Parameters:**
- **Host:** `db.lrwexdefmbgfgjrdnega.supabase.co`
- **Port:** `5432`
- **Database:** `postgres`
- **User:** `postgres`

> ⚠️ **Important:** Never commit the `.env` file to version control. It's already added to `.gitignore`.

### 3. Test the Connection

Run the server to test your database connection:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

You should see:
```
🚀 Starting Homework Management Backend...
✅ Database connected successfully at: [timestamp]
✅ Server is ready!

📊 Available tables in database:
  No tables found. Database is empty.
```

## 📁 Project Structure

```
backend/
├── db.js              # Database configuration and connection
├── server.js          # Main server file
├── package.json       # Project dependencies
├── .env               # Environment variables (not in git)
├── .env.example       # Environment template
└── .gitignore         # Git ignore rules
```

## 🔧 Files Overview

### `db.js`
Database configuration file that:
- Loads environment variables
- Creates PostgreSQL connection with connection pooling
- Exports the `sql` function for database queries
- Includes a `testConnection()` function

### `server.js`
Main server file that:
- Tests database connection on startup
- Lists all available tables
- Handles graceful shutdown

### `.env`
Contains your database connection string. **Keep this secure!**

## 📝 Usage Examples

### Basic Query

```javascript
import sql from './db.js'

// Select query
const users = await sql`SELECT * FROM users`

// Insert query
await sql`
  INSERT INTO users (name, email)
  VALUES (${name}, ${email})
`

// Update query
await sql`
  UPDATE users
  SET name = ${newName}
  WHERE id = ${userId}
`

// Delete query
await sql`
  DELETE FROM users
  WHERE id = ${userId}
`
```

## 🔒 Security Notes

- ✅ `.env` file is in `.gitignore`
- ✅ Use `.env.example` as a template for other developers
- ✅ Never hardcode passwords in your code
- ✅ Use environment variables for all sensitive data

## 🆘 Troubleshooting

### Connection Failed
- Verify your password in `.env` is correct
- Check if your IP is allowed in Supabase dashboard
- Ensure you're using the correct connection string

### IPv4 Compatibility
If you're on an IPv4-only network, you may need to:
- Use Supabase Session Pooler instead
- Or purchase IPv4 add-on from Supabase

## 📚 Next Steps

1. Create your database schema in Supabase
2. Build API endpoints in `server.js`
3. Add Express.js for REST API (optional)
4. Implement authentication
5. Add data validation

## 🔗 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Postgres.js Documentation](https://github.com/porsager/postgres)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
