import React, { useEffect, useState } from 'react'

export default function ThemeToggle(){
  const [dark, setDark] = useState(() => typeof window !== 'undefined' ? (localStorage.getItem('theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches) : false)

  useEffect(()=>{
    const root = document.documentElement
    if(dark){ root.classList.add('dark'); localStorage.setItem('theme','dark') }
    else { root.classList.remove('dark'); localStorage.setItem('theme','light') }
  },[dark])

  return (
    <button aria-label="Toggle theme" onClick={()=>setDark(d=>!d)} className="p-2 rounded-lg bg-white/10 glass">
      {dark ? <span className="text-sm">🌙</span> : <span className="text-sm">☀️</span>} 
    </button>
  )
}
