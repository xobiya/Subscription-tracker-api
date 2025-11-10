import React from 'react'

export default function Button({ children, className = '', ...props }){
  return (
    <button className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-md bg-gradient-to-r from-teal-400 to-violet-700 text-white ${className}`} {...props}>
      {children}
    </button>
  )
}
