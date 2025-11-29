const submitUrl = process.env.NEXT_PUBLIC_N8N_SUBMIT_WEBHOOK || ''
const historyUrl = process.env.NEXT_PUBLIC_N8N_HISTORY_WEBHOOK || ''

export async function sendExpense(payload: {
  first_name: string
  last_name: string
  employee_code: string
  comment?: string
  file?: File | null
}) {
  if (!submitUrl) throw new Error('Submit webhook URL not configured')

  const form = new FormData()
  form.append('first_name', payload.first_name)
  form.append('last_name', payload.last_name)
  form.append('employee_code', payload.employee_code)
  if (payload.comment) form.append('comment', payload.comment)
  if (payload.file) form.append('receipt', payload.file)

  const res = await fetch(submitUrl, {
    method: 'POST',
    body: form,
  })

  const text = await res.text()
  let json: any = { status: res.status, text }
  try { json = await res.json() } catch (_) {}
  return { ok: res.ok, status: res.status, body: json }
}

export async function getExpenses(params: { employee_code?: string } = {}) {
  if (!historyUrl) throw new Error('History webhook URL not configured')

  const res = await fetch(historyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  const json = await res.json()
  return json
}
