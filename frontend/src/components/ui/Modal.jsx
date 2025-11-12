import React from 'react'

export default function Modal({ open, onClose, title, children }){
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full max-w-2xl p-6 transition-transform transform-gpu">
        <div className="glass p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} aria-label="Close" className="text-gray-400">✕</button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}
