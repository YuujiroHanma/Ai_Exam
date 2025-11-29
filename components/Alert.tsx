import React, { useState } from 'react'

export default function Alert({ title, message, variant = 'error', details }: { title?: string, message: string, variant?: 'error'|'info'|'success', details?: any }) {
  const [open, setOpen] = useState(false)
  const colors: Record<string,string> = {
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  }

  return (
    <div className={`p-4 rounded-lg border ${colors[variant]}`}> 
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {variant === 'error' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          {title && <div className="font-semibold mb-1">{title}</div>}
          <div className="text-sm">{message}</div>
          {details && (
            <div className="mt-2">
              <button type="button" className="text-xs underline" onClick={() => setOpen(!open)}>{open ? 'Hide details' : 'Show details'}</button>
              {open && (
                <pre className="mt-2 text-xs overflow-x-auto bg-white p-2 rounded border">{typeof details === 'string' ? details : JSON.stringify(details, null, 2)}</pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
