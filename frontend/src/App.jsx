import React, { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import StrengthChecker from './components/StrengthChecker.jsx'
import HashEngine from './components/HashEngine.jsx'
import AuditReport from './components/AuditReport.jsx'

const PAGES = {
  strength: <StrengthChecker />,
  hash:     <HashEngine />,
  audit:    <AuditReport />,
}

export default function App() {
  const [page, setPage]       = useState('strength')
  const [menuOpen, setMenuOpen] = useState(false)

  function navigate(id) {
    setPage(id)
    setMenuOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-bg text-text1">

      {/* ── Mobile overlay backdrop ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <div className={`
        fixed top-0 left-0 h-full z-30 transition-transform duration-300
        md:static md:translate-x-0 md:flex md:flex-shrink-0
        ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar active={page} onNav={navigate} />
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-bg2 border-b border-border1 sticky top-0 z-10">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="text-text2 hover:text-green transition-colors p-1"
          >
            <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`} />
          </button>
          <span className="font-extrabold text-[16px] tracking-tight">
            Pass<span className="text-green">Audit</span>
          </span>
        </div>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-8 max-w-3xl w-full mx-auto">
          {PAGES[page]}
        </main>
      </div>
    </div>
  )
}