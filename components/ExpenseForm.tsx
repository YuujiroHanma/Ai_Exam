import React, { useState } from 'react'
import { sendExpense } from '../lib/api'
import Card from './Card'
import Alert from './Alert'

export default function ExpenseForm({ onSubmitted }: { onSubmitted?: (res: any) => void }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [employeeCode, setEmployeeCode] = useState('')
  const [comment, setComment] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any | null>(null)

  const canSubmit = employeeCode.trim() !== '' && firstName.trim() !== '' && lastName.trim() !== ''

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    try {
      const res = await sendExpense({ first_name: firstName, last_name: lastName, employee_code: employeeCode, comment, file })
      setResult(res)
      onSubmitted && onSubmitted(res)
    } catch (err: any) {
      setResult({ ok: false, error: err.message })
    } finally {
      setLoading(false)
    }
  }

  function extractFriendlyMessage(res: any) {
    if (!res) return { title: 'Unknown error', message: 'No response received from server.' }

    // The API returns an object like: { ok, status, body }
    const body = res.body ?? res

    // Try common shapes
    try {
      if (typeof body === 'string') {
        // maybe a JSON string
        const parsed = JSON.parse(body)
        if (parsed && parsed.message) return { title: 'Submission error', message: parsed.message, raw: parsed }
      }
    } catch (_) {}

    // Some flows return { status:500, text: '{"code":0,"message":"No item to return was found"}' }
    if (body && typeof body.text === 'string') {
      try {
        const inner = JSON.parse(body.text)
        if (inner && inner.message) {
          // Map known messages to friendlier text
          const m = inner.message
          if (/no item to return was found/i.test(m)) {
            return {
              title: 'Employee not recognized',
              message: 'The provided employee code does not match a registered employee. Please check the employee code or contact HR.',
              raw: inner
            }
          }
          return { title: 'Submission error', message: m, raw: inner }
        }
      } catch (_) {}
    }

    // Generic fallbacks
    if (body && body.error) return { title: 'Submission error', message: String(body.error), raw: body }
    if (body && body.message) return { title: 'Submission error', message: String(body.message), raw: body }
    return { title: 'Submission error', message: `Unexpected response (status ${res.status ?? 'unknown'})`, raw: body }
  }

  return (
    <form className="p-4" onSubmit={handleSubmit}>
      <Card className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">First name</label>
            <input className="mt-1 block w-full rounded-lg border px-3 py-2" value={firstName} onChange={e => setFirstName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Last name</label>
            <input className="mt-1 block w-full rounded-lg border px-3 py-2" value={lastName} onChange={e => setLastName(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Employee code</label>
          <input className="mt-1 block w-full rounded-lg border px-3 py-2" value={employeeCode} onChange={e => setEmployeeCode(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium">Receipt (jpg/png/webp/gif)</label>
          <input
            accept="image/*"
            capture="environment"
            type="file"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Comment</label>
          <textarea className="mt-1 block w-full rounded-lg border px-3 py-2 min-h-[80px]" value={comment} onChange={e => setComment(e.target.value)} />
        </div>

        <div className="md:mt-2">
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full bg-primary text-white py-3 rounded-lg shadow-soft-md disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Expense'}
          </button>
        </div>
      </Card>

      {/* Removed display of last API response per user request */}
    </form>
  )
}
