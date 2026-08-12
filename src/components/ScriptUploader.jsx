import React, { useState } from 'react';
import axios from 'axios';

const DEFAULT_CONFIG = {
  back:       true,
  pause:      true,
  replay:     true,
  speed:      true,
  volume:     true,
  fullscreen: true,
  passScore:  70,
};

export default function ScriptUploader({ onScriptParsed }) {
  const [file, setFile]                   = useState(null);
  const [images, setImages]               = useState([]);
  const [narration, setNarration]         = useState([]);
  const [dialogueAudio, setDialogueAudio] = useState([]);
  const [backgroundMusic, setBackgroundMusic] = useState([]);
  const [logo, setLogo]                   = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [config, setConfig]               = useState(DEFAULT_CONFIG);
  const [courseTitle, setCourseTitle]      = useState('');

  const toggleConfig = (key) => setConfig(prev => ({ ...prev, [key]: !prev[key] }));

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please select a .docx file to upload.'); return; }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('script', file);
      formData.append('courseConfig', JSON.stringify(config));
      if (courseTitle) formData.append('courseTitle', courseTitle);
      images.forEach((img) => formData.append('images', img));
      narration.forEach((a) => formData.append('narration', a));
      dialogueAudio.forEach((a) => formData.append('dialogueAudio', a));
      backgroundMusic.forEach((a) => formData.append('backgroundMusic', a));
      if (logo) formData.append('logo', logo);

      const response = await axios.post('/api/build', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        onScriptParsed(response.data, file.name);
      } else {
        setError(response.data.error || 'Failed to build course.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Server error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  const btnStyle = (active) => ({
    padding: '6px 14px',
    borderRadius: '20px',
    border: '2px solid ' + (active ? '#d71920' : '#ccc'),
    background: active ? '#d71920' : '#fff',
    color: active ? '#fff' : '#555',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
  });

  return (
    <div className="upload-card">
      <h3>Upload Course Script</h3>

      {/* Course Config Panel */}
      <div style={{background:'#f8f8f8',border:'1px solid #eee',borderRadius:'12px',padding:'16px',marginBottom:'20px'}}>
        <div style={{fontWeight:'700',color:'#222',marginBottom:'12px',fontSize:'14px'}}>Player Controls</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginBottom:'12px'}}>
          {[
            {key:'back',      label:'Back'},
            {key:'pause',     label:'Pause'},
            {key:'replay',    label:'Replay'},
            {key:'speed',     label:'Speed'},
            {key:'volume',    label:'Volume'},
            {key:'fullscreen',label:'Fullscreen'},
          ].map(({key, label}) => (
            <button key={key} style={btnStyle(config[key])} onClick={() => toggleConfig(key)} type="button">
              {config[key] ? '✓ ' : ''}{label}
            </button>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'10px',fontSize:'13px',color:'#555'}}>
          <label style={{fontWeight:'600'}}>Pass Score:</label>
          <input
            type="number" min="0" max="100" value={config.passScore}
            onChange={e => setConfig(prev => ({...prev, passScore: Number(e.target.value)}))}
            style={{width:'60px',padding:'4px 8px',borderRadius:'6px',border:'1px solid #ccc'}}
          />
          <span>%</span>
        </div>
      </div>

      <div style={{marginBottom:'16px'}}>
        <label style={{display:'block',fontWeight:'600',fontSize:'14px',color:'#222',marginBottom:'6px'}}>
          Course Title
        </label>
        <input
          type="text"
          placeholder="e.g. Document & Eligibility"
          value={courseTitle}
          onChange={e => setCourseTitle(e.target.value)}
          style={{width:'100%',padding:'8px 12px',borderRadius:'8px',border:'1px solid #ccc',fontSize:'14px',boxSizing:'border-box'}}
        />
      </div>

      <form onSubmit={handleUpload}>
        <label>Script (.docx) — required
          <input type="file" accept=".docx" onChange={handleFileChange} disabled={loading}/>
        </label>
        <label>Images (characters, locations, props, scenes)
          <input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files || []))} disabled={loading}/>
        </label>
        <label>Narration Audio
          <input type="file" accept="audio/*" multiple onChange={(e) => setNarration(Array.from(e.target.files || []))} disabled={loading}/>
        </label>
        <label>Dialogue Voice-Over Audio
          <input type="file" accept="audio/*" multiple onChange={(e) => setDialogueAudio(Array.from(e.target.files || []))} disabled={loading}/>
        </label>
        <label>Background Music
          <input type="file" accept="audio/*" multiple onChange={(e) => setBackgroundMusic(Array.from(e.target.files || []))} disabled={loading}/>
        </label>
        <label>Logo (optional)
          <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} disabled={loading}/>
        </label>
        <button type="submit" disabled={!file || loading}>
          {loading ? 'Uploading & Building...' : 'Build Course'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
