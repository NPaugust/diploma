import { Eye, Brain, Sparkles } from 'lucide-react'
import { useState } from 'react'
import useAppStore from '../store/useAppStore'

const methods = [
  {
    id: 'gradcam',
    name: 'Grad-CAM',
    description: 'Shows brain regions the AI focused on during analysis',
    icon: Eye,
    color: 'text-primary-600',
    bg: 'bg-primary-100',
  },
  {
    id: 'shap',
    name: 'SHAP',
    description: 'Explains importance of different features for diagnosis',
    icon: Sparkles,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
  },
  {
    id: 'lime',
    name: 'LIME',
    description: 'Local explanations of model decisions',
    icon: Brain,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
  },
]

function Banner({ text }) {
  if (!text) return null
  return (
    <div className="mt-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
      {text}
    </div>
  )
}

export default function XAIMethodSelector() {
  const { selectedMethod, setSelectedMethod, isLoading } = useAppStore()
  const [warning, setWarning] = useState('')

  const handleSelect = async (methodId) => {
    if (methodId === 'shap') {
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/health')
        const data = await res.json()
        if (!data.shap_available) {
          setWarning('SHAP is not available on server. Switched to Grad-CAM.')
          setSelectedMethod('gradcam')
          return
        }
      } catch (_) {
        setWarning('Cannot reach server to check SHAP availability. Using Grad-CAM.')
        setSelectedMethod('gradcam')
        return
      }
    }
    setWarning('')
    setSelectedMethod(methodId)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {methods.map((method) => {
          const Icon = method.icon
          const isSelected = selectedMethod === method.id
          
          return (
            <button
              key={method.id}
              onClick={() => handleSelect(method.id)}
              disabled={isLoading}
              className={`relative p-5 rounded-2xl transition-all card-hover ${
                isSelected
                  ? 'ring-2 ring-primary-500 shadow-lg'
                  : 'hover:shadow-md'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`${method.bg} ${method.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className="text-primary-dark font-bold text-base mb-1">
                    {method.name}
                  </h3>
                  <p className="text-secondary-dark text-xs">
                    {method.description}
                  </p>
                </div>
                
                {isSelected && (
                  <div className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
      <Banner text={warning} />
    </div>
  )
}