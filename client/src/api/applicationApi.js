import api from './axios'

export const getApplicationsRequest = async () => {
  const { data } = await api.get('/applications')
  return data
}

export const createApplicationRequest = async (payload) => {
  const { data } = await api.post('/applications', payload)
  return data
}

export const updateApplicationRequest = async (id, payload) => {
  const { data } = await api.put(`/applications/${id}`, payload)
  return data
}

export const patchApplicationRequest = async (id, payload) => {
  const { data } = await api.patch(`/applications/${id}`, payload)
  return data
}

export const deleteApplicationRequest = async (id) => {
  const { data } = await api.delete(`/applications/${id}`)
  return data
}
