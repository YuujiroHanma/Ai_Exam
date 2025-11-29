# Supabase MCP Prompts and SQL for Expense Reporting POC

This file contains SQL and natural-language prompts you can use with the Supabase Managed Control Panel (MCP) to create the database schema, storage bucket, and additional automation.

-- SQL to create required extensions (run once)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Table: users
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_code text UNIQUE NOT NULL,
  # Supabase MCP Prompts and SQL for Expense Reporting POC

  This file contains SQL and natural-language prompts you can use with the Supabase Managed Control Panel (MCP) to create the database schema, storage bucket, and additional automation.

  -- SQL to create required extensions (run once)
  CREATE EXTENSION IF NOT EXISTS pgcrypto;

  -- Table: users
  CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_code text UNIQUE NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    created_at timestamptz DEFAULT now()
  );

  -- Table: expenses
  CREATE TABLE IF NOT EXISTS public.expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    employee_code text,
    receipt_image_url text,
    merchant text,
    receipt_date date,
    amount numeric(12,2),
    currency text,
    category text,
    contains_alcohol boolean,
    contains_cigarettes boolean,
    is_out_of_town_travel boolean,
    is_training_related_to_job boolean,
    description text,
    status text,
    status_reason text,
    policy_code text,
    created_at timestamptz DEFAULT now()
  );

  -- Table: jailbreak_logs
  CREATE TABLE IF NOT EXISTS public.jailbreak_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_code text,
    raw_comment text,
    detected_instructions text,
    created_at timestamptz DEFAULT now()
  );

  -- Table: error_logs
  CREATE TABLE IF NOT EXISTS public.error_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source text,
    error_message text,
    payload jsonb,
    created_at timestamptz DEFAULT now()
  );

  -- Indexes (optional)
  CREATE INDEX IF NOT EXISTS idx_expenses_employee_code ON public.expenses(employee_code);
  CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON public.expenses(created_at);

  -- Storage: receipts bucket (public read)
  -- In Supabase UI or using Storage API create a bucket named `receipts` with public read access.

  -- Example Supabase MCP natural language prompt to create schema:
  /*
  Create the tables `users`, `expenses`, `jailbreak_logs`, and `error_logs` with the columns and constraints as specified in the project specification. Create the `receipts` storage bucket with public read access.
  */

  -- Notes:
  - Ensure `gen_random_uuid()` (pgcrypto) is available on the database; if not, enable it before running the SQL.
  - Consider RLS policies for production; for POC the tables may be open to service role access only.

  ----

  ## Ready-to-paste Supabase MCP Natural Language Prompts

  Below are concise prompts you can paste directly into the Supabase Managed Control Panel (MCP) or AI assistant. Each prompt requests a clear action and includes the exact SQL to run when applicable. Use them in order.

  1) Create schema (tables + extensions + indexes)

  "Create database schema for the Expense Reporting Proof-of-Concept. Run SQL that:
  - ensures the `pgcrypto` extension exists (so we can use `gen_random_uuid()`),
  - creates a `users` table with columns `id` (uuid pk default gen_random_uuid()), `employee_code` (text unique not null), `first_name` (text not null), `last_name` (text not null), `created_at` (timestamptz default now()),
  - creates an `expenses` table with columns `id` uuid pk default gen_random_uuid(), `user_id` uuid fk -> users(id) on delete set null, `employee_code` text, `receipt_image_url` text, `merchant` text, `receipt_date` date, `amount` numeric(12,2), `currency` text, `category` text, `contains_alcohol` boolean, `contains_cigarettes` boolean, `is_out_of_town_travel` boolean, `is_training_related_to_job` boolean, `description` text, `status` text, `status_reason` text, `policy_code` text, `created_at` timestamptz default now(),
  - creates `jailbreak_logs` and `error_logs` tables per spec,
  - creates useful indexes on `expenses(employee_code)` and `expenses(created_at)`.

  Please run the SQL exactly as shown and return a short confirmation listing any created objects or errors."

  2) Create storage bucket `receipts` (public read)

  "Create a Storage bucket named `receipts` and set its privacy to public (readable). If the MCP cannot directly create Storage buckets, provide the exact REST API call or UI steps to create the bucket with public read access and an example policy to allow anonymous read of objects.

  After creating the bucket, return the public URL template used to access objects (for example: `https://<project-ref>.supabase.co/storage/v1/object/public/receipts/<object>`)."

  3) (Optional) Add a small seed and policy suggestions

  "Insert a small sample user and sample expense row for testing. Then suggest minimal RLS policies suitable for a POC that allow a server/service-role to read/write, and allow authenticated users to read their own expenses based on `employee_code`. Output the SQL for the seed rows and the RLS policies as a single transaction."

  4) Verify and report

  "Run verification queries and return the results (up to 20 rows):
  SELECT * FROM public.users LIMIT 10;
  SELECT * FROM public.expenses ORDER BY created_at DESC LIMIT 10;
  SELECT * FROM public.jailbreak_logs LIMIT 10;
  SELECT * FROM public.error_logs LIMIT 10;

  Also return the storage bucket list and the `receipts` bucket status (public/private) and an example public object URL if any object exists."

  ----

  ## Example MCP Usage Instructions

  1. Open Supabase Studio for your project.
  2. Navigate to the AI / Model Context Protocol (MCP) or to the SQL editor area where natural-language prompts are supported.
  3. Paste the first prompt (Create schema) and execute. Review the returned SQL execution summary and errors (if any).
  4. Paste the Create bucket prompt. If the MCP cannot directly create storage via SQL, use the Storage section in the UI and set the bucket to public read. Then run the Verify prompt.

  If your Supabase workspace exposes a textual 'Assistant' or 'AI SQL' box, you can paste these prompts verbatim. The assistant will normally translate them into SQL and run them with the service role. Always confirm the assistant is using the service role or a DB user with sufficient privileges before running schema-altering prompts.

  ## Programmatic Alternative (manual): run SQL via Supabase SQL API

  If you prefer automation (CI), you can use the Supabase REST SQL API or the `psql`/`pg` client with your service role connection string. Example using `psql` (local machine where `DATABASE_URL` is set):

  ```powershell
  # Run the migration file using psql
  psql $env:DATABASE_URL -f ./db/init.sql
  ```

  Or using `curl` to call a Supabase SQL HTTP endpoint (requires a Supabase service-role key and the SQL API enabled):

  ```text
  POST https://<project>.supabase.co/rest/v1/rpc/sql
  Headers:
    apikey: <SERVICE_ROLE_KEY>
    Authorization: Bearer <SERVICE_ROLE_KEY>
  Body: {"sql":"<your SQL here>"}
  ```

  Note: Supabase's public REST routes may vary; prefer the Studio MCP or `psql` with `DATABASE_URL` when possible.

  ----

  ## Quick Verification SQL (copy/paste)

  -- verify tables exist and sample counts
  SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
  SELECT COUNT(*) AS users_count FROM public.users;
  SELECT COUNT(*) AS expenses_count FROM public.expenses;

  -- show sample rows
  SELECT * FROM public.users LIMIT 5;
  SELECT * FROM public.expenses ORDER BY created_at DESC LIMIT 10;

  ----

  ## Notes & Safety

  - Running schema-changing prompts requires a user with adequate privileges (service role). Do not paste these prompts when the assistant is running with only a low-privilege key.
  - For production, review RLS policies, backups, and least-privilege service keys before enabling public storage buckets.
