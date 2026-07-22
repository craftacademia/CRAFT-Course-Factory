import React, { useState } from 'react';

export default function ScriptUploader({ onScriptParsed }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    if (!file || !file.name.endsWith('.docx')) {
      setError('Please select a valid .docx file');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('scriptFile', file);

    try {
      const response = await fetch('/api/script/upload', {
        method: 'POST',
        body: formData,
      });

      const res = await response.json();
      if (res.success) {
        onScriptParsed(res);
      } else {
        setError(res.error || 'Parsing failed');
      }
    } catch (err) {
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-white hover:border-indigo-500 transition-colors">
      <input
        type="file"
        id="docx-upload"
        accept=".docx"
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files[0])}
      />
      <label htmlFor="docx-upload" className="cursor-pointer flex flex-col items-center">
        <div className="w-12 h-12 mb-3 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl">
          📄
        </div>
        <span className="text-lg font-semibold text-gray-800">
          {loading ? 'Parsing Document...' : 'Upload Script (.docx)'}
        </span>
        <span className="text-sm text-gray-500 mt-1">
          Drag & drop or click to select your production script
        </span>
      </label>
      {error && <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
}
