import React from 'react'

const NAV = [
  { id: 'strength', label: 'Strength Checker', icon: 'fa-bolt',         tag: 'PH1' },
  { id: 'hash',     label: 'Hash Engine',      icon: 'fa-lock',         tag: 'PH2' },
  { id: 'audit',    label: 'Audit Report',     icon: 'fa-clipboard-list', tag: 'PH4' },
]

export default function Sidebar({ active, onNav }) {
  return (
    <aside className="w-52 h-full bg-bg2 border-r border-border1 flex flex-col py-6">

      {/* Logo */}
      <div className="px-5 pb-6 border-b border-border1 mb-5">
        <div className="font-mono text-[11px] text-green tracking-widest uppercase mb-1">
          // sec-tool
        </div>
        <div className="text-[18px] font-extrabold tracking-tight leading-tight">
          Pass<span className="text-green">Audit</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13px] font-medium border transition-all duration-150 cursor-pointer w-full text-left
              ${active === item.id
                ? 'text-green bg-green/10 border-green/20'
                : 'text-text2 bg-transparent border-transparent hover:text-text1 hover:bg-surface hover:border-border1'
              }`}
          >
            <i className={`fa-solid ${item.icon} w-4 text-center text-[14px]`} />
            <span className="flex-1">{item.label}</span>
            <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded tracking-wide
              ${active === item.id ? 'bg-green/10 text-green/70' : 'bg-surface2 text-text3'}`}>
              {item.tag}
            </span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 pt-4 border-t border-border1">
        <div className="font-mono text-[10px] text-text3 tracking-wide">v1.0.0 · edu project</div>
      </div>
    </aside>
  )
}