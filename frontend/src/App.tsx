import { useState } from 'react'
import './App.css'
import PreviewCard from './components/PreviewCard'
import { shortenUrl } from './api'

interface UrlResult {
  shortUrl: string
  meta: any
}

function App() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<UrlResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateUrl = (value: string) => {
    try {
      // require protocol
      const u = new URL(value)
      return u.protocol === 'http:' || u.protocol === 'https:'
    } catch (e) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (!validateUrl(url)) {
      setError('Invalid URL. Include http:// or https://')
      return
    }

    setLoading(true)
    try {
      const data = await shortenUrl(url)
      setResult(data)
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Failed to shorten')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard')
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="container">
      <h1>URL Shortener & Preview</h1>

      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
        />
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result">
          <div className="short-url">
            <a href={result.shortUrl} target="_blank" rel="noreferrer">
              {result.shortUrl}
            </a>
            <button className="copy" onClick={() => handleCopy(result.shortUrl)}>
              Copy
            </button>
          </div>

          <PreviewCard meta={result.meta} />
        </div>
      )}
    </div>
  )
}

export default App
