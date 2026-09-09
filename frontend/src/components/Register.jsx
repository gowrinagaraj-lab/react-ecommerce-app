import { useState } from 'react'
import { Input } from './form'
// import './Register.css'

const API_URL = 'http://localhost:5000/api/users/register'

const initialForm = { name: '', email: '', password: '', confirmPassword: '' }

const validate = (form) => {
  const errors = {}

  if (!form.name.trim()) {
    errors.name = 'Name is required'
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email'
  }

  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

const Register = () => {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || 'Registration failed' })
        return
      }

      setMessage({ type: 'success', text: `Welcome, ${data.name}! Registration successful.` })
      setForm(initialForm)
    } catch {
      setMessage({ type: 'error', text: 'Unable to reach server. Please try again later.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Create an account</h2>
        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <Input
            layout="group"
            label="Name"
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />

          <Input
            layout="group"
            label="Email"
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            layout="group"
            label="Password"
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Input
            layout="group"
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          {message && <div className={`form-message ${message.type}`}>{message.text}</div>}

          <button type="submit" className="register-submit" disabled={submitting}>
            {submitting ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
