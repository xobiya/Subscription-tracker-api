import React from 'react'

export default function FAB({ onClick, title = 'Add' }){
  return (
    <button onClick={onClick} aria-label={title} className="fixed right-6 bottom-6 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
      +
    </button>
  )
}
