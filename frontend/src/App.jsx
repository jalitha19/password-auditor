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
  const [page, setPage] = useState('strength')
  return (
    <div 
      className="flex min-h-screen bg-bg text-text1"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
      }}
    >
      {/* Dark overlay inside same div */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(7, 11, 15, 0.85)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <Sidebar active={page} onNav={setPage} />
      <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-x-auto relative z-10">
        <div className="max-w-7xl mx-auto">
          {PAGES[page]}
        </div>
      </main>
    </div>
  )
}