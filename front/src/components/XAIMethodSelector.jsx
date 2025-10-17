import { Eye, Brain, Sparkles } from 'lucide-react'
import useAppStore from '../store/useAppStore'

const methods = [
  {
    id: 'gradcam',
    name: 'Grad-CAM',
    description: 'Gradient-weighted Class Activation Mapping for visual attention',
    icon: Eye,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'shap',
    name: 'SHAP',
    description: 'SHapley Additive exPlanations for feature importance analysis',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'lime',
    name: 'LIME',
    description: 'Local Interpretable Model-agnostic Explanations',
    icon: Brain,
    color: 'from-orange-500 to-red-500',
  },
]

export default function XAIMethodSelector() {
  const { selectedMethod, setSelectedMethod, isLoading } = useAppStore()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {methods.map((method) => {
          const Icon = method.icon
          const isSelected = selectedMethod === method.id
          
          return (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              disabled={isLoading}
              className={`relative p-4 rounded-xl transition-all ${
                isSelected
                  ? 'bg-white/20 border-2 border-white/40 shadow-lg'
                  : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`bg-gradient-to-br ${method.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className="text-white font-bold text-base mb-1">
                    {method.name}
                  </h3>
                  <p className="text-white/60 text-xs">
                    {method.description}
                  </p>
                </div>
                
                {isSelected && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
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
    </div>
  )
}

