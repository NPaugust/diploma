import { create } from 'zustand'

const useAppStore = create((set) => ({
  uploadedImage: null,
  predictionResult: null,
  xaiResult: null,
  batchResults: [],
  selectedMethod: 'gradcam',
  isLoading: false,
  error: null,
  availableClasses: ['normal', 'glioma', 'meningioma', 'pituitary', 'carcinoma', 'ependimoma', 'ganglioglioma', 'germinoma', 'granuloma', 'medulloblastoma', 'schwannoma', 'tuberculoma'], // Default fallback

  setUploadedImage: (image) => set({ uploadedImage: image }),
  setPredictionResult: (result) => set({ predictionResult: result }),
  setXaiResult: (result) => set({ xaiResult: result }),
  addBatchResult: (item) => set((s) => ({ batchResults: [...s.batchResults, item] })),
  resetBatch: () => set({ batchResults: [] }),
  setSelectedMethod: (method) => set({ selectedMethod: method }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error: error }),
  setAvailableClasses: (classes) => set({ availableClasses: classes }),
  
  reset: () => set({
    uploadedImage: null,
    predictionResult: null,
    xaiResult: null,
    batchResults: [],
    error: null,
  }),
}))

export default useAppStore

