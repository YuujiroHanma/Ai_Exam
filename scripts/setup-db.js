#!/usr/bin/env node
/**
 * Simple script to run `db/init.sql` against a Postgres database.
 *
 * Usage:
 *  - Set `DATABASE_URL` environment variable to your Supabase DB connection string (service role / admin user recommended).
 *  - Run: `npm run db:setup` (added to package.json)
 */

const fs = require('fs')
const path = require('path')
const { Client } = require('pg')

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('ERROR: DATABASE_URL environment variable is not set.')
    console.error('Set it to your Supabase Postgres connection string (service role / admin).')
    process.exit(1)
  }

  const sqlPath = path.join(__dirname, '..', 'db', 'init.sql')
  if (!fs.existsSync(sqlPath)) {
    console.error('ERROR: SQL file not found at', sqlPath)
    process.exit(1)
  }

  const sql = fs.readFileSync(sqlPath, 'utf8')

  const client = new Client({ connectionString: databaseUrl })
  try {
    await client.connect()
    console.log('Connected to database. Running init SQL...')
    await client.query('BEGIN')
    // split by semicolon and run statements individually to give clearer errors
    const statements = sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean)
    for (const stmt of statements) {
      console.log('> Executing statement...')
      await client.query(stmt)
    }
    await client.query('COMMIT')
    console.log('Database initialization completed successfully.')
  } catch (err) {
    console.error('Error running SQL:', err)
    try { await client.query('ROLLBACK') } catch (e) { /* ignore */ }
    process.exitCode = 2
  } finally {
    await client.end()
  }
}

main()
