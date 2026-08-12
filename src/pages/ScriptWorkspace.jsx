import React, { useState } from 'react';
import ScriptUploader from '../components/ScriptUploader';

export default function ScriptWorkspace() {
  const [buildResult, setBuildResult] = useState(null);
  const [fileName, setFileName] = useState('');
  const [exporting, setExporting] = useState(null);

  const handleScriptParsed = (data, filename) => {
    setBuildResult(data);
    setFileName(filename);
  };

  const exportScorm = async (version) => {
    setExporting(version);
    try {
      const res = await fetch('/api/scorm/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildId: buildResult.buildId, version, title: fileName.replace(/\.[^.]+$/, '') })
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `course-scorm-${version}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('SCORM export failed: ' + e.message);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="workspace-container">
      <h2>Script Workspace</h2>

      {!buildResult ? (
        <ScriptUploader onScriptParsed={handleScriptParsed} />
      ) : (
        <div className="build-result">
          <div className="workspace-header">
            <h3>Built: {fileName}</h3>
            <button onClick={() => setBuildResult(null)}>Upload Another</button>
          </div>

          <div className="summary-stats">
            <div><strong>Build ID:</strong> {buildResult.buildId}</div>
            <div><strong>Output Location:</strong> {buildResult.output}</div>
            <div><strong>Status:</strong> {buildResult.success ? 'Success' : 'Failed'}</div>
          </div>

          {buildResult.previewUrl && (
            <p className="preview-link">
              <a href={buildResult.previewUrl} target="_blank" rel="noopener noreferrer">
                Open Course Preview
              </a>
            </p>
          )}
          {buildResult.buildId && (
            <div style={{marginTop:'16px',display:'flex',gap:'12px'}}>
              <button onClick={() => exportScorm('1.2')} disabled={!!exporting}
                style={{padding:'10px 20px',background:'#d71920',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'700',cursor:'pointer'}}>
                {exporting === '1.2' ? 'Exporting...' : '⬇ Export SCORM 1.2'}
              </button>
              <button onClick={() => exportScorm('2004')} disabled={!!exporting}
                style={{padding:'10px 20px',background:'#1e3a8a',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'700',cursor:'pointer'}}>
                {exporting === '2004' ? 'Exporting...' : '⬇ Export SCORM 2004'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
