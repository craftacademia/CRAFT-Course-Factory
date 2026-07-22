import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function ScriptUploader({ onScriptParsed }) {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a .docx file to upload.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('scriptFile', file);

const response = await axios.post('/api/courses/upload', formData, {      const response = await axios.post('/api/scripts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        onScriptParsed(response.data.data, response.data.filename);
      } else {
        setError(response.data.error || 'Failed to parse script.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Server error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-card">
      <h3>Upload Course Script</h3>
      <form onSubmit={handleUpload}>
        <input 
          type="file" 
          accept=".docx" 
          onChange={handleFileChange} 
          disabled={loading}
        />
        <button type="submit" disabled={!file || loading}>
          {loading ? 'Uploading & Parsing...' : 'Parse Script'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
