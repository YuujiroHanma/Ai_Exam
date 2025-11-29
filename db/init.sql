-- Init SQL for Expense Reporting POC
-- This script creates the required tables for the project.
-- It uses `gen_random_uuid()` (pgcrypto). Ensure the `pgcrypto` extension is available.

-- Enable extensions
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

-- Note: Creating a Supabase Storage bucket must be done via the Supabase UI or Storage API.
-- Create a bucket named `receipts` and configure it for public read access if desired.
