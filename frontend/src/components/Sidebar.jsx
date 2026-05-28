import React from 'react'

const NAV = [
  { id: 'strength', label: 'Strength Checker', icon: 'fa-bolt',       tag: '01' },
  { id: 'hash',     label: 'Hash Engine',      icon: 'fa-lock',       tag: '02' },
  { id: 'audit',    label: 'Audit Report',     icon: 'fa-clipboard-list', tag: '03' },
]

export default function Sidebar({ active, onNav }) {
  return (
    <aside className="w-64 flex-shrink-0 bg-bg2 border-r border-border1 flex flex-col py-6 sticky top-0 h-screen backdrop-blur-sm">
      {/* Logo */}
      <div className="px-6 pb-6 border-b border-border1 mb-6">
        <div className="font-mono text-xs text-green tracking-wider uppercase mb-1">
          // sec-tool
        </div>
        <div className="text-2xl font-extrabold tracking-tight leading-tight">
          Pass<span className="text-green">Audit</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 flex flex-col gap-2">
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className={`group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer w-full text-left
              ${active === item.id
                ? 'text-green bg-green/10 border-l-4 border-green shadow-[0_0_8px_rgba(0,255,170,0.2)]'
                : 'text-text2 bg-transparent border-l-4 border-transparent hover:text-text1 hover:bg-surface hover:border-green/40'
              }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center text-base ${active === item.id ? 'text-green' : 'text-text3 group-hover:text-green'}`} />
            <span className="flex-1">{item.label}</span>
            <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full tracking-wide
              ${active === item.id ? 'bg-green/20 text-green' : 'bg-surface2 text-text3'}`}>
              {item.tag}
            </span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 pt-4 border-t border-border1">
        <div className="font-mono text-xs text-text3 tracking-wide">v2.0 · cyber‑audit</div>
      </div>
    </aside>
  )
}