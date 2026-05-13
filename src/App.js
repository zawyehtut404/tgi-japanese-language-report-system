import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import Modal from './Modal';
import { 
  MINNA_TASKS, N5_CHAPTERS, KANJI_CHAPTERS, TIME_SLOTS, 
  N3_CHOUKAI, N3_BUNPOU, N3_DOKKAI, N3_PAST_PAPERS 
} from './data/chapters';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('form');
  const [allReports, setAllReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    actions: null,
    onClose: null
  });

  const [formData, setFormData] = useState({
    level: 'N5',
    classType: 'Mon-Thur',
    classTime: TIME_SLOTS["Mon-Thur"][0],
    otherReason: ''
  });

  const [minnaProgress, setMinnaProgress] = useState({});
  const [kanjiProgress, setKanjiProgress] = useState({});
  const [n3Progress, setN3Progress] = useState({});
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'sensei'
  });
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const showModal = (title, message, type = 'info', actions = null) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      actions: actions || [{ label: 'OK', type: 'primary', onClick: () => setModal({ ...modal, isOpen: false }) }],
      onClose: () => setModal({ ...modal, isOpen: false })
    });
  };

  const getHeaders = () => ({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  const handleLogin = (user, token) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    showModal(
      'Confirm Logout',
      'Are you sure you want to logout?',
      'warning',
      [
        { label: 'Cancel', type: 'secondary', onClick: () => setModal({ ...modal, isOpen: false }) },
        { 
          label: 'Logout', 
          type: 'danger', 
          onClick: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setCurrentUser(null);
            setCurrentView('form');
            setModal({ ...modal, isOpen: false });
          }
        }
      ]
    );
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/reports', getHeaders());
      setAllReports(response.data.reports || []);
      setCurrentView('admin');
    } catch (error) {
      showModal('Error', 'Failed to fetch reports. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (currentUser.role !== 'admin') return;
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users', getHeaders());
      setAllUsers(response.data.users || []);
      setCurrentView('users');
    } catch (error) {
      showModal('Error', 'Failed to fetch users. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const fullReport = {
      senseiName: currentUser.name,
      level: formData.level,
      classType: formData.classType,
      classTime: formData.classTime,
      minnaProgress,
      kanjiProgress,
      n3Progress,
      otherReason: formData.otherReason
    };

    try {
      await axios.post(
        'http://localhost:5000/api/reports',
        fullReport,
        getHeaders()
      );
      showModal('Success', 'Report submitted successfully!', 'success');
      setMinnaProgress({});
      setKanjiProgress({});
      setN3Progress({});
      setFormData({
        senseiName: '',
        level: 'N5',
        classType: 'Mon-Thur',
        classTime: TIME_SLOTS["Mon-Thur"][0],
        otherReason: ''
      });
    } catch (error) {
      showModal('Error', error.response?.data?.error || 'Failed to submit report.', 'error');
    }
  };

  const handleDeleteReport = async (id) => {
    setModal({
      isOpen: true,
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this report?',
      type: 'warning',
      actions: [
        {
          label: 'Cancel',
          type: 'secondary',
          onClick: () => setModal({ ...modal, isOpen: false })
        },
        {
          label: 'Delete',
          type: 'danger',
          onClick: async () => {
            setModal({ ...modal, isOpen: false });
            try {
              await axios.delete(
                `http://localhost:5000/api/reports/${id}`,
                getHeaders()
              );
              setAllReports(allReports.filter(r => r._id !== id));
              showModal('Success', 'Report deleted successfully.', 'success');
            } catch (error) {
              showModal('Error', error.response?.data?.error || 'Failed to delete report.', 'error');
            }
          }
        }
      ]
    });
  };

  const handleSaveUser = async () => {
    if (!newUserData.email || !newUserData.password) {
      showModal('Missing Information', 'Email and password are required.', 'warning');
      return;
    }

    try {
      if (editingUserId) {
        await axios.put(
          `http://localhost:5000/api/users/${editingUserId}`,
          newUserData,
          getHeaders()
        );
        showModal('Success', 'User updated successfully.', 'success');
      } else {
        await axios.post(
          'http://localhost:5000/api/users',
          newUserData,
          getHeaders()
        );
        showModal('Success', 'User created successfully.', 'success');
      }
      await fetchUsers();
      setNewUserData({ email: '', password: '', name: '', role: 'sensei' });
      setEditingUserId(null);
      setShowUserModal(false);
    } catch (error) {
      showModal('Error', error.response?.data?.error || 'Failed to save user.', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    setModal({
      isOpen: true,
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this user?',
      type: 'warning',
      actions: [
        {
          label: 'Cancel',
          type: 'secondary',
          onClick: () => setModal({ ...modal, isOpen: false })
        },
        {
          label: 'Delete',
          type: 'danger',
          onClick: async () => {
            setModal({ ...modal, isOpen: false });
            try {
              await axios.delete(
                `http://localhost:5000/api/users/${id}`,
                getHeaders()
              );
              setAllUsers(allUsers.filter(u => u._id !== id));
              showModal('Success', 'User deleted successfully.', 'success');
            } catch (error) {
              showModal('Error', error.response?.data?.error || 'Failed to delete user.', 'error');
            }
          }
        }
      ]
    });
  };

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

  const viewReportDetail = async (reportId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reports/${reportId}`,
        getHeaders()
      );
      setSelectedReport(response.data.report);
      setCurrentView('reportDetail');
    } catch (error) {
      showModal('Error', 'Failed to fetch report details.', 'error');
    }
  };

  const renderProgressData = (data, title) => {
    if (!data || Object.keys(data).length === 0) return null;
    
    return (
      <div className="progress-section">
        <h5>{title}</h5>
        <div className="progress-grid">
          {Object.entries(data).map(([chapter, tasks]) => (
            <div key={chapter} className="progress-item">
              <div className="progress-header">{title.includes('Kanji') ? `Ch ${chapter}` : `Chapter ${chapter}`}</div>
              <div className="progress-tasks">
                {typeof tasks === 'object' && tasks !== null ? (
                  Object.entries(tasks).map(([task, completed]) => (
                    <span key={task} className={`task-badge ${completed ? 'completed' : 'pending'}`}>
                      {task}
                    </span>
                  ))
                ) : (
                  <span className="task-badge pending">{tasks.toString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <h1>TGI Report System</h1>
            <span className="user-badge">{currentUser.name}</span>
          </div>

          <div className="navbar-nav">
            {currentView !== 'form' && (
              <button className="nav-item" onClick={() => setCurrentView('form')}>
                Add Report
              </button>
            )}
            {currentView !== 'admin' && (
              <button className="nav-item" onClick={fetchReports}>
                Dashboard
              </button>
            )}
            {currentUser.role === 'admin' && currentView !== 'users' && (
              <button className="nav-item" onClick={fetchUsers}>
                Users
              </button>
            )}
            <button className="nav-item logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {currentView === 'form' && (
          <div className="page-container">
            <div className="page-header">
              <h2>Add New Report</h2>
              <p>Submit your progress</p>
            </div>

            <div className="form-container">
              <section className="form-section">
                <h3>Basic Info</h3>

                <div className="form-grid">
                  <select className="form-input" value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}>
                    <option value="N5">N5</option>
                    <option value="N4">N4</option>
                    <option value="N3">N3</option>
                  </select>

                  <select className="form-input" value={formData.classType} onChange={(e) => setFormData({ ...formData, classType: e.target.value, classTime: TIME_SLOTS[e.target.value][0] })}>
                    <option value="Mon-Thur">Mon - Thur</option>
                    <option value="Sat-Sun">Sat - Sun</option>
                  </select>

                  <select className="form-input" value={formData.classTime} onChange={(e) => setFormData({ ...formData, classTime: e.target.value })}>
                    {TIME_SLOTS[formData.classType].map(time => <option key={time} value={time}>{time}</option>)}
                  </select>
                </div>
              </section>

              {(formData.level === 'N5' || formData.level === 'N4') && (
                <>
                  <section className="form-section">
                    <h3>みんなの日本語</h3>
                    <div className="chapters-grid">
                      {N5_CHAPTERS.map(ch => (
                        <div key={ch} className="chapter-card">
                          <div className="chapter-header">
                            <strong>Ch {ch}</strong>
                            <button onClick={() => handleN5SelectAll('minna', ch, MINNA_TASKS)} className="btn-small">All</button>
                          </div>
                          <div className="tasks-container">
                            {MINNA_TASKS.map(task => (
                              <label key={task} className="checkbox-item">
                                <input type="checkbox" checked={minnaProgress[ch]?.[task] || false} onChange={() => handleN5TaskToggle('minna', ch, task)} />
                                {task}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="form-section">
                    <h3>漢字</h3>
                    <div className="chapters-grid">
                      {KANJI_CHAPTERS.map(ch => (
                        <div key={`kanji-${ch}`} className="chapter-card">
                          <div className="chapter-header">
                            <strong>Ch {ch}</strong>
                            <button onClick={() => handleN5SelectAll('kanji', ch, ["Finish"])} className="btn-small">Done</button>
                          </div>
                          <label className="checkbox-item">
                            <input type="checkbox" checked={kanjiProgress[ch]?.["Finish"] || false} onChange={() => handleN5TaskToggle('kanji', ch, "Finish")} />
                            Finish
                          </label>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {formData.level === 'N3' && (
                <>
                  <section className="form-section">
                    <h3>聴解</h3>
                    <div className="chapters-grid">
                      {N3_CHOUKAI.map((chapter) => (
                        <div key={chapter.name} className="chapter-card">
                          <div className="chapter-header">
                            <strong>{chapter.name}</strong>
                            <button onClick={() => handleN3SelectAll('choukai', chapter.name, chapter.tasks)} className="btn-small">All</button>
                          </div>
                          <div className="tasks-container">
                            {chapter.tasks.map((task) => (
                              <label key={task} className="checkbox-item">
                                <input type="checkbox" checked={n3Progress.choukai?.[chapter.name]?.[task] || false} onChange={() => handleN3Toggle('choukai', chapter.name, task)} />
                                {task}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="form-section">
                    <h3>文法</h3>
                    <div className="chapters-grid">
                      {N3_BUNPOU.map((chapter) => (
                        <div key={chapter.name} className="chapter-card">
                          <div className="chapter-header">
                            <strong>{chapter.name}</strong>
                            <button onClick={() => handleN3SelectAll('bunpou', chapter.name, chapter.tasks)} className="btn-small">All</button>
                          </div>
                          <div className="tasks-container">
                            {chapter.tasks.map((task) => (
                              <label key={task} className="checkbox-item">
                                <input type="checkbox" checked={n3Progress.bunpou?.[chapter.name]?.[task] || false} onChange={() => handleN3Toggle('bunpou', chapter.name, task)} />
                                {task}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="form-section">
                    <h3>読解</h3>
                    <div className="tasks-grid">
                      {N3_DOKKAI.map(d => (
                        <label key={d} className="checkbox-item">
                          <input type="checkbox" checked={n3Progress.dokkai?.['all']?.[d] || false} onChange={() => handleN3Toggle('dokkai', 'all', d)} />
                          {d}
                        </label>
                      ))}
                    </div>
                  </section>

                  <section className="form-section">
                    <h3>過去問</h3>
                    <div className="chapters-grid">
                      {N3_PAST_PAPERS.map((paper) => (
                        <div key={`${paper.year}-${paper.month}`} className="chapter-card">
                          <div className="chapter-header">
                            <strong>{paper.year} {paper.month}</strong>
                            <button onClick={() => handleN3SelectAll('pastpapers', `${paper.year}-${paper.month}`, paper.tasks)} className="btn-small">All</button>
                          </div>
                          <div className="tasks-container">
                            {paper.tasks.map((task) => (
                              <label key={task} className="checkbox-item">
                                <input type="checkbox" checked={n3Progress.pastpapers?.[`${paper.year}-${paper.month}`]?.[task] || false} onChange={() => handleN3Toggle('pastpapers', `${paper.year}-${paper.month}`, task)} />
                                {task}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              <section className="form-section">
                <label>Notes</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  value={formData.otherReason}
                  onChange={(e) => setFormData({ ...formData, otherReason: e.target.value })}
                ></textarea>
              </section>

              <button className="submit-btn" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        )}

        {currentView === 'admin' && (
          <div className="page-container">
            <div className="page-header">
              <h2>Reports</h2>
            </div>

            {loading ? (
              <p className="loading">Loading...</p>
            ) : (
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Teacher</th>
                      <th>Level</th>
                      <th>Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allReports.length > 0 ? (
                      allReports.map(report => (
                        <tr key={report._id}>
                          <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                          <td>{report.senseiName}</td>
                          <td><span className={`level-badge ${report.level}`}>{report.level}</span></td>
                          <td>{report.classTime}</td>
                          <td>
                            <button className="btn-view" onClick={() => viewReportDetail(report._id)}>View</button>
                            <button className="btn-delete" onClick={() => handleDeleteReport(report._id)}>Delete</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="5" className="empty">No reports</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {currentView === 'reportDetail' && selectedReport && (
          <div className="page-container">
            <button className="back-btn" onClick={() => setCurrentView('admin')}>← Back</button>
            <div className="detail-container">
              <div className="detail-card">
                <h3>{selectedReport.senseiName}</h3>
                <div className="detail-info">
                  <div><strong>Level:</strong> <span className={`level-badge ${selectedReport.level}`}>{selectedReport.level}</span></div>
                  <div><strong>Class:</strong> {selectedReport.classType} ({selectedReport.classTime})</div>
                  <div><strong>Date:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</div>
                </div>
                <div className="detail-content">
                  <h4>Progress Summary</h4>
                  {renderProgressData(selectedReport.minnaProgress, 'Minna Progress')}
                  {renderProgressData(selectedReport.kanjiProgress, 'Kanji Progress')}
                  {renderProgressData(selectedReport.n3Progress, 'N3 Progress')}
                  {selectedReport.otherReason && (
                    <div className="note-section">
                      <h5>Notes</h5>
                      <p>{selectedReport.otherReason}</p>
                    </div>
                  )}
                </div>
                <button className="btn-delete" onClick={() => {
                  handleDeleteReport(selectedReport._id);
                  setCurrentView('admin');
                }}>Delete Report</button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'users' && currentUser.role === 'admin' && (
          <div className="page-container">
            <div className="page-header">
              <h2>Users</h2>
              <button className="btn-small" onClick={() => {
                setShowUserModal(true);
                setEditingUserId(null);
                setNewUserData({ email: '', password: '', name: '', role: 'sensei' });
              }}>
                + Create User
              </button>
            </div>

            {loading ? (
              <p className="loading">Loading...</p>
            ) : (
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map(user => (
                      <tr key={user._id}>
                        <td>{user.email}</td>
                        <td>{user.name || '-'}</td>
                        <td><span className={`role-badge ${user.role}`}>{user.role.toUpperCase()}</span></td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button className="btn-view" onClick={() => {
                            setNewUserData({ ...user, password: '' });
                            setEditingUserId(user._id);
                            setShowUserModal(true);
                          }}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* User Form Modal */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingUserId ? 'Edit User' : 'Create User'}</h2>
              <button className="modal-close" onClick={() => setShowUserModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <input
                className="form-input"
                placeholder="Email"
                type="email"
                value={newUserData.email}
                disabled={!!editingUserId}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              />
              <input
                className="form-input"
                placeholder="Password"
                type="password"
                value={newUserData.password}
                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
              />
              <input
                className="form-input"
                placeholder="Name"
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              />
              <select className="form-input" value={newUserData.role} onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}>
                <option value="sensei">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowUserModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveUser}>
                {editingUserId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={modal.onClose}
        actions={modal.actions}
      />
    </div>
  );
}

export default App;
