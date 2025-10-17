import { useState, useCallback, useRef, useEffect } from 'react'
import { UploadCloud, X, Loader2, Play } from 'lucide-react'
import useAppStore from '../store/useAppStore'
import { predictImage, getXAIExplanation } from '../api/api'

export default function ImageUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(null)
  
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
    // prevent form submit/reload in some browsers
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

    // Use object URL for instant preview (more reliable across browsers)
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current)
      currentBlobUrlRef.current = null
    }
    const objectUrl = URL.createObjectURL(file)
    currentBlobUrlRef.current = objectUrl
    setPreview(objectUrl)
    // Set state synchronously for UI update
    setUploadedImage(file)
    setPredictionResult(null)
    setXaiResult(null)
    setError(null)
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

  // Ensure preview persists across layout changes (component remounts)
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
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive
              ? 'border-blue-400 bg-blue-400/10'
              : 'border-white/30 hover:border-white/50'
          } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*,.jpg,.jpeg,.png,.webp"
            onChange={handleChange}
            disabled={isLoading}
          />
          
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center space-y-4"
          >
            {isLoading ? (
              <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
            ) : (
              <UploadCloud className="w-16 h-16 text-white/70" />
            )}
            
            <div>
              <p className="text-lg font-semibold text-white mb-2">
                {isLoading ? 'Processing...' : 'Drop your MRI scan here'}
              </p>
              <p className="text-white/60 text-sm">
                or click to browse files • JPG, PNG, JPEG
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full rounded-xl shadow-lg"
          />
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
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
        <button type="button"
          onClick={handleAnalyze}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" fill="currentColor" />
          Start Analysis
        </button>
      )}
    </div>
  )
}

