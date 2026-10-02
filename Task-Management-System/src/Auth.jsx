
import { useState } from 'react'
import './Auth.css'

function Auth({ onRegister, onLogin }) {
  const [isLogin, setIsLogin] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please fill in all required fields.')
      return
    }

    if (!isLogin) {
      if (!name.trim()) {
        setError('Please enter your name.')
        return
      }

      if (password.length < 6) {
        setError('Password must contain at least 6 characters.')
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }

      onRegister({ name: name.trim(), email: email.trim(), password })
    } else {
      onLogin({ email: email.trim(), password })
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">✦ TaskFlow</div>
        <p className="auth-eyebrow">YOUR PERSONAL WORKSPACE</p>

        <h1>{isLogin ? 'Welcome back!' : 'Create your account'}</h1>
        <p className="auth-subtitle">
          {isLogin
            ? 'Sign in to manage your tasks.'
            : 'Organize your day, one task at a time.'}
        </p>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <label>
              Full name
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
            />
          </label>

          {!isLogin && (
            <label>
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
              />
            </label>
          )}

          <button className="auth-submit" type="submit">
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          {' '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
            }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Auth