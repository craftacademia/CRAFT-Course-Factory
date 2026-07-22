import React, { useState } from 'react';
import ScriptUploader from '../components/ScriptUploader';
import ScriptViewer from '../components/ScriptViewer';

export default function ScriptWorkspace() {
  const [parsedResult, setParsedResult] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Script Studio</h1>
          <p className="text-sm text-gray-500">
            Upload .docx scripts to inspect screen flows, characters, voiceover IDs, and decision trees.
          </p>
        </header>

        {!parsedResult ? (
          <ScriptUploader onScriptParsed={(res) => setParsedResult(res)} />
        ) : (
          <ScriptViewer
            scriptData={parsedResult.data}
            filename={parsedResult.filename}
            onReset={() => setParsedResult(null)}
          />
        )}
      </div>
    </div>
  );
}
