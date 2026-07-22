import React, { useState } from 'react';

export default function ScriptViewer({ scriptData, filename, onReset }) {
  const { characters, locations, screens } = scriptData;
  const [selectedScreenId, setSelectedScreenId] = useState(screens[0]?.id || null);

  const activeScreen = screens.find((s) => s.id === selectedScreenId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-900 text-white p-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>🎬</span> {filename}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {screens.length} Screens | {characters.length} Characters | {locations.length} Locations
          </p>
        </div>
        <button
          onClick={onReset}
          className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-md transition"
        >
          Upload New File
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Characters ({characters.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {characters.map((c) => (
              <span key={c.id} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-md border border-indigo-100">
                {c.id} {c.name && c.name !== c.id ? `(${c.name})` : ''}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Locations ({locations.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {locations.map((loc) => (
              <span key={loc.id || loc.name} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-medium text-xs rounded-md border border-emerald-100">
                📍 {loc.name}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Screen Types
          </h3>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-medium text-xs rounded-md">
              Static: {screens.filter((s) => s.type !== 'BRANCHING').length}
            </span>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-medium text-xs rounded-md">
              Branching: {screens.filter((s) => s.type === 'BRANCHING').length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 px-1">Screens Timeline</h3>
          <div className="space-y-1">
            {screens.map((scr) => (
              <button
                key={scr.id}
                onClick={() => setSelectedScreenId(scr.id)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-all flex justify-between items-center ${
                  selectedScreenId === scr.id
                    ? 'bg-indigo-600 text-white shadow-md font-semibold'
                    : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
                }`}
              >
                <div>
                  <div>{scr.id}</div>
                  <div className={`text-xs ${selectedScreenId === scr.id ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {scr.location || 'No Location'}
                  </div>
                </div>
                {scr.type === 'BRANCHING' && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    selectedScreenId === scr.id ? 'bg-amber-400 text-amber-950' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Branch
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          {activeScreen ? (
            <>
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">{activeScreen.id}</h2>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 uppercase font-semibold">
                      {activeScreen.type || 'STATIC'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    📍 <span className="font-medium text-gray-700">{activeScreen.location || 'Unspecified Location'}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Dialogue & Narration ({activeScreen.lines?.length || 0})
                </h4>

                {activeScreen.lines?.length > 0 ? (
                  <div className="space-y-3">
                    {activeScreen.lines.map((line, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-indigo-700">{line.speaker}</span>
                          <div className="flex items-center gap-2">
                            {line.expression && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded font-mono">
                                [{line.expression}]
                              </span>
                            )}
                            {line.voId && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-mono">
                                VO: {line.voId}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-800 leading-relaxed pt-1">{line.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No dialogue lines found for this screen.</p>
                )}
              </div>

              {activeScreen.branchPoints?.length > 0 && (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <h4 className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                    ⚡ Branching Decision Points
                  </h4>
                  {activeScreen.branchPoints.map((bp) => (
                    <div key={bp.id} className="p-4 bg-amber-50/50 rounded-lg border border-amber-200/60 space-y-3">
                      <div className="text-xs font-bold text-amber-900">Branch Point: {bp.id}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {bp.options.map((opt) => (
                          <div key={opt.letter} className="p-3 bg-white rounded border border-amber-200 shadow-xs space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-amber-800">Option {opt.letter}</span>
                              <span className="text-xs font-mono bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                                Score: {opt.score} ➔ Next: {opt.next}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700">{opt.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">Select a screen from the timeline to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}
