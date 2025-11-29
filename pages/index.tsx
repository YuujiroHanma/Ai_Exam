import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import Hero from '../components/Hero'

const ExpenseForm = dynamic(() => import('../components/ExpenseForm'), { ssr: false })
const ExpenseHistory = dynamic(() => import('../components/ExpenseHistory'), { ssr: false })

export default function Home() {
  const [lastResponse, setLastResponse] = useState<any | null>(null)
  const [employeeCode, setEmployeeCode] = useState('')

  return (
    <div className="app-container min-h-screen">
      <Head>
        <title>Expense POC</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="content max-w-4xl mx-auto p-6">
        <Hero />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <ExpenseForm onSubmitted={(r) => { setLastResponse(r); }} />
          </div>

          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Filter employee code for history (optional)</label>
              <input value={employeeCode} onChange={e => setEmployeeCode(e.target.value)} className="block w-full rounded-lg border px-3 py-2" />
            </div>
            <ExpenseHistory employeeCode={employeeCode || undefined} />
          </div>
        </div>

        {lastResponse && (
          <div className="mt-6 p-4 bg-yellow-50 border rounded-lg">
            <strong>Last API response:</strong>
            <pre className="mt-2 text-sm whitespace-pre-wrap">{JSON.stringify(lastResponse, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  )
}
