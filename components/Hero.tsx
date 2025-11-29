import React from 'react'

function Illustration() {
  return (
    <svg viewBox="0 0 600 400" className="hero-figure" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.9"/>
        </linearGradient>
      </defs>
      <rect x="20" y="40" width="260" height="220" rx="18" fill="#fff" stroke="#eef2ff"/>
      <rect x="320" y="60" width="240" height="160" rx="18" fill="#fff" stroke="#eef2ff"/>
      <circle cx="420" cy="180" r="8" fill="#7c3aed"/>
      <path d="M60 120h180v12H60z" fill="#f1f5f9"/>
      <path d="M60 150h120v12H60z" fill="#f8fafc"/>
      <rect x="50" y="250" width="260" height="20" rx="6" fill="url(#g1)" opacity="0.14"/>
      <g transform="translate(340,80)">
        <rect x="0" y="0" width="60" height="16" rx="4" fill="#eef2ff"/>
        <rect x="0" y="30" width="180" height="12" rx="6" fill="#f1f5f9"/>
        <rect x="0" y="54" width="120" height="12" rx="6" fill="#f8fafc"/>
      </g>
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="mb-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-center md:text-left">Smart Expense Reporting</h1>
          <p className="text-muted text-sm md:text-base text-center md:text-left">Snap receipts, submit expenses, and track reimbursements — with policy checks and audit logs.</p>
        </div>
        <div className="flex-1 flex justify-center">
          <Illustration />
        </div>
      </div>
    </section>
  )
}
