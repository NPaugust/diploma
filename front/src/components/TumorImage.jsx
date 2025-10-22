import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

export default function TumorImage({ tumorType, className = "" }) {
  const [imageError, setImageError] = useState(false)
  
  // Try to load image from dataset
  const imagePath = `/tumor-samples/${tumorType}.jpg`
  
  if (imageError) {
    return (
      <div className={`bg-accent-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <ImageIcon className="w-8 h-8 text-accent-400 mx-auto mb-2" />
          <p className="text-accent-500 text-xs">Sample Image</p>
        </div>
      </div>
    )
  }
  
  return (
    <img
      src={imagePath}
      alt={`${tumorType} sample`}
      className={`rounded-lg object-cover ${className}`}
      onError={() => setImageError(true)}
    />
  )
}
