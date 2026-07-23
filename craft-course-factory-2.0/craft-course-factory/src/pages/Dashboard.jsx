import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export const Dashboard = () => {
  const { token, user } = useAuth()
  const [file, setFile] = useState(null)
  const [parsedData, setParsedData] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    setStatus('Uploading and processing Word document...')

    try {
      const res = await fetch('/api/courses/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Upload failed')

      setStatus('Processing complete!')
      setParsedData(data.parsedContent)
    } catch (err) {
      setStatus(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container dashboard">
      <header className="dashboard-header">
        <h1>Course Factory Workspace</h1>
        <p>Welcome back, <strong>{user?.name}</strong>!</p>
      </header>

      <section className="card upload-card">
        <h3>Upload Course Document</h3>
        <p className="subtitle">Select a <code>.docx</code> file to parse into HTML course modules.</p>
        
        <form onSubmit={handleUpload} className="upload-form">
          <input
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={!file || loading}>
            {loading ? 'Processing...' : 'Upload & Parse'}
          </button>
        </form>

        {status && <div className="status-box">{status}</div>}
      </section>

      {parsedData && (
        <section className="card output-card">
          <h3>Parsed Course HTML Output</h3>
          <div
            className="parsed-preview"
            dangerouslySetInnerHTML={{ __html: parsedData }}
          />
        </section>
      )}
    </div>
  )
}

export default Dashboard
