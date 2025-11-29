import React, { useEffect, useState } from 'react'
import { getExpenses } from '../lib/api'
import Card from './Card'

type Expense = {
  id: string
  merchant?: string
  receipt_date?: string
  amount?: string | number
  currency?: string
  category?: string
  status?: string
  status_reason?: string
}

export default function ExpenseHistory({ employeeCode }: { employeeCode?: string }) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Expense[]>([])

  useEffect(() => {
    fetchData()
  }, [employeeCode])

  async function fetchData() {
    setLoading(true)
    try {
      const resp = await getExpenses(employeeCode ? { employee_code: employeeCode } : {})
      // Expecting array
      setData(Array.isArray(resp) ? resp : resp?.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const total = data.reduce((s, e) => s + Number(e.amount || 0), 0)

  const byCategory = data.reduce((acc: Record<string, number>, e) => {
    const k = e.category || 'Uncategorized'
    acc[k] = (acc[k] || 0) + Number(e.amount || 0)
    return acc
  }, {})

  const byStatus = data.reduce((acc: Record<string, number>, e) => {
    const k = e.status || 'unknown'
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Expense History</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          <Card className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted">Total spent</div>
              <div className="text-2xl font-bold">{total.toFixed(2)}</div>
            </div>
            <div className="text-sm text-muted">{data.length} items</div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card>
              <div className="text-sm">By Category</div>
              <ul className="mt-2 text-sm">
                {Object.entries(byCategory).map(([k, v]) => (
                  <li key={k}>{k}: {v.toFixed(2)}</li>
                ))}
              </ul>
            </Card>
            <Card>
              <div className="text-sm">By Status</div>
              <ul className="mt-2 text-sm">
                {Object.entries(byStatus).map(([k, v]) => (
                  <li key={k}>{k}: {v}</li>
                ))}
              </ul>
            </Card>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-muted">
                    <th className="px-3 py-2">Merchant</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="px-3 py-2">{r.merchant || '-'}</td>
                      <td className="px-3 py-2">{r.receipt_date || '-'}</td>
                      <td className="px-3 py-2">{r.amount || '-'}</td>
                      <td className="px-3 py-2">{r.category || '-'}</td>
                      <td className="px-3 py-2">{r.status || '-'}</td>
                      <td className="px-3 py-2">{r.status_reason || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
