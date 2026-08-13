base = '/Users/debraj/projects/craft-course-factory 2.0 copy'

# ── 1. Update ScriptUploader.jsx ──────────────────────────────────────────────

uploader_path = base + '/src/components/ScriptUploader.jsx'

new_uploader = """import React, { useState } from 'react';
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
"""

with open(uploader_path, 'w') as f:
    f.write(new_uploader)
print('1. ScriptUploader.jsx updated with config panel')


# ── 2. Update server.js to read courseConfig from formData ────────────────────

server_path = base + '/src/server.js'

with open(server_path) as f:
    server = f.read()

if 'courseConfig' in server:
    print('2. server.js already has courseConfig — skipping')
else:
    # Inject config into the PIR after it's compiled
    old = """            res.json({

                buildId,

                output:
                    buildDir,

                previewUrl:
                    `/output/${buildId}/html5/index.html`,

                success:true

            });"""

    new = """            // Inject course config from UI into PIR
            const courseConfig = req.body?.courseConfig || req.body?.fields?.courseConfig;
            if (courseConfig) {
                try {
                    const cfg = typeof courseConfig === 'string' ? JSON.parse(courseConfig) : courseConfig;
                    if (pir && typeof pir === 'object' && pir.course) {
                        pir.course.config = cfg;
                        pir.course.passScore = cfg.passScore || 70;
                    }
                } catch(e) { console.warn('Could not parse courseConfig:', e.message); }
            }

            res.json({

                buildId,

                output:
                    buildDir,

                previewUrl:
                    `/output/${buildId}/html5/index.html`,

                success:true

            });"""

    assert server.count(old) == 1, f'server anchor count: {server.count(old)}'
    server = server.replace(old, new)

    with open(server_path, 'w') as f:
        f.write(server)
    print('2. server.js updated to inject courseConfig into PIR')


# ── 3. Remove debug console.log from pageBuilder.js ──────────────────────────

pb_path = base + '/src/providers/presentation/builders/pageBuilder.js'

with open(pb_path) as f:
    pb = f.read()

if '[PAGEBUILDER]' in pb:
    import re
    pb = re.sub(r'\s*console\.log\(\s*"\[PAGEBUILDER\][^"]*"[^)]*\);', '', pb)
    with open(pb_path, 'w') as f:
        f.write(pb)
    print('3. Removed debug console.log from pageBuilder.js')
else:
    print('3. No debug log found — skipping')


print('\nDone — restart Pane-1, rebuild, check window.PIR.course.config in console')
