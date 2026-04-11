import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('ErrorBoundary caught an error', error, errorInfo)
  }

  render() {
    const { error, errorInfo } = this.state

    if (error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-900 p-8">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-4">The app encountered an error and cannot render.</p>
          <details className="whitespace-pre-wrap bg-white p-4 rounded shadow border border-red-200">
            <summary className="font-semibold">Show error details</summary>
            <pre className="mt-2 text-sm">
              {error?.toString()}
              {errorInfo?.componentStack}
            </pre>
          </details>
        </div>
      )
    }

    return this.props.children
  }
}
