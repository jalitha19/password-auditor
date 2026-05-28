import React, { useState } from 'react'

const API = import.meta.env.VITE_API_URL || '/api'

const ALGOS = [
  { key: 'md5',    label: 'MD5',     tagCls: 'text-red   bg-red/10   border-red/30',   tagText: 'Weak',        note: 'Never use for passwords' },
  { key: 'sha1',   label: 'SHA-1',   tagCls: 'text-red   bg-red/10   border-red/30',   tagText: 'Weak',        note: 'Deprecated' },
  { key: 'sha256', label: 'SHA-256', tagCls: 'text-amber bg-amber/10 border-amber/30', tagText: 'Moderate',    note: 'OK for data integrity' },
  { key: 'sha512', label: 'SHA-512', tagCls: 'text-amber bg-amber/10 border-amber/30', tagText: 'Moderate',    note: 'Stronger but still fast' },
  { key: 'bcrypt', label: 'bcrypt',  tagCls: 'text-green bg-green/10 border-green/30', tagText: 'Recommended', note: 'Slow by design — use this' },
]

function trunc(s = '', n = 56) { return s.length > n ? s.slice(0, n) + '…' : s }

export default function HashEngine() {
  const [pw, setPw]           = useState('')
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [copied, setCopied]   = useState(null)

  async function generate() {
    if (!pw.trim()) return
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${API}/hash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      setResult(await res.json())
    } catch (e) { setError(e.message) }
    finally     { setLoading(false)   }
  }

  function copy(key, val) {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="font-mono text-sm text-green tracking-wider uppercase mb-1">// phase_02</div>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
          Hash <span className="text-green">Engine</span>
        </h1>
        <p className="text-text2 text-base mt-2 max-w-2xl">
          Generates MD5, SHA-1, SHA-256, SHA-512, and bcrypt hashes. Demonstrates why salting defeats rainbow table attacks.
        </p>
      </div>

      {/* Input card */}
      <div className="bg-bg2/80 backdrop-blur-sm border border-border1 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex items-center gap-2 mb-5 font-mono text-sm text-green tracking-wider uppercase">
          <span className="w-1 h-4 bg-green rounded-sm inline-block" />
          input terminal
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="enter password to hash..."
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generate()}
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-bg3 border border-border2 rounded-lg px-4 py-3 text-text1 font-mono text-base outline-none focus:border-green focus:ring-2 focus:ring-green/20 placeholder-text3 transition-all"
          />
          <button
            onClick={generate}
            disabled={loading || !pw.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green text-bg font-bold text-base tracking-wide hover:bg-green-dim transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading
              ? <span className="w-5 h-5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
              : <i className="fa-solid fa-lock" />
            }
            {loading ? 'Hashing...' : 'Generate Hashes'}
          </button>
        </div>
        {error && (
          <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-red/10 border border-red/30 rounded-lg font-mono text-sm text-red">
            <i className="fa-solid fa-triangle-exclamation" />
            {error} — is the backend running?
          </div>
        )}
      </div>

      {result ? (
        <>
          {/* Hash output */}
          <div className="bg-bg2/80 backdrop-blur-sm border border-border1 rounded-2xl p-6 mb-6 shadow-xl animate-glow-pulse">
            <div className="flex items-center gap-2 mb-5 font-mono text-sm text-green tracking-wider uppercase">
              <span className="w-1 h-4 bg-green rounded-sm inline-block" />
              hash output
            </div>
            <div className="divide-y divide-border1">
              {ALGOS.map(a => (
                <div key={a.key} className="flex flex-wrap items-center gap-3 py-3">
                  <span className="font-mono text-sm text-text2 tracking-wide uppercase w-20 flex-shrink-0">{a.label}</span>
                  <span className="font-mono text-sm text-text1 flex-1 break-all">{trunc(result[a.key] || '')}</span>
                  <span className={`font-mono text-xs px-2 py-0.5 rounded border tracking-wide uppercase flex-shrink-0 ${a.tagCls}`}>{a.tagText}</span>
                  <button
                    onClick={() => copy(a.key, result[a.key] || '')}
                    className="text-text3 hover:text-green transition-colors text-base flex-shrink-0 w-6 text-center"
                    title="Copy"
                  >
                    <i className={`fa-solid ${copied === a.key ? 'fa-check text-green' : 'fa-copy'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Salting demo */}
          <div className="bg-bg2/80 backdrop-blur-sm border border-border1 rounded-2xl p-6 mb-6 shadow-xl">
            <div className="flex items-center gap-2 mb-5 font-mono text-sm text-green tracking-wider uppercase">
              <span className="w-1 h-4 bg-green rounded-sm inline-block" />
              salting demo — same password, different hash
            </div>
            <div className="font-mono text-sm text-text2 leading-relaxed bg-bg3 rounded-xl px-4 py-3 border border-border1">
              <div><span className="text-text3">run_1 →</span> <span className="text-text1 break-all">{trunc(result.salted_1 || '', 70)}</span></div>
              <div className="mt-2"><span className="text-text3">run_2 →</span> <span className="text-text1 break-all">{trunc(result.salted_2 || '', 70)}</span></div>
              <div className="mt-3 text-green text-xs tracking-wide">
                <i className="fa-solid fa-circle-check mr-1.5" />
                same password · different hash · salt defeats rainbow tables
              </div>
            </div>
          </div>

          {/* Verdict */}
          <div className="bg-bg2/80 backdrop-blur-sm border border-border1 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-5 font-mono text-sm text-green tracking-wider uppercase">
              <span className="w-1 h-4 bg-green rounded-sm inline-block" />
              algorithm verdict
            </div>
            <div className="flex flex-col gap-2">
              {ALGOS.map(a => (
                <div key={a.key} className="flex justify-between items-center px-4 py-3 bg-bg3 border border-border1 rounded-xl">
                  <span className="font-mono text-sm text-text2 tracking-wide uppercase">{a.label}</span>
                  <span className="text-sm text-text3">{a.note}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : !loading && (
        <div className="bg-bg2/80 backdrop-blur-sm border border-border1 rounded-2xl p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12 text-text3 gap-4">
            <i className="fa-solid fa-lock text-5xl opacity-50" />
            <div className="text-lg text-text2 font-semibold">Hash engine idle</div>
            <div className="font-mono text-sm">enter a password to generate all hash formats</div>
          </div>
        </div>
      )}
    </div>
  )
}