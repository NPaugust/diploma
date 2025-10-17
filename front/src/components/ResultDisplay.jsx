import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'
import useAppStore from '../store/useAppStore'

const classInfo = {
  no_tumor: {
    label: 'No Tumor',
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-500/20',
    icon: CheckCircle,
  },
  glioma: {
    label: 'Glioma',
    color: 'from-red-500 to-pink-500',
    bg: 'bg-red-500/20',
    icon: AlertCircle,
  },
  meningioma: {
    label: 'Meningioma',
    color: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-500/20',
    icon: AlertCircle,
  },
  pituitary: {
    label: 'Pituitary Adenoma',
    color: 'from-purple-500 to-violet-500',
    bg: 'bg-purple-500/20',
    icon: AlertCircle,
  },
}

export default function ResultDisplay() {
  const { predictionResult, xaiResult, selectedMethod } = useAppStore()

  if (!predictionResult) return null

  const predictedClass = predictionResult.predicted_class
  const info = classInfo[predictedClass] || classInfo.no_tumor
  const Icon = info.icon

  return (
    <div className="space-y-6 h-full">
      <div className="glass-dark rounded-2xl p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6">
          Classification Result
        </h2>
        
        <div className={`${info.bg} rounded-xl p-6 mb-6`}>
          <div className="flex items-center gap-4">
            <div className={`bg-gradient-to-br ${info.color} p-4 rounded-xl`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">
                {info.label}
              </h3>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-white/70" />
                <span className="text-white/80 text-lg">
                  Confidence: {(predictionResult.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {predictionResult.probabilities && (
          <div className="space-y-3">
            <h4 className="text-white font-semibold mb-3">
              Probability Distribution:
            </h4>
            
            {Object.entries(predictionResult.probabilities).map(([cls, prob]) => {
              const clsInfo = classInfo[cls] || classInfo.no_tumor
              const percentage = (prob * 100).toFixed(1)
              
              return (
                <div key={cls} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">{clsInfo.label}</span>
                    <span className="text-white font-semibold">{percentage}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5">
                    <div
                      className={`bg-gradient-to-r ${clsInfo.color} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {xaiResult && (
        <div className="glass-dark rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">
            XAI Explanation: {selectedMethod.toUpperCase()}
          </h2>
          
          <div className="rounded-xl overflow-hidden bg-black/30 mb-4">
            <img
              src={`data:image/png;base64,${xaiResult.explanation_image}`}
              alt="XAI Explanation"
              className="w-full h-auto"
            />
          </div>
          
          <p className="text-white/70 text-sm">
            The heatmap highlights regions of the MRI scan that most influenced the AI's classification decision. 
            Brighter, warmer colors indicate areas of higher importance.
          </p>
        </div>
      )}
    </div>
  )
}

