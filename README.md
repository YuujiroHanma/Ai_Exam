# Expense Reporting POC

This project is a Proof-of-Concept for corporate expense reporting automation.

Quick start

1. Install dependencies:

```powershell
npm install
```

2. Create `.env.local` from `.env.local.example` and set your n8n webhook URLs.

3. Run the dev server:

```powershell
npm run dev
```

Files of interest

- `pages/index.tsx` — main UI
- `components/ExpenseForm.tsx` — submission form
- `components/ExpenseHistory.tsx` — history and breakdown
- `lib/api.ts` — `sendExpense()` and `getExpenses()` using n8n webhooks
- `supabase-mcp-prompts.md` — SQL and prompts to create Supabase schema and bucket
