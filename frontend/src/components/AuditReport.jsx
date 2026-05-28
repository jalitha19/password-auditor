import React, { useState } from 'react'

const API = import.meta.env.VITE_API_URL || '/api'

const RISK_STYLES = {
  CRITICAL: 'text-red   bg-red/10   border-red/30',
  HIGH:     'text-[#ff6432] bg-[#ff6432]/10 border-[#ff6432]/30',
  MEDIUM:   'text-amber  bg-amber/10  border-amber/30',
  LOW:      'text-green  bg-green/10  border-green/20',
  NONE:     'text-blue   bg-blue/10   border-blue/20',
}

function RiskBadge({ risk }) {
  return (
    <span className={`font-mono text-xs font-bold px-3 py-1 rounded-full border tracking-wide uppercase ${RISK_STYLES[risk] || RISK_STYLES.NONE}`}>
      {risk}
    </span>
  )
}

export default function AuditReport() {
  const [file, setFile]         = useState(null)
  const [drag, setDrag]         = useState(false)
  const [results, setResults]   = useState(null)
  const [summary, setSummary]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  async function runAudit(f) {
    if (!f) return
    setLoading(true); setError(null); setResults(null); setSummary(null)
    try {
      const form = new FormData()
      form.append('file', f)
      const res = await fetch(`${API}/audit`, { method: 'POST', body: form })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setResults(data.results)
      setSummary(data.summary)
    } catch (e) { setError(e.message) }
    finally     { setLoading(false)   }
  }

  function handleFile(f) { setFile(f); runAudit(f) }

  function handleDrop(e) {
    e.preventDefault(); setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="font-mono text-sm text-green tracking-wider uppercase mb-1">// phase_03</div>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
          Audit <span className="text-green">Report</span>
        </h1>
        <p className="text-text2 text-base mt-2 max-w-2xl">
          Upload a <code className="font-mono bg-surface px-2 py-0.5 rounded text-green text-sm">username:password</code> file.
          Each password is scored, hashed, tested against the wordlist, and risk‑classified.
        </p>
      </div>

      {/* Upload card */}
      <div className="bg-bg2/80 backdrop-blur-sm border border-border1 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex items-center gap-2 mb-5 font-mono text-sm text-green tracking-wider uppercase">
          <span className="w-1 h-4 bg-green rounded-sm inline-block" />
          upload password list
        </div>

        <div
          className={`relative border border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${drag ? 'border-green bg-green/10' : 'border-border2 hover:border-green hover:bg-green/5'}`}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".txt"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onChange={e => { const f = e.target.files[0]; if (f) handleFile(f) }}
          />
          <i className="fa-solid fa-folder-open text-4xl text-text3 mb-3 block" />
          <div className="text-base text-text2">
            {file
              ? <span className="text-green"><i className="fa-solid fa-circle-check mr-2" />{file.name}</span>
              : 'Drop passwords.txt here or click to browse'
            }
          </div>
          <div className="font-mono text-xs text-text3 mt-2">format: username:password — one per line</div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-red/10 border border-red/30 rounded-lg font-mono text-sm text-red">
            <i className="fa-solid fa-triangle-exclamation" />
            {error} — is the backend running?
          </div>
        )}

        {loading && (
          <div className="mt-4 flex items-center gap-3 font-mono text-sm text-text2">
            <span className="w-5 h-5 border-2 border-border2 border-t-green rounded-full animate-spin flex-shrink-0" />
            Running audit — checking strength, hashing, running wordlist attack...
          </div>
        )}
      </div>

      {/* Summary metrics */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-bg2/80 backdrop-blur-sm border border-border1 rounded-2xl px-6 py-5 shadow-xl">
            <div className="font-mono text-xs text-text3 tracking-wider uppercase mb-1">Accounts audited</div>
            <div className="font-mono text-4xl font-bold text-text1">{summary.total}</div>
          </div>
          <div className={`bg-bg2/80 backdrop-blur-sm rounded-2xl px-6 py-5 border shadow-xl ${summary.cracked > 0 ? 'border-red/30 bg-red/4' : 'border-green/20 bg-green/3'}`}>
            <div className="font-mono text-xs text-text3 tracking-wider uppercase mb-1">Cracked</div>
            <div className={`font-mono text-4xl font-bold ${summary.cracked > 0 ? 'text-red' : 'text-green'}`}>{summary.cracked}</div>
          </div>
          <div className="bg-bg2/80 backdrop-blur-sm border border-green/20 bg-green/3 rounded-2xl px-6 py-5 shadow-xl">
            <div className="font-mono text-xs text-text3 tracking-wider uppercase mb-1">Avg entropy</div>
            <div className="font-mono text-4xl font-bold text-green">{summary.avg_entropy}<span className="text-base text-text3 ml-1">bits</span></div>
          </div>
        </div>
      )}

      {/* Results table */}
      {results && results.length > 0 && (
        <div className="bg-bg2/80 backdrop-blur-sm border border-border1 rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-2 mb-5 font-mono text-sm text-green tracking-wider uppercase">
            <span className="w-1 h-4 bg-green rounded-sm inline-block" />
            per-account results
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border1 bg-bg3">
                  {['User', 'Strength', 'Entropy', 'Risk', 'Cracked as'].map(h => (
                    <th key={h} className="font-mono text-xs text-text3 tracking-wider uppercase text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-b border-border1 hover:bg-surface transition-colors">
                    <td className="font-mono text-sm px-4 py-3 text-text1">{r.username}</td>
                    <td className="px-4 py-3 text-text2">{r.strength}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-text1">{r.entropy} bits</span>
                      <div className="h-1.5 bg-surface2 rounded-full mt-1.5 w-24 overflow-hidden">
                        <div
                          className="h-full bg-green rounded-full entropy-fill"
                          style={{ width: `${Math.min((r.entropy / 150) * 100, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3"><RiskBadge risk={r.risk} /></td>
                    <td className="px-4 py-3">
                      {r.cracked
                        ? <span className="font-mono text-xs text-red bg-red/10 border border-red/25 rounded-full px-2 py-0.5">'{r.cracked_as}'</span>
                        : <span className="text-text3 font-mono text-xs">—</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {summary?.cracked > 0 && (
            <div className="mt-6 px-5 py-4 bg-red/6 border border-red/30 border-l-4 border-l-red rounded-xl">
              <div className="font-mono text-sm text-red mb-2 flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation" /> CRITICAL FINDING
              </div>
              <div className="text-sm text-text2">
                {summary.cracked} of {summary.total} passwords ({Math.round(summary.cracked / summary.total * 100)}%) cracked using a sample wordlist.
                With rockyou.txt (14M words) this number would be significantly higher.
                Enforce password policy and migrate to bcrypt immediately.
              </div>
            </div>
          )}
        </div>
      )}

      {!results && !loading && (
        <div className="bg-bg2/80 backdrop-blur-sm border border-border1 rounded-2xl p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12 text-text3 gap-4">
            <i className="fa-solid fa-clipboard-list text-5xl opacity-50" />
            <div className="text-lg text-text2 font-semibold">No report generated</div>
            <div className="font-mono text-sm">upload a password file to run the full audit</div>
          </div>
        </div>
      )}
    </div>
  )
}