import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LoginView from '../LoginView'

describe('LoginView', () => {
  const defaultProps = {
    form: { email: '', password: '' },
    setForm: () => {},
    error: null,
    loading: false,
    showPassword: false,
    setShowPassword: () => {},
    rememberMe: false,
    setRememberMe: () => {},
    submit: (e) => e.preventDefault(),
    fillDemoCredentials: () => {},
  }

  it('renders the form and header', () => {
    render(<LoginView {...defaultProps} />)
    expect(screen.getByText(/welcome back/i)).toBeDefined()
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeDefined()
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeDefined()
  })

  it('shows an error banner when error prop is provided', () => {
    render(<LoginView {...defaultProps} error={'Bad creds'} />)
    expect(screen.getByText(/bad creds/i)).toBeDefined()
  })

  it('shows loading state when loading is true', () => {
    render(<LoginView {...defaultProps} loading={true} />)
    expect(screen.getByText(/signing in/i)).toBeDefined()
  })
})
