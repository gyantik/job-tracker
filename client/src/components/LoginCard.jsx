import { useState } from 'react'
import './LoginCard.css'

const LoginCard = ({
  onSubmit,
  title = 'Sign in to Job Tracker',
  subtitle = 'Track applications, interviews, and offers in one place.',
  createAccountHref = '/register',
  errorMessage = '',
  isLoading = false,
}) => {
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit?.(form)
  }

  return (
    <section className="login-shell" aria-label="Login screen">
      <div className="login-card" role="region" aria-labelledby="login-title">
        <header className="login-header">
          <h1 id="login-title">{title}</h1>
          <p>{subtitle}</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange}
              required
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? 'login-error' : undefined}
            />
          </div>

          <div className="field-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? 'login-error' : undefined}
            />
          </div>

          {errorMessage ? (
            <p id="login-error" className="login-error" role="alert" aria-live="polite">
              {errorMessage}
            </p>
          ) : null}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Log in'}
          </button>
        </form>

        <footer className="login-footer">
          <a href={createAccountHref} aria-label="Create an account for Job Tracker">
            Create an account
          </a>
        </footer>
      </div>
    </section>
  )
}

export default LoginCard
