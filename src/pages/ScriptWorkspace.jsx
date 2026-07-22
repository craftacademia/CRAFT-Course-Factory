import React, { useState } from 'react';
import ScriptUploader from '../components/ScriptUploader';

export default function ScriptWorkspace() {
  const [parsedData, setParsedData] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleScriptParsed = (data, filename) => {
    setParsedData(data);
    setFileName(filename);
  };

  return (
    <div className="workspace-container">
      <h2>Script Workspace</h2>
      
      {!parsedData ? (
        <ScriptUploader onScriptParsed={handleScriptParsed} />
      ) : (
        <div className="parsed-results">
          <div className="workspace-header">
            <h3>Loaded: {fileName}</h3>
            <button onClick={() => setParsedData(null)}>Upload Another</button>
          </div>

          <div className="summary-stats">
            <div><strong>Screens:</strong> {parsedData.screens?.length || 0}</div>
            <div><strong>Characters:</strong> {parsedData.characters?.length || 0}</div>
            <div><strong>Locations:</strong> {parsedData.locations?.length || 0}</div>
          </div>

          <div className="screens-list">
            <h4>Parsed Screens</h4>
            {parsedData.screens.map((screen) => (
              <div key={screen.id} className="screen-card">
                <h5>{screen.id} — <span className="type-badge">{screen.type}</span></h5>
                <p><strong>Location:</strong> {screen.location || 'N/A'}</p>
                <p><strong>Lines:</strong> {screen.lines.length} | <strong>Branch Points:</strong> {screen.branchPoints.length}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
