import React, { useState } from 'react'

const API = import.meta.env.VITE_API_URL || '/api'

function strengthColor(label) {
  if (label === 'Weak')        return '#ff4466'
  if (label === 'Fair')        return '#ffaa00'
  if (label === 'Strong')      return '#00ffaa'
  if (label === 'Very Strong') return '#00aaff'
  return '#3a5a4a'
}

function strengthWidth(score) {
  const map = { 0:8, 1:22, 2:40, 3:58, 4:72, 5:86, 6:100 }
  return `${map[Math.min(score ?? 0, 6)] ?? 8}%`
}

function badgeStyle(label) {
  if (label === 'Weak')        return 'text-red   border-red/30   bg-red/10'
  if (label === 'Fair')        return 'text-amber  border-amber/30  bg-amber/10'
  if (label === 'Strong')      return 'text-green  border-green/30  bg-green/10'
  if (label === 'Very Strong') return 'text-blue   border-blue/30   bg-blue/10'
  return ''
}

export default function StrengthChecker() {
  const [pw, setPw]           = useState('')
  const [show, setShow]       = useState(false)
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function analyse() {
    if (!pw.trim()) return
    setLoading(true); setError(null)
    try {
      const res  = await fetch(`${API}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      setResult(await res.json())
    } catch (e) { setError(e.message) }
    finally     { setLoading(false)   }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="font-mono text-sm text-green tracking-wider uppercase mb-1">// phase_01</div>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
          Strength <span className="text-green">Checker</span>
        </h1>
        <p className="text-text2 text-base mt-2 max-w-2xl">
          Analyses password complexity, charset diversity, and Shannon entropy to score real‑world crackability.
        </p>
      </div>

      {/* Input card */}
      <div className="bg-bg2/80 backdrop-blur-sm border border-border1 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex items-center gap-2 mb-5 font-mono text-sm text-green tracking-wider uppercase">
          <span className="w-1 h-4 bg-green rounded-sm inline-block" />
          input terminal
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type={show ? 'text' : 'password'}
              placeholder="enter password to analyse..."
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && analyse()}
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-bg3 border border-border2 rounded-lg px-4 py-3 text-text1 font-mono text-base outline-none focus:border-green focus:ring-2 focus:ring-green/20 placeholder-text3 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShow(s => !s)}
              className="px-4 py-3 rounded-lg border border-border2 text-text2 hover:text-text1 hover:border-green/40 transition-all"
            >
              <i className={`fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'} text-base`} />
            </button>
            <button
              onClick={analyse}
              disabled={loading || !pw.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green text-bg font-bold text-base tracking-wide hover:bg-green-dim transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading
                ? <span className="w-5 h-5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                : <i className="fa-solid fa-magnifying-glass" />
              }
              {loading ? 'Scanning...' : 'Analyse'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-red/10 border border-red/30 rounded-lg font-mono text-sm text-red">
            <i className="fa-solid fa-triangle-exclamation" />
            {error} — is the backend running?
          </div>
        )}
      </div>

      {/* Result card */}
      {result ? (
        <div className="bg-bg2/80 backdrop-blur-sm border border-border1 rounded-2xl p-6 shadow-xl animate-glow-pulse">
          <div className="flex items-center gap-2 mb-6 font-mono text-sm text-green tracking-wider uppercase">
            <span className="w-1 h-4 bg-green rounded-sm inline-block" />
            analysis result
          </div>

          {/* Strength bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono text-sm text-text2 tracking-wide uppercase">Strength Level</span>
              <span className={`font-mono text-sm font-bold px-3 py-1.5 rounded-full border tracking-wide uppercase ${badgeStyle(result.label)}`}>
                {result.label}
              </span>
            </div>
            <div className="h-2 bg-surface2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: strengthWidth(result.score), backgroundColor: strengthColor(result.label) }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Score',   val: result.score,               unit: '/ 6' },
              { label: 'Entropy', val: result.entropy,             unit: 'bits' },
              { label: 'Length',  val: result.password?.length ?? 0, unit: 'chars' },
            ].map(s => (
              <div key={s.label} className="bg-bg3 border border-border1 rounded-xl px-4 py-3">
                <div className="font-mono text-xs text-text3 tracking-wider uppercase mb-1">{s.label}</div>
                <div className="font-mono text-2xl font-bold text-green">
                  {s.val}<span className="text-sm text-text3 ml-1">{s.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          {result.feedback?.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3 font-mono text-sm text-green tracking-wider uppercase">
                <span className="w-1 h-4 bg-green rounded-sm inline-block" />
                recommendations
              </div>
              <div className="flex flex-col gap-2">
                {result.feedback.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 bg-bg3 border border-border1 border-l-4 border-l-amber rounded-lg text-text2 text-sm">
                    <i className="fa-solid fa-chevron-right text-amber text-xs mt-0.5 flex-shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>
            </>
          )}

          {result.feedback?.length === 0 && (
            <div className="font-mono text-sm text-green flex items-center gap-2">
              <i className="fa-solid fa-circle-check" /> No issues detected. Password meets all criteria.
            </div>
          )}
        </div>
      ) : !loading && (
        <div className="bg-bg2/80 backdrop-blur-sm border border-border1 rounded-2xl p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12 text-text3 gap-4">
            <i className="fa-solid fa-magnifying-glass text-5xl opacity-50" />
            <div className="text-lg text-text2 font-semibold">Awaiting input</div>
            <div className="font-mono text-sm">type a password above and hit Analyse</div>
          </div>
        </div>
      )}
    </div>
  )
}