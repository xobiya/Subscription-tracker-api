import React from 'react'
import PropTypes from 'prop-types'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    if (this.props.onError) this.props.onError({ error, info })
    // Optionally log to remote service here
    // console.error(error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">Something went wrong.</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-700">{String(this.state.error)}</pre>
        </div>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.node,
  onError: PropTypes.func,
}

export default ErrorBoundary
