import React, { useState } from 'react';
import { MINNA_TASKS, N5_CHAPTERS, KANJI_CHAPTERS, TIME_SLOTS } from './data/chapters';
import './App.css';

function App() {
  // Main Form State
  const [formData, setFormData] = useState({
    senseiName: '',
    level: 'N5',
    classType: 'Mon-Thur',
    classTime: TIME_SLOTS["Mon-Thur"][0], // Default အချိန်ကို Mon-Thur ရဲ့ ပထမဆုံးအချိန်ပေးထားမယ်
    otherReason: ''
  });

  // Progress States
  const [minnaProgress, setMinnaProgress] = useState({});
  const [kanjiProgress, setKanjiProgress] = useState({});

  // Task တစ်ခုချင်းစီကို Check လုပ်ဖို့ Logic
  const handleTaskToggle = (type, chapter, task) => {
    const setter = type === 'minna' ? setMinnaProgress : setKanjiProgress;
    setter(prev => ({
      ...prev,
      [chapter]: {
        ...prev[chapter],
        [task]: !prev[chapter]?.[task]
      }
    }));
  };

  // Chapter တစ်ခုလုံးကို All Check လုပ်ဖို့ Logic
  const handleSelectAll = (type, chapter, tasks) => {
    const currentProgress = type === 'minna' ? minnaProgress : kanjiProgress;
    const setter = type === 'minna' ? setMinnaProgress : setKanjiProgress;
    
    const isAllSelected = tasks.every(t => currentProgress[chapter]?.[t]);
    
    const updatedChapter = {};
    tasks.forEach(t => { 
        updatedChapter[t] = !isAllSelected; 
    });

    setter(prev => ({ ...prev, [chapter]: updatedChapter }));
  };

  return (
    <div className="app-container">
      <div className="form-card">
        <h2 className="title">TGI Japanese Report Form</h2>

        {/* --- Basic Info Section --- */}
        <div className="section">
          <label>Sensei အမည်</label>
          <input 
            className="input-field"
            placeholder="Sensei အမည် ထည့်ပါ"
            onChange={(e) => setFormData({...formData, senseiName: e.target.value})}
          />

          <div className="grid-2">
            <div>
              <label>Level ရွေးရန်</label>
              <select className="input-field" onChange={(e) => setFormData({...formData, level: e.target.value})}>
                <option value="N5">N5</option>
                <option value="N4">N4</option>
                <option value="N3">N3</option>
                <option value="N2">N2</option>
              </select>
            </div>
            
            {/* အတန်းအမျိုးအစား (Mon-Thur / Sat-Sun) */}
            <div>
              <label>အတန်းအမျိုးအစား</label>
              <select 
                className="input-field" 
                value={formData.classType}
                onChange={(e) => {
                  const type = e.target.value;
                  setFormData({
                    ...formData, 
                    classType: type, 
                    classTime: TIME_SLOTS[type][0] // အတန်းအမျိုးအစားပြောင်းရင် အချိန်ကို Default ပြန်ပြောင်းပေးမယ်
                  });
                }}
              >
                <option value="Mon-Thur">Mon - Thur</option>
                <option value="Sat-Sun">Sat - Sun</option>
              </select>
            </div>
          </div>

          {/* Dynamic ဖြစ်တဲ့ အချိန်ရွေးရန် Dropdown */}
          <div className="section-time">
            <label>အချိန်ရွေးရန်</label>
            <select 
              className="input-field"
              value={formData.classTime}
              onChange={(e) => setFormData({...formData, classTime: e.target.value})}
            >
              {TIME_SLOTS[formData.classType].map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        {/* --- N5 / N4 Progress Section --- */}
        {(formData.level === 'N5' || formData.level === 'N4') && (
          <>
            <div className="section">
              <h3>みんなの日本語 (1-25)</h3>
              <div className="chapter-list">
                {N5_CHAPTERS.map(ch => (
                  <div key={ch} className="chapter-box">
                    <div className="chapter-row">
                      <strong>Chapter {ch}</strong>
                      <button onClick={() => handleSelectAll('minna', ch, MINNA_TASKS)} className="btn-small">All</button>
                    </div>
                    <div className="task-grid">
                      {MINNA_TASKS.map(task => (
                        <label key={task} className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={minnaProgress[ch]?.[task] || false}
                            onChange={() => handleTaskToggle('minna', ch, task)}
                          /> {task}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <h3>漢字マスター (1-15)</h3>
              <div className="chapter-list">
                {KANJI_CHAPTERS.map(ch => (
                  <div key={ch} className="chapter-box">
                    <div className="chapter-row">
                      <strong>Chapter {ch}</strong>
                      <button onClick={() => handleSelectAll('kanji', ch, ['Completed'])} className="btn-small">Done</button>
                    </div>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={kanjiProgress[ch]?.['Completed'] || false}
                        onChange={() => handleTaskToggle('kanji', ch, 'Completed')}
                      /> Finish Chapter {ch}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="section">
          <label>Other (Reason)</label>
          <textarea 
            className="input-field" 
            rows="3"
            placeholder="အကြောင်းပြချက်ရှိက ဖြည့်စွက်ရန်..."
            onChange={(e) => setFormData({...formData, otherReason: e.target.value})}
          ></textarea>
        </div>

        <button 
            className="submit-btn"
            onClick={() => console.log("Final Data:", { ...formData, minnaProgress, kanjiProgress })}
        >
            Submit Report
        </button>
      </div>
    </div>
  );
}

export default App;