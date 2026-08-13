base = '/Users/debraj/projects/craft-course-factory 2.0 copy'

# ── 1. Add courseTitle state and field to ScriptUploader.jsx ──────────────────
uploader_path = base + '/src/components/ScriptUploader.jsx'

with open(uploader_path) as f:
    content = f.read()

# Add state
old1 = "  const [config, setConfig]               = useState(DEFAULT_CONFIG);"
new1 = ("  const [config, setConfig]               = useState(DEFAULT_CONFIG);\n"
        "  const [courseTitle, setCourseTitle]      = useState('');")
assert content.count(old1) == 1
content = content.replace(old1, new1)

# Append to formData
old2 = "      formData.append('courseConfig', JSON.stringify(config));"
new2 = ("      formData.append('courseConfig', JSON.stringify(config));\n"
        "      if (courseTitle) formData.append('courseTitle', courseTitle);")
assert content.count(old2) == 1
content = content.replace(old2, new2)

# Add input field before the Script upload label
old3 = "      <form onSubmit={handleUpload}>"
new3 = """      <div style={{marginBottom:'16px'}}>
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

      <form onSubmit={handleUpload}>"""
assert content.count(old3) == 1
content = content.replace(old3, new3)

with open(uploader_path, 'w') as f:
    f.write(content)
print('1. Course Title field added to ScriptUploader.jsx')


# ── 2. Inject courseTitle into PIR in server.js ───────────────────────────────
server_path = base + '/src/server.js'

with open(server_path) as f:
    server = f.read()

if 'courseTitle' in server:
    print('2. courseTitle already in server.js — skipping')
else:
    old4 = "            const courseConfig = req.body?.courseConfig;"
    new4 = ("            const courseTitle = req.body?.courseTitle;\n"
            "            if (courseTitle && pir && pir.course) {\n"
            "                pir.course.title = courseTitle;\n"
            "            }\n\n"
            "            const courseConfig = req.body?.courseConfig;")
    assert server.count(old4) == 1
    server = server.replace(old4, new4)

    with open(server_path, 'w') as f:
        f.write(server)
    print('2. courseTitle injected into PIR in server.js')

print('\nDone — rebuild UI (Pane-2 hot reloads), then rebuild course with title filled in')
