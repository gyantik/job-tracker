import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginRequest } from '../api/authApi'
import LoginCard from '../components/LoginCard'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (form) => {
    setError('')
    setIsLoading(true)

    try {
      const data = await loginRequest(form)
      login(data)
      navigate('/')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return <LoginCard onSubmit={handleSubmit} errorMessage={error} isLoading={isLoading} createAccountHref="/register" />
}

export default LoginPage
