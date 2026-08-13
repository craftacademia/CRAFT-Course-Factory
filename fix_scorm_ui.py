path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/pages/ScriptWorkspace.jsx'

with open(path) as f:
    content = f.read()

# Add exporting state after fileName state
old1 = "  const [fileName, setFileName] = useState('');"
new1 = "  const [fileName, setFileName] = useState('');\n  const [exporting, setExporting] = useState(null);"
assert content.count(old1) == 1
content = content.replace(old1, new1)

# Add exportScorm function before return
old2 = "  return ("
new2 = """  const exportScorm = async (version) => {
    setExporting(version);
    try {
      const res = await fetch('/api/scorm/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildId: buildResult.buildId, version, title: fileName.replace(/\\.[^.]+$/, '') })
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

  return ("""
assert content.count(old2) == 1
content = content.replace(old2, new2)

# Add buttons after preview link
old3 = "        </div>\n      )}\n    </div>\n  );\n}"
new3 = """          {buildResult.buildId && (
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
}"""
assert content.count(old3) == 1, f'anchor3 count: {content.count(old3)}'
content = content.replace(old3, new3)

with open(path, 'w') as f:
    f.write(content)

print('Done')
