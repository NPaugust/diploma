import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

export const predictImage = async (file, method = 'gradcam') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('method', method)
  
  const response = await api.post('/api/predict', formData)
  return response.data
}

export const getXAIExplanation = async (file, method = 'gradcam', predictedClass = null) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('method', method)
  if (predictedClass !== null) {
    formData.append('predicted_class', predictedClass)
  }
  
  const response = await api.post('/api/explain', formData)
  return response.data
}

export default api

