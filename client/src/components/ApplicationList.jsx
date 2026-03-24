import { useEffect, useState } from 'react'
import './ApplicationList.css'

const hasValidId = (id) => id !== undefined && id !== null && String(id).trim() !== ''

const formatDateSafe = (value) => {
  if (!value) {
    return 'Date not set'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return 'Date not set'
  }

  return parsed.toLocaleDateString()
}

const ApplicationList = ({
  applications,
  onDelete,
  onUpdate,
  isLoading,
  isDeletingId = null,
  isUpdatingId = null,
}) => {
  const [notesById, setNotesById] = useState({})
  const [messagesById, setMessagesById] = useState({})
  const [openNotesById, setOpenNotesById] = useState({})

  useEffect(() => {
    const next = {}
    applications.forEach((item) => {
      next[item.id] = item.notes || ''
    })
    setNotesById(next)
  }, [applications])

  const setCardMessage = (id, type, text) => {
    setMessagesById((prev) => ({
      ...prev,
      [id]: { type, text },
    }))
  }

  const handleStatusChange = async (item, status) => {
    if (!hasValidId(item.id)) {
      setCardMessage(item.id || `missing-${item.company}`, 'error', 'Missing job id. Please refresh.')
      return
    }

    try {
      await onUpdate(item.id, { status })
      setCardMessage(item.id, 'success', 'Status updated successfully.')
    } catch (error) {
      setCardMessage(item.id, 'error', error.message || 'Failed to update status.')
    }
  }

  const handleSaveNotes = async (item) => {
    if (!hasValidId(item.id)) {
      setCardMessage(item.id || `missing-${item.company}`, 'error', 'Missing job id. Please refresh.')
      return
    }

    try {
      await onUpdate(item.id, { notes: notesById[item.id] || '' })
      setCardMessage(item.id, 'success', 'Notes saved successfully.')
    } catch (error) {
      setCardMessage(item.id, 'error', error.message || 'Failed to save notes.')
    }
  }

  const toggleNotes = (id) => {
    setOpenNotesById((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (isLoading) {
    return <p className="card app-list-state">Loading applications...</p>
  }

  if (applications.length === 0) {
    return <p className="card app-list-state">No applications yet. Add your first one above.</p>
  }

  return (
    <section className="app-card-grid" aria-label="Job applications">
      {applications.map((item) => (
        <article key={item.id || `${item.company}-${item.title}`} className="card app-item-card">
          <div className="app-item-top">
            <div>
              <h3>{item.company || 'Unknown company'}</h3>
              <p className="app-role">{item.title || 'Untitled role'}</p>
            </div>
            <button
              type="button"
              className="danger-btn"
              onClick={() => onDelete(item.id)}
              disabled={isDeletingId === item.id || !hasValidId(item.id)}
              aria-label={`Delete ${item.company} ${item.title}`}
            >
              {isDeletingId === item.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>

          <div className="app-meta-row">
            <label htmlFor={`status-${item.id}`}>Status</label>
            <select
              id={`status-${item.id}`}
              value={item.status}
              onChange={(event) => handleStatusChange(item, event.target.value)}
              className={`status-select status-${item.status}`}
              disabled={isUpdatingId === item.id || !hasValidId(item.id)}
              aria-label={`Update status for ${item.company}`}
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="app-compact-row">
            <p className="app-date">Applied on {formatDateSafe(item.appliedDate)}</p>
            <button
              type="button"
              className="secondary-btn app-notes-toggle"
              onClick={() => toggleNotes(item.id)}
              aria-expanded={Boolean(openNotesById[item.id])}
              aria-controls={`notes-panel-${item.id}`}
            >
              {openNotesById[item.id] ? 'Hide Notes' : 'Show Notes'}
            </button>
          </div>

          {openNotesById[item.id] ? (
            <div id={`notes-panel-${item.id}`} className="app-notes-wrap">
              <label htmlFor={`notes-${item.id}`}>Notes</label>
              <textarea
                id={`notes-${item.id}`}
                value={notesById[item.id] || ''}
                onChange={(event) => {
                  const value = event.target.value
                  setNotesById((prev) => ({ ...prev, [item.id]: value }))
                }}
                rows={2}
                aria-label={`Notes for ${item.company}`}
              />
              <button
                type="button"
                onClick={() => handleSaveNotes(item)}
                disabled={isUpdatingId === item.id || !hasValidId(item.id)}
                aria-label={`Save notes for ${item.company}`}
              >
                {isUpdatingId === item.id ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          ) : item.notes ? (
            <p className="app-notes-preview">{item.notes}</p>
          ) : null}

          {messagesById[item.id] ? (
            <p className={`app-inline-message app-inline-${messagesById[item.id].type}`} role="status" aria-live="polite">
              {messagesById[item.id].text}
            </p>
          ) : null}
        </article>
      ))}
    </section>
  )
}

export default ApplicationList
