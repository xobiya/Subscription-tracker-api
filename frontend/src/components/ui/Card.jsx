import React from 'react'

export default function Card({ children, className='' }){
  return (
    <div className={`glass p-4 rounded-2xl shadow-md ${className}`}>{children}</div>
  )
}
