import React, { useState } from 'react';
import { 
  MINNA_TASKS, N5_CHAPTERS, TIME_SLOTS, 
  N3_GOI_P1, N3_GOI_P2, GOI_TASKS, N3_CHOUKAI, N3_BUNPOU, N3_DOKKAI 
} from './data/chapters';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    senseiName: '',
    level: 'N5',
    classType: 'Mon-Thur',
    classTime: TIME_SLOTS["Mon-Thur"][0],
    otherReason: ''
  });

  const [minnaProgress, setMinnaProgress] = useState({});
  const [kanjiProgress, setKanjiProgress] = useState({});
  const [n3Progress, setN3Progress] = useState({});

  // N5/N4 Toggle Logic
  const handleN5TaskToggle = (type, chapter, task) => {
    const setter = type === 'minna' ? setMinnaProgress : setKanjiProgress;
    setter(prev => ({
      ...prev,
      [chapter]: { ...prev[chapter], [task]: !prev[chapter]?.[task] }
    }));
  };

  const handleN5SelectAll = (type, chapter, tasks) => {
    const current = type === 'minna' ? minnaProgress : kanjiProgress;
    const setter = type === 'minna' ? setMinnaProgress : setKanjiProgress;
    const isAllSelected = tasks.every(t => current[chapter]?.[t]);
    const updated = {};
    tasks.forEach(t => { updated[t] = !isAllSelected; });
    setter(prev => ({ ...prev, [chapter]: updated }));
  };

  // N3 Toggle Logic
  const handleN3Toggle = (section, chapter, task) => {
    setN3Progress(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [chapter]: { ...prev[section]?.[chapter], [task]: !prev[section]?.[chapter]?.[task] }
      }
    }));
  };

  const handleN3SelectAll = (section, chapter, tasks) => {
    const isAllSelected = tasks.every(t => n3Progress[section]?.[chapter]?.[t]);
    const updated = {};
    tasks.forEach(t => { updated[t] = !isAllSelected; });
    setN3Progress(prev => ({
      ...prev,
      [section]: { ...prev[section], [chapter]: updated }
    }));
  };

  return (
    <div className="app-container">
      <div className="form-card">
        <h2 className="title">TGI Japanese Report Form</h2>

        {/* Basic Info */}
        <div className="section">
          <label>Sensei အမည်</label>
          <input className="input-field" placeholder="Sensei အမည် ထည့်ပါ" onChange={(e) => setFormData({...formData, senseiName: e.target.value})} />
          
          <div className="grid-2">
            <div>
              <label>Level ရွေးရန်</label>
              <select className="input-field" value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})}>
                <option value="N5">N5</option>
                <option value="N4">N4</option>
                <option value="N3">N3</option>
              </select>
            </div>
            <div>
              <label>အတန်းအမျိုးအစား</label>
              <select className="input-field" value={formData.classType} onChange={(e) => setFormData({...formData, classType: e.target.value, classTime: TIME_SLOTS[e.target.value][0]})}>
                <option value="Mon-Thur">Mon - Thur</option>
                <option value="Sat-Sun">Sat - Sun</option>
              </select>
            </div>
          </div>

          <label>အချိန်ရွေးရန်</label>
          <select className="input-field" value={formData.classTime} onChange={(e) => setFormData({...formData, classTime: e.target.value})}>
            {TIME_SLOTS[formData.classType].map(time => <option key={time} value={time}>{time}</option>)}
          </select>
        </div>

        {/* N5 / N4 Content */}
        {(formData.level === 'N5' || formData.level === 'N4') && (
          <div className="section">
            <h3>みんなの日本語</h3>
            <div className="chapter-list">
              {N5_CHAPTERS.map(ch => (
                <div key={ch} className="chapter-box">
                  <div className="chapter-row"><strong>Chapter {ch}</strong><button onClick={() => handleN5SelectAll('minna', ch, MINNA_TASKS)} className="btn-small">All</button></div>
                  <div className="task-grid">
                    {MINNA_TASKS.map(task => (
                      <label key={task} className="checkbox-label"><input type="checkbox" checked={minnaProgress[ch]?.[task] || false} onChange={() => handleN5TaskToggle('minna', ch, task)} /> {task}</label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* N3 Content */}
        {formData.level === 'N3' && (
          <div className="n3-section">
            <div className="section">
              <h3>N3 語彙 (1部 & 2部)</h3>
              <div className="chapter-list">
                <p><strong>[ 1部: 1-21課 ]</strong></p>
                {N3_GOI_P1.map(ch => (
                  <div key={`p1-${ch}`} className="chapter-box">
                    <div className="chapter-row"><strong>{ch} 課</strong><button onClick={() => handleN3SelectAll('goi1', ch, GOI_TASKS)} className="btn-small">All</button></div>
                    <div className="task-grid">
                      {GOI_TASKS.map(t => (
                        <label key={t} className="checkbox-label"><input type="checkbox" checked={n3Progress.goi1?.[ch]?.[t] || false} onChange={() => handleN3Toggle('goi1', ch, t)} /> {t}</label>
                      ))}
                    </div>
                  </div>
                ))}
                <p><strong>[ 2部: 1-8課 ]</strong></p>
                {N3_GOI_P2.map(ch => (
                  <div key={`p2-${ch}`} className="chapter-box">
                    <div className="chapter-row"><strong>{ch} 課</strong><button onClick={() => handleN3SelectAll('goi2', ch, GOI_TASKS)} className="btn-small">All</button></div>
                    <div className="task-grid">
                      {GOI_TASKS.map(t => (
                        <label key={t} className="checkbox-label"><input type="checkbox" checked={n3Progress.goi2?.[ch]?.[t] || false} onChange={() => handleN3Toggle('goi2', ch, t)} /> {t}</label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <h3>N3 聴解</h3>
              <div className="chapter-list">
                {N3_CHOUKAI.map(item => (
                  <div key={item.name} className="chapter-box">
                    <div className="chapter-row"><strong>{item.name}</strong><button onClick={() => handleN3SelectAll('choukai', item.name, item.tasks)} className="btn-small">All</button></div>
                    <div className="task-grid">
                      {item.tasks.map(t => (
                        <label key={t} className="checkbox-label"><input type="checkbox" checked={n3Progress.choukai?.[item.name]?.[t] || false} onChange={() => handleN3Toggle('choukai', item.name, t)} /> {t}</label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <h3>N3 文法</h3>
              <div className="chapter-list">
                {N3_BUNPOU.map(item => (
                  <div key={item.name} className="chapter-box">
                    <div className="chapter-row">
                      <strong>{item.name}</strong>
                      <button onClick={() => handleN3SelectAll('bunpou', item.name, item.tasks)} className="btn-small">All</button>
                    </div>
                    <div className="task-grid">
                      {item.tasks.map(t => (
                        <label key={t} className="checkbox-label">
                          <input type="checkbox" checked={n3Progress.bunpou?.[item.name]?.[t] || false} onChange={() => handleN3Toggle('bunpou', item.name, t)} /> {t}
                        </label>
                      ))}
                    </div>
                    {item.name === "11-12 Unit" && (
                      <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                        <label className="checkbox-label">
                          <input type="checkbox" checked={n3Progress.final?.[1]?.['1-12練習'] || false} onChange={() => handleN3Toggle('final', 1, '1-12練習')} /> 
                          <strong style={{ color: '#4f46e5' }}>1-12 練習 (Final)</strong>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <h3>N3 読解</h3>
              <div className="chapter-list task-grid" style={{background: '#f8fafc', padding: '15px', borderRadius: '12px'}}>
                {N3_DOKKAI.map(d => (
                  <label key={d} className="checkbox-label">
                    <input type="checkbox" checked={n3Progress.dokkai?.['all']?.[d] || false} onChange={() => handleN3Toggle('dokkai', 'all', d)} /> {d}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="section">
          <label>Other (Reason)</label>
          <textarea className="input-field" rows="3" placeholder="အကြောင်းပြချက်ရှိက ဖြည့်စွက်ရန်..." onChange={(e) => setFormData({...formData, otherReason: e.target.value})}></textarea>
        </div>

        <button className="submit-btn" onClick={() => console.log("Submit:", { ...formData, minnaProgress, kanjiProgress, n3Progress })}>
          Submit Report
        </button>
      </div>
    </div>
  );
}

export default App;