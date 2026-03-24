import { useState } from 'react'

const initialState = {
  company: '',
  title: '',
  status: 'applied',
  appliedDate: '',
  notes: '',
}

const ApplicationForm = ({ onSubmit, isSubmitting = false }) => {
  const [form, setForm] = useState(initialState)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit(form)
    setForm(initialState)
  }

  return (
    <form onSubmit={handleSubmit} className="card form-grid">
      <h3>Add Job Application</h3>
      <input name="company" placeholder="Company" value={form.company} onChange={handleChange} required />
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="applied">Applied</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="rejected">Rejected</option>
      </select>
      <input name="appliedDate" type="date" value={form.appliedDate} onChange={handleChange} required />
      <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} rows={3} />
      <button type="submit" disabled={isSubmitting} aria-label="Save job application">
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}

export default ApplicationForm
