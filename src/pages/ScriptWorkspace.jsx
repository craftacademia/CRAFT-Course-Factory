import React, { useState } from 'react';
import ScriptUploader from '../components/ScriptUploader';

export default function ScriptWorkspace() {
  const [buildResult, setBuildResult] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleScriptParsed = (data, filename) => {
    setBuildResult(data);
    setFileName(filename);
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
        </div>
      )}
    </div>
  );
}
