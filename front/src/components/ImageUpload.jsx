import { useState, useCallback, useRef, useEffect, useId } from 'react'
import { UploadCloud, X, Loader2, Play, Image as ImageIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../store/useAppStore'
import { predictImage, getXAIExplanation } from '../api/api'

export default function ImageUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(null)
  const navigate = useNavigate()
  const inputId = useId()
  
  const {
    setUploadedImage,
    setPredictionResult,
    setXaiResult,
    selectedMethod,
    isLoading,
    setIsLoading,
    setError,
    reset,
  } = useAppStore()

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0])
    }
  }, [selectedMethod])

  const handleChange = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e?.target?.files?.[0]
    if (file) {
      handleFile(file)
    }
  }, [selectedMethod])

  const currentBlobUrlRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    const isImageMime = file.type && file.type.startsWith('image/')
    const isImageExt = /\.(png|jpe?g|webp)$/i.test(file.name || '')
    if (!(isImageMime || isImageExt)) {
      setError('Please upload an image file (JPG, JPEG, PNG, WEBP)')
      return
    }

    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current)
      currentBlobUrlRef.current = null
    }
    const objectUrl = URL.createObjectURL(file)
    currentBlobUrlRef.current = objectUrl
    setPreview(objectUrl)
    setUploadedImage(file)
    setPredictionResult(null)
    setXaiResult(null)
    setError(null)

    // Navigate to analysis page immediately after selecting a file
    try {
      navigate('/analyze')
    } catch (_) {
      // noop
    }
  }

  const handleAnalyze = async () => {
    const file = useAppStore.getState().uploadedImage
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      const predResult = await predictImage(file, selectedMethod)
      setPredictionResult(predResult)

      const xaiResult = await getXAIExplanation(file, selectedMethod, predResult.predicted_class)
      setXaiResult(xaiResult)
    } catch (error) {
      setError(error.response?.data?.detail || 'Error processing image')
      console.error('Analysis error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current)
      currentBlobUrlRef.current = null
    }
    reset()
  }

  const { uploadedImage } = useAppStore()

  useEffect(() => {
    if (!uploadedImage) {
      setPreview(null)
      return
    }
    const objUrl = URL.createObjectURL(uploadedImage)
    setPreview(objUrl)
    return () => URL.revokeObjectURL(objUrl)
  }, [uploadedImage])

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all upload-area ${
            dragActive ? 'drag-active' : ''
          } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id={inputId}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
            accept="image/*,.jpg,.jpeg,.png,.webp"
            onChange={handleChange}
            disabled={isLoading}
          />
          
          <label
            htmlFor={inputId}
            className="flex flex-col items-center space-y-4"
          >
            {isLoading ? (
              <Loader2 className="w-20 h-20 text-primary-500 animate-spin" />
            ) : (
              <div className="relative">
                <UploadCloud className="w-20 h-20 text-primary-500" />
                <div className="absolute -bottom-2 -right-2 bg-primary-100 rounded-full p-2">
                  <ImageIcon className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            )}
            
            <div>
              <p className="text-xl font-bold text-primary-dark mb-3">
                {isLoading ? 'Processing...' : 'Upload MRI Brain Scan'}
              </p>
              <p className="text-secondary-dark text-base">
                Drag & drop or click to browse • JPG, PNG, JPEG, WEBP
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full rounded-2xl shadow-lg border border-accent-200"
          />
          <button
            onClick={handleRemove}
            className="absolute top-4 right-4 bg-danger-500 hover:bg-danger-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
          
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          )}
        </div>
      )}
      
      {uploadedImage && !isLoading && (
        <button 
          type="button"
          onClick={handleAnalyze}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-3 text-lg"
        >
          <Play className="w-6 h-6" fill="currentColor" />
          Start Analysis
        </button>
      )}
    </div>
  )
}