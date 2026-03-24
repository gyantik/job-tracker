import { useEffect, useRef, useState } from 'react'
import ApplicationForm from '../components/ApplicationForm'
import ApplicationList from '../components/ApplicationList'
import ToastStack from '../components/ToastStack'
import { useAuth } from '../context/AuthContext'
import { useApplications } from '../hooks/useApplications'

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const { data, isLoading, error, createJob, updateJob, deleteJob, refresh, isCreating, isUpdatingId, isDeletingId } = useApplications()
  const [toasts, setToasts] = useState([])
  const toastCounterRef = useRef(0)
  const toastTimersRef = useRef(new Map())

  const removeToast = (id) => {
    const existingTimer = toastTimersRef.current.get(id)
    if (existingTimer) {
      clearTimeout(existingTimer)
      toastTimersRef.current.delete(id)
    }

    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const addToast = (message, type = 'info') => {
    let id

    setToasts((prev) => {
      const existing = prev.find((toast) => toast.message === message && toast.type === type)

      if (existing) {
        id = existing.id

        const withoutExisting = prev.filter((toast) => toast.id !== existing.id)
        return [...withoutExisting, { ...existing, updatedAt: Date.now() }]
      }

      id = toastCounterRef.current + 1
      toastCounterRef.current = id

      return [...prev, { id, message, type }]
    })

    const existingTimer = toastTimersRef.current.get(id)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    const timer = setTimeout(() => {
      removeToast(id)
    }, 2600)

    toastTimersRef.current.set(id, timer)
  }

  useEffect(() => {
    const timers = toastTimersRef.current

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      timers.clear()
    }
  }, [])

  const handleCreate = async (payload) => {
    try {
      await createJob(payload)
      addToast('Job application saved.', 'success')
    } catch (requestError) {
      addToast(requestError.message || 'Could not save job.', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteJob(id)
      addToast('Job application deleted.', 'info')
    } catch (requestError) {
      addToast(requestError.message || 'Could not delete job.', 'error')
    }
  }

  const handleUpdate = async (id, patch) => {
    await updateJob(id, patch)
  }

  return (
    <section className="dashboard">
      <header className="dashboard-header card">
        <div>
          <h2>Job Tracker Dashboard</h2>
          <p>Welcome, {user?.name || 'User'}</p>
        </div>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </header>

      {error ? (
        <div className="card inline-message" role="alert" aria-live="polite">
          <p className="error-text">{error}</p>
          <button type="button" onClick={refresh} className="secondary-btn">
            Retry
          </button>
        </div>
      ) : null}

      <div className="dashboard-grid">
        <ApplicationForm onSubmit={handleCreate} isSubmitting={isCreating} />
        <ApplicationList
          applications={data}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          isLoading={isLoading}
          isUpdatingId={isUpdatingId}
          isDeletingId={isDeletingId}
        />
      </div>

      <ToastStack toasts={toasts} onDismiss={removeToast} />
    </section>
  )
}

export default DashboardPage
