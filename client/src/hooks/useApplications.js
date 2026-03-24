import { useCallback, useEffect, useState } from 'react'
import {
  createApplicationRequest,
  deleteApplicationRequest,
  getApplicationsRequest,
  patchApplicationRequest,
} from '../api/applicationApi'

const toMessage = (error, fallback) => {
  return error?.response?.data?.error || error?.message || fallback
}

const normalizeJob = (item) => {
  const id = item?._id ?? item?.id ?? item?.applicationId

  return {
    id,
    title: item?.title || item?.role || '',
    company: item?.company || '',
    status: item?.status || 'applied',
    appliedDate: item?.appliedDate || item?.applied_date || '',
    notes: item?.notes || '',
  }
}

const hasValidId = (job) => job?.id !== undefined && job?.id !== null && String(job.id).trim() !== ''

export const useApplications = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeletingId, setIsDeletingId] = useState(null)
  const [isUpdatingId, setIsUpdatingId] = useState(null)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const list = await getApplicationsRequest()
      const normalized = Array.isArray(list) ? list.map(normalizeJob).filter(hasValidId) : []
      setData(normalized)
    } catch (requestError) {
      setError(toMessage(requestError, 'Could not load applications.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createJob = useCallback(async (job) => {
    setIsCreating(true)
    setError('')

    try {
      const payload = {
        company: job.company,
        role: job.role || job.title,
        status: job.status,
        appliedDate: job.appliedDate,
        notes: job.notes || '',
      }

      const created = await createApplicationRequest(payload)
      const normalized = normalizeJob(created)

      if (!hasValidId(normalized)) {
        await refresh()
        throw new Error('Could not identify the created application. Please refresh and try again.')
      }

      setData((prev) => [normalized, ...prev])
      return normalized
    } catch (requestError) {
      const message = toMessage(requestError, 'Could not create application.')
      setError(message)
      throw new Error(message)
    } finally {
      setIsCreating(false)
    }
  }, [])

  const deleteJob = useCallback(async (id, options = { optimistic: true }) => {
    if (!hasValidId({ id })) {
      throw new Error('Missing job id. Please refresh your list and try again.')
    }

    const optimistic = options?.optimistic !== false

    setIsDeletingId(id)
    setError('')

    let snapshot = null

    if (optimistic) {
      setData((prev) => {
        snapshot = prev
        return prev.filter((job) => job.id !== id)
      })
    }

    try {
      await deleteApplicationRequest(id)

      if (!optimistic) {
        setData((prev) => prev.filter((job) => job.id !== id))
      }
    } catch (requestError) {
      if (optimistic && snapshot) {
        setData(snapshot)
      }

      const message = toMessage(requestError, 'Could not delete application.')
      setError(message)
      throw new Error(message)
    } finally {
      setIsDeletingId(null)
    }
  }, [])

  const updateJob = useCallback(async (id, patch) => {
    if (!hasValidId({ id })) {
      throw new Error('Missing job id. Please refresh your list and try again.')
    }

    setIsUpdatingId(id)
    setError('')

    try {
      const payload = {
        company: patch.company,
        role: patch.role || patch.title,
        status: patch.status,
        appliedDate: patch.appliedDate,
        notes: patch.notes,
      }

      const updated = await patchApplicationRequest(id, payload)
      const normalized = normalizeJob(updated)

      setData((prev) => prev.map((job) => (job.id === id ? normalized : job)))
      return normalized
    } catch (requestError) {
      const message = toMessage(requestError, 'Could not update application.')
      setError(message)
      throw new Error(message)
    } finally {
      setIsUpdatingId(null)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    data,
    isLoading,
    error,
    createJob,
    updateJob,
    deleteJob,
    refresh,
    isCreating,
    isUpdatingId,
    isDeletingId,
  }
}
