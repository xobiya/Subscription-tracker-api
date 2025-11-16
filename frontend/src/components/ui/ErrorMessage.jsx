import React from 'react'
import PropTypes from 'prop-types'

export default function ErrorMessage({ error, onRetry }) {
  if (!error) return null
  const message = typeof error === 'string' ? error : (error.message || JSON.stringify(error))
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="font-semibold">Error</div>
          <div className="text-sm mt-1">{message}</div>
        </div>
        {onRetry && (
          <button onClick={onRetry} className="text-sm bg-red-100 px-3 py-1 rounded">Retry</button>
        )}
      </div>
    </div>
  )
}

ErrorMessage.propTypes = {
  error: PropTypes.any,
  onRetry: PropTypes.func,
}
