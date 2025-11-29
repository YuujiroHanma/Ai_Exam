#!/usr/bin/env node
/*
 * Run Supabase MCP actions locally:
 * - create `receipts` storage bucket (public read) via Storage REST API using SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * - run SQL migration `db/init.sql` if DATABASE_URL is provided
 *
 * Environment variables (preferred, do NOT paste keys into chat):
 *  - SUPABASE_URL (e.g. https://your-project-ref.supabase.co)
 *  - SUPABASE_SERVICE_ROLE_KEY (service_role key from Supabase)
 *  - DATABASE_URL (optional) to run SQL migration directly via Postgres
 */

const fs = require('fs')
const path = require('path')
const { Client } = require('pg')

async function createBucket(supabaseUrl, serviceKey, bucketName = 'receipts') {
  const url = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/buckets`
  const body = { name: bucketName, public: true }

  console.log('Creating storage bucket via:', url)
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  let json
  try { json = JSON.parse(text) } catch (_) { json = { text } }

  if (!res.ok) {
    throw new Error(`Failed to create bucket: ${res.status} ${res.statusText} - ${JSON.stringify(json)}`)
  }
  return json
}

async function runSqlMigration(databaseUrl) {
  const sqlPath = path.join(__dirname, '..', 'db', 'init.sql')
  if (!fs.existsSync(sqlPath)) throw new Error('Migration file not found: ' + sqlPath)
  const sql = fs.readFileSync(sqlPath, 'utf8')

  const client = new Client({ connectionString: databaseUrl })
  try {
    await client.connect()
    console.log('Connected to DB, running migration...')
    await client.query('BEGIN')
    // run whole file
    await client.query(sql)
    await client.query('COMMIT')
    console.log('Migration applied successfully')
  } catch (err) {
    console.error('Migration failed:', err.message || err)
    try { await client.query('ROLLBACK') } catch (_) {}
    throw err
  } finally {
    await client.end()
  }
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE
  const databaseUrl = process.env.DATABASE_URL

  if (!supabaseUrl || !serviceKey) {
    console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set as environment variables.')
    console.error('Set them in your shell or a local `.env.local` and do NOT commit secrets.')
    process.exit(1)
  }

  try {
    const bucketRes = await createBucket(supabaseUrl, serviceKey, 'receipts')
    console.log('Bucket creation response:', JSON.stringify(bucketRes, null, 2))
  } catch (err) {
    console.error('Bucket creation error:', err.message)
  }

  if (databaseUrl) {
    try {
      await runSqlMigration(databaseUrl)
    } catch (err) {
      console.error('SQL migration failed:', err.message)
    }
  } else {
    console.log('DATABASE_URL not provided — skipping SQL migration. To run migration, set DATABASE_URL and re-run.')
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
