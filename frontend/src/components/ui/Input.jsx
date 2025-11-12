import React from 'react'

export default function Input({ label, id, type='text', ...props }){
  return (
    <label className="block text-sm">
      {label && <div className="text-xs text-gray-400 mb-1">{label}</div>}
      <input id={id} type={type} className="w-full p-2 border rounded-lg bg-white/5" {...props} />
    </label>
  )
}
