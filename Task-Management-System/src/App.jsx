

import { useState } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState(() =>
    JSON.parse(localStorage.getItem('taskflowUsers') || '[]')
  )

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = JSON.parse(
      localStorage.getItem('taskflowCurrentUser') || 'null'
    )
    return saved ? { ...saved, role: saved.role || 'User' } : null
  })

  const [tasks, setTasks] = useState(() =>
    JSON.parse(localStorage.getItem('taskflowTasks') || '[]')
  )

  const [isLogin, setIsLogin] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('User')
  const [message, setMessage] = useState('')

  const [page, setPage] = useState('Dashboard')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('College')
  const [priority, setPriority] = useState('Medium')
  const [status, setStatus] = useState('To Do')
  const [search, setSearch] = useState('')

  function storeUsers(updated) {
    setUsers(updated)
    localStorage.setItem('taskflowUsers', JSON.stringify(updated))
  }

  function storeTasks(updated) {
    setTasks(updated)
    localStorage.setItem('taskflowTasks', JSON.stringify(updated))
  }

  function handleAuth(e) {
    e.preventDefault()
    setMessage('')

    const cleanEmail = email.trim().toLowerCase()

    if (!isLogin) {
      if (password.length < 6) {
        setMessage('Password must contain at least 6 characters.')
        return
      }

      if (password !== confirmPassword) {
        setMessage('Passwords do not match.')
        return
      }

      if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
        setMessage('Email already registered. Please login.')
        return
      }

      const newUser = {
        name: name.trim(),
        email: cleanEmail,
        password,
        role
      }

      storeUsers([...users, newUser])
      setIsLogin(true)
      setPassword('')
      setConfirmPassword('')
      setMessage('Account created! Please login.')
      return
    }

    const found = users.find(
      u => u.email.toLowerCase() === cleanEmail &&
        u.password === password
    )

    if (!found) {
      setMessage('Invalid email or password.')
      return
    }

    const loggedIn = {
      name: found.name,
      email: found.email,
      role: found.role || 'User'
    }

    setCurrentUser(loggedIn)
    localStorage.setItem('taskflowCurrentUser', JSON.stringify(loggedIn))
    setPage('Dashboard')
    setMessage('')
  }

  function logout() {
    localStorage.removeItem('taskflowCurrentUser')
    setCurrentUser(null)
    setIsLogin(true)
    setMessage('')
    setPassword('')
  }

  function resetForm() {
    setTitle('')
    setCategory('College')
    setPriority('Medium')
    setStatus('To Do')
    setEditingId(null)
    setShowForm(false)
  }

  function saveTask(e) {
    e.preventDefault()
    if (!title.trim()) return

    let updated

    if (editingId !== null) {
      updated = tasks.map(t =>
        t.id === editingId &&
        (currentUser.role === 'Admin' || t.email === currentUser.email)
          ? { ...t, title: title.trim(), category, priority, status }
          : t
      )
    } else {
      updated = [
        ...tasks,
        {
          id: Date.now(),
          title: title.trim(),
          category,
          priority,
          status,
          email: currentUser.email
        }
      ]
    }

    storeTasks(updated)
    resetForm()
  }

  function editTask(task) {
    setTitle(task.title)
    setCategory(task.category)
    setPriority(task.priority)
    setStatus(task.status)
    setEditingId(task.id)
    setShowForm(true)
  }

  function deleteTask(id) {
    const updated = tasks.filter(t =>
      t.id !== id ||
      (currentUser.role !== 'Admin' && t.email !== currentUser.email)
    )
    storeTasks(updated)
  }

  const isAdmin = currentUser?.role === 'Admin'

  const myTasks = tasks.filter(t =>
  isAdmin || t.email === currentUser?.email
)
  const visibleTasks = myTasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )

  const todo = myTasks.filter(t => t.status === 'To Do').length
  const progress = myTasks.filter(t => t.status === 'In Progress').length
  const completed = myTasks.filter(t => t.status === 'Completed').length

  if (!currentUser) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">✦ TaskFlow</div>
          <p className="auth-eyebrow">YOUR PERSONAL WORKSPACE</p>
          <h1>{isLogin ? 'Welcome back!' : 'Create your account'}</h1>
          <p className="auth-subtitle">
            {isLogin ? 'Login to manage your tasks.' : 'Organize your day, one task at a time.'}
          </p>

          {message && <p className="auth-error">{message}</p>}

          <form className="auth-form" onSubmit={handleAuth}>
            {!isLogin && (
              <>
                <label>
                  Full Name
                  <input value={name} onChange={e => setName(e.target.value)}
                    placeholder="Enter your name" required />
                </label>

                <label>
                  Account Role
                  <select value={role} onChange={e => setRole(e.target.value)}>
                    <option value="User">User</option>
                    <option value="Admin">Admin (Demo)</option>
                  </select>
                </label>
              </>
            )}

            <label>
              Email Address
              <input type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required />
            </label>

            <label>
              Password
              <input type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters" required />
            </label>

            {!isLogin && (
              <label>
                Confirm Password
                <input type="password" value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password" required />
              </label>
            )}

            <button className="auth-submit" type="submit">
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button type="button" onClick={() => {
              setIsLogin(!isLogin)
              setMessage('')
            }}>
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">✦ TaskFlow</div>
        <p className="side-label">WORKSPACE</p>

        <div className={`nav-item ${page === 'Dashboard' ? 'active' : ''}`}
          onClick={() => setPage('Dashboard')}>▦ Dashboard</div>

        <div className={`nav-item ${page === 'My Tasks' ? 'active' : ''}`}
          onClick={() => setPage('My Tasks')}>✓ {isAdmin ? 'All Tasks' : 'My Tasks'}</div>

        {isAdmin && (
          <div className={`nav-item ${page === 'Users' ? 'active' : ''}`}
            onClick={() => setPage('Users')}>♙ Manage Users</div>
        )}

        <div className="sidebar-bottom">
          <p>Logged in as</p>
          <strong>{currentUser.name}</strong>
          <span>{currentUser.role}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">WORKSPACE / {page.toUpperCase()}</p>
            <h1>{page}</h1>
            <p>Welcome back, {currentUser.name}!</p>
          </div>

          {page !== 'Users' && (
            <button className="primary-btn" onClick={() => {
              resetForm()
              setShowForm(true)
            }}>+ Add Task</button>
          )}
        </header>

        {page === 'Dashboard' && (
          <section className="stats-grid">
            <div className="stat-card">
              <p>{isAdmin ? 'All Tasks' : 'Total Tasks'}</p>
              <h2>{myTasks.length}</h2>
              <span>All your tasks</span>
            </div>
            <div className="stat-card">
              <p>To Do</p>
              <h2>{todo}</h2>
              <span>Waiting to start</span>
            </div>
            <div className="stat-card">
              <p>In Progress</p>
              <h2>{progress}</h2>
              <span>Currently working</span>
            </div>
            <div className="stat-card">
              <p>Completed</p>
              <h2>{completed}</h2>
              <span>Tasks finished</span>
            </div>
          </section>
        )}

        {page === 'Users' && isAdmin ? (
          <section className="tasks-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">ADMIN MODULE</p>
                <h2>Registered Users</h2>
              </div>
              <strong>{users.length} users</strong>
            </div>

            {users.length === 0 ? (
              <div className="empty-state">No registered users yet.</div>
            ) : (
              <div className="task-list">
                {users.map(user => (
                  <article className="task-card" key={user.email}>
                    <div className="task-info">
                      <h3>{user.name}</h3>
                      <p>{user.email}</p>
                    </div>
                    <span className="status-badge">{user.role || 'User'}</span>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : page !== 'Users' && (
          <>
            {showForm && (
              <section className="task-form-card">
                <h2>{editingId !== null ? 'Edit Task' : 'Add New Task'}</h2>
                <form className="task-form" onSubmit={saveTask}>
                  <label>
                    Task Title
                    <input value={title} onChange={e => setTitle(e.target.value)}
                      placeholder="Enter task title" required />
                  </label>

                  <label>
                    Category
                    <select value={category} onChange={e => setCategory(e.target.value)}>
                      <option>College</option>
                      <option>Study</option>
                      <option>Personal</option>
                      <option>Work</option>
                    </select>
                  </label>

                  <label>
                    Priority
                    <select value={priority} onChange={e => setPriority(e.target.value)}>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </label>

                  <label>
                    Status
                    <select value={status} onChange={e => setStatus(e.target.value)}>
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </label>

                  <div className="form-actions">
                    <button className="primary-btn" type="submit">
                      {editingId !== null ? 'Update Task' : 'Save Task'}
                    </button>
                    <button className="cancel-btn" type="button" onClick={resetForm}>
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            )}

            <section className="tasks-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">YOUR WORK</p>
                  <h2>{isAdmin ? 'All Tasks' : 'My Tasks'}</h2>
                </div>
                <input className="search-input" value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search tasks..." />
              </div>

              {visibleTasks.length === 0 ? (
                <div className="empty-state">
                  <h3>No tasks found</h3>
                  <p>Add a task to get started!</p>
                </div>
              ) : (
                <div className="task-list">
                  {visibleTasks.map(task => (
                    <article className="task-card" key={task.id}>
                      <div className="task-info">
                        <h3>{task.title}</h3>
                        <p>{task.category} · {task.priority} Priority</p>
                        {isAdmin && <p>Owner: {task.email}</p>}
                      </div>

                      <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                        {task.status}
                      </span>

                      <div className="task-actions">
                        <button className="edit-btn" onClick={() => editTask(task)}>
                          Edit
                        </button>
                        <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        <footer className="footer">
          TaskFlow · Stay organized, stay productive.
        </footer>
      </main>
    </div>
  )
}

export default App