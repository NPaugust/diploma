import { CheckCircle, AlertCircle, TrendingUp, Heart, Brain, Shield, Info, ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import useAppStore from '../store/useAppStore'

const classInfo = {
  carcinoma: {
    label: 'Carcinoma (Metastatic Tumor)',
    shortLabel: 'Carcinoma',
    color: 'text-red-500',
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    icon: AlertCircle,
    severity: 'high',
    description: 'Secondary tumor spread from another organ',
    whatItIs: 'Carcinoma is a secondary brain tumor that occurs when cancer cells from other parts of the body (e.g., lungs, breast, kidneys) spread to the brain through the bloodstream.',
    symptoms: ['Headaches', 'Nausea and vomiting', 'Seizures', 'Weakness in limbs', 'Speech problems', 'Behavioral changes'],
    treatment: 'Treatment includes surgical removal, radiation therapy, chemotherapy, and steroid drugs to reduce swelling.',
    prognosis: 'Prognosis depends on the primary tumor and number of metastases. Early detection improves outcomes.',
    urgency: 'Immediate consultation with oncologist'
  },
  ependimoma: {
    label: 'Ependimoma',
    shortLabel: 'Ependimoma',
    color: 'text-orange-500',
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/30',
    icon: AlertCircle,
    severity: 'medium',
    description: 'Tumor from ependymal cells of brain ventricles',
    whatItIs: 'Ependimoma is a tumor that develops from ependymal cells lining the brain ventricles and the central canal of the spinal cord.',
    symptoms: ['Headaches', 'Nausea and vomiting', 'Balance problems', 'Weakness in limbs', 'Vision changes'],
    treatment: 'Main treatment is surgical removal. Radiation therapy may additionally be required.',
    prognosis: 'Prognosis depends on location and ability to completely remove the tumor.',
    urgency: 'Consultation with neurosurgeon'
  },
  ganglioglioma: {
    label: 'Ganglioglioma',
    shortLabel: 'Ganglioglioma',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    icon: AlertCircle,
    severity: 'low',
    description: 'Rare benign tumor from nerve cells',
    whatItIs: 'Ganglioglioma is a rare tumor consisting of a mixture of glial cells and neurons. Usually slow-growing and benign.',
    symptoms: ['Seizures (most common symptom)', 'Headaches', 'Weakness in limbs', 'Speech problems'],
    treatment: 'Surgical removal is the main treatment. Complete removal often leads to cure.',
    prognosis: 'Usually excellent prognosis with complete resection. Recurrences are rare.',
    urgency: 'Planned treatment by neurosurgeon'
  },
  germinoma: {
    label: 'Germinoma',
    shortLabel: 'Germinoma',
    color: 'text-pink-500',
    bg: 'bg-pink-500/20',
    border: 'border-pink-500/30',
    icon: AlertCircle,
    severity: 'medium',
    description: 'Tumor from germ cells, more common in young people',
    whatItIs: 'Germinoma is a tumor that develops from germ cells, most common in children and young adults.',
    symptoms: ['Headaches', 'Nausea and vomiting', 'Hormonal problems', 'Vision changes', 'Fatigue'],
    treatment: 'Highly sensitive to radiation therapy and chemotherapy. Surgery may be required for biopsy or partial removal.',
    prognosis: 'Excellent prognosis with proper treatment.',
    urgency: 'Consultation with oncologist and endocrinologist'
  },
  glioma: {
    label: 'Glioma',
    shortLabel: 'Glioma',
    color: 'text-danger-500',
    bg: 'bg-danger-500/20',
    border: 'border-danger-500/30',
    icon: AlertCircle,
    severity: 'high',
    description: 'Tumor from glial brain cells',
    whatItIs: 'Glioma develops from glial (supporting) brain cells. Includes types from benign to highly aggressive.',
    symptoms: ['Headaches', 'Seizures', 'Weakness in limbs', 'Speech problems', 'Behavioral changes', 'Nausea and vomiting'],
    treatment: 'Treatment includes surgery, radiation therapy, chemotherapy, and targeted therapy depending on the type and grade.',
    prognosis: 'Prognosis varies widely depending on glioma type.',
    urgency: 'Immediate consultation with neuro-oncologist'
  },
  granuloma: {
    label: 'Granuloma',
    shortLabel: 'Granuloma',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/20',
    border: 'border-indigo-500/30',
    icon: AlertCircle,
    severity: 'low',
    description: 'Inflammatory lesion, not a tumor',
    whatItIs: 'Granuloma is an inflammatory formation in response to infection or foreign body. This is not a cancerous tumor.',
    symptoms: ['Headaches', 'Fever', 'Fatigue', 'Weight loss', 'Night sweats'],
    treatment: 'Treatment depends on the cause: antibiotics, anti-inflammatory drugs, or surgical removal.',
    prognosis: 'Good prognosis with proper treatment of the underlying cause.',
    urgency: 'Consultation with infectious disease specialist or neurologist'
  },
  medulloblastoma: {
    label: 'Medulloblastoma',
    shortLabel: 'Medulloblastoma',
    color: 'text-purple-500',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/30',
    icon: AlertCircle,
    severity: 'high',
    description: 'Aggressive cerebellar tumor, more common in children',
    whatItIs: 'Medulloblastoma is a fast-growing cerebellar tumor, most common in children. Can spread through cerebrospinal fluid.',
    symptoms: ['Headaches', 'Nausea and vomiting', 'Balance problems', 'Coordination disorders', 'Behavioral changes'],
    treatment: 'Treatment includes surgery, radiation therapy, and chemotherapy. Requires a multidisciplinary approach.',
    prognosis: 'Prognosis has improved with modern treatments; many achieve long-term survival.',
    urgency: 'Immediate consultation with pediatric neuro-oncologist'
  },
  meningioma: {
    label: 'Meningioma',
    shortLabel: 'Meningioma',
    color: 'text-warning-500',
    bg: 'bg-warning-500/20',
    border: 'border-warning-500/30',
    icon: AlertCircle,
    severity: 'low',
    description: 'Benign tumor of brain membranes',
    whatItIs: 'Meningioma develops from brain membranes (meninges). Mostly benign and slow-growing.',
    symptoms: ['Headaches', 'Seizures', 'Weakness in limbs', 'Vision changes', 'Memory problems'],
    treatment: 'Many meningiomas can be observed. Surgery or radiation therapy is used when needed.',
    prognosis: 'Usually excellent prognosis; most patients live normal lives after treatment.',
    urgency: 'Routine follow-up with neurosurgeon'
  },
  normal: {
    label: 'Normal (No Tumor)',
    shortLabel: 'Normal',
    color: 'text-success-500',
    bg: 'bg-success-500/20',
    border: 'border-success-500/30',
    icon: CheckCircle,
    severity: 'none',
    description: 'MRI shows normal brain structure',
    whatItIs: 'Your MRI shows normal brain structure without signs of tumors or other pathological changes.',
    symptoms: [],
    treatment: 'No treatment required. Maintain a healthy lifestyle.',
    prognosis: 'Excellent prognosis. Regular preventive checkups recommended.',
    urgency: 'No urgent action required'
  },
  pituitary: {
    label: 'Pituitary Adenoma',
    shortLabel: 'Pituitary',
    color: 'text-primary-500',
    bg: 'bg-primary-500/20',
    border: 'border-primary-500/30',
    icon: AlertCircle,
    severity: 'medium',
    description: 'Pituitary tumor affecting hormones',
    whatItIs: 'Pituitary adenoma is a tumor of the pituitary gland that controls many hormones in the body.',
    symptoms: ['Headaches', 'Vision changes', 'Hormonal disorders', 'Fatigue', 'Weight changes'],
    treatment: 'Treatment may include surgery, radiation therapy, or medication depending on tumor type.',
    prognosis: 'Most patients have an excellent prognosis with proper treatment; many tumors can be fully removed.',
    urgency: 'Consultation with endocrinologist and neurosurgeon'
  },
  schwannoma: {
    label: 'Schwannoma',
    shortLabel: 'Schwannoma',
    color: 'text-teal-500',
    bg: 'bg-teal-500/20',
    border: 'border-teal-500/30',
    icon: AlertCircle,
    severity: 'low',
    description: 'Benign tumor of nerve sheaths',
    whatItIs: 'Schwannoma is a benign tumor developing from Schwann cells around nerves, often affecting the auditory nerve.',
    symptoms: ['Hearing loss', 'Tinnitus', 'Dizziness', 'Balance problems', 'Facial numbness'],
    treatment: 'Observation, surgical removal, or radiation therapy depending on size and symptoms.',
    prognosis: 'Usually excellent prognosis; most grow slowly and are not malignant.',
    urgency: 'Routine follow-up with ENT or neurosurgeon'
  },
  tuberculoma: {
    label: 'Tuberculoma',
    shortLabel: 'Tuberculoma',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/30',
    icon: AlertCircle,
    severity: 'medium',
    description: 'Lesion caused by tuberculosis infection',
    whatItIs: 'Tuberculoma is a brain lesion caused by tuberculosis infection; it is an inflammatory reaction, not a cancer.',
    symptoms: ['Headaches', 'Fever', 'Fatigue', 'Weight loss', 'Night sweats', 'Seizures'],
    treatment: 'Long course of anti‑tuberculosis drugs; surgery in complex cases.',
    prognosis: 'Good prognosis with proper treatment; completing full course is important.',
    urgency: 'Consultation with infectious disease specialist and neurologist'
  },
}

export default function ResultDisplay() {
  const { predictionResult, xaiResult, selectedMethod, uploadedImage, setXaiResult, setIsLoading, setError, isLoading } = useAppStore()

         // Auto-update XAI explanation when method changes
         useEffect(() => {
           if (!uploadedImage || !predictionResult) return

           const updateXAI = async () => {
             setIsLoading(true)
             setError(null)
             setXaiResult(null) // Очищаем предыдущий результат
      
      try {
        const formData = new FormData()
        formData.append('file', uploadedImage)
        formData.append('method', selectedMethod)
        formData.append('predicted_class', predictionResult.predicted_class)

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/explain`,
          {
            method: 'POST',
            body: formData,
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
          console.error(`XAI Error - Method: ${selectedMethod}, Status: ${response.status}, Error:`, errorData)
          throw new Error(`HTTP error! status: ${response.status} - ${errorData.detail || 'Unknown error'}`)
        }

        const result = await response.json()
        console.log(`XAI Update - Method: ${selectedMethod}, Result:`, result)
        setXaiResult(result)
      } catch (error) {
        console.error('XAI update error:', error)
        setError(`Failed to get ${selectedMethod} explanation: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    updateXAI()
  }, [selectedMethod, uploadedImage, predictionResult, setXaiResult, setIsLoading, setError])

  if (!predictionResult) return null

  const predictedClass = predictionResult.predicted_class
  const info = classInfo[predictedClass] || classInfo.normal
  const Icon = info.icon

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'none': return 'text-green-500 bg-green-500/20 border-green-500/30'
      case 'low': return 'text-blue-500 bg-blue-500/20 border-blue-500/30'
      case 'medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30'
      case 'high': return 'text-red-500 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-500 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'none': return 'Normal'
      case 'low': return 'Low risk'
      case 'medium': return 'Medium risk'
      case 'high': return 'High risk'
      default: return 'Unknown'
    }
  }

  return (
    <div className="space-y-6 h-full">
      {/* Main Result Card */}
      <div className="card rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-primary-dark">MRI Analysis Result</h2>
        </div>
        
        {/* Diagnosis Card */}
        <div className={`${info.bg} ${info.border} border rounded-2xl p-6 mb-6`}>
          <div className="flex items-start gap-4">
            <div className={`${info.color} bg-white p-4 rounded-2xl flex-shrink-0 shadow-sm`}>
              <Icon className="w-8 h-8" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-primary-dark">
                  {info.label}
                </h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(info.severity)}`}>
                  {getSeverityText(info.severity)}
                </div>
              </div>
              
              <p className="text-secondary-dark text-lg mb-3">
                {info.description}
              </p>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <span className="text-secondary-dark text-lg">
                  AI Confidence: {(predictionResult.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* What is it */}
          <div className="card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-primary-600" />
              <h4 className="text-primary-dark font-semibold">What does this mean?</h4>
            </div>
            <p className="text-secondary-dark text-sm leading-relaxed">
              {info.whatItIs}
            </p>
          </div>

          {/* Urgency */}
          <div className="card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-warning-600" />
              <h4 className="text-primary-dark font-semibold">What to do next?</h4>
            </div>
            <p className="text-secondary-dark text-sm leading-relaxed">
              {info.urgency}
            </p>
          </div>
        </div>

        {/* Symptoms */}
        {info.symptoms && info.symptoms.length > 0 && (
          <div className="card rounded-xl p-5 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-red-500" />
              <h4 className="text-primary-dark font-semibold">Possible Symptoms</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {info.symptoms.map((symptom, index) => (
                <div key={index} className="bg-accent-100 rounded-lg px-3 py-2 text-secondary-dark text-sm">
                  {symptom}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Treatment & Prognosis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-green-600" />
              <h4 className="text-primary-dark font-semibold">Treatment</h4>
            </div>
            <p className="text-secondary-dark text-sm leading-relaxed">
              {info.treatment}
            </p>
          </div>

          <div className="card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="text-primary-dark font-semibold">Prognosis</h4>
            </div>
            <p className="text-secondary-dark text-sm leading-relaxed">
              {info.prognosis}
            </p>
          </div>
        </div>


        {/* Important Note */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-blue-800 font-semibold mb-1">Important Information</h5>
              <p className="text-blue-800 text-sm">
                This analysis is performed using artificial intelligence and is intended only for preliminary assessment. 
                For accurate diagnosis, always consult a qualified doctor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* XAI Explanation */}
      {xaiResult && (
        <div className="card rounded-2xl p-6 shadow-lg">
                 <div className="flex items-center gap-3 mb-6">
                   <Brain className="w-6 h-6 text-primary-600" />
                   <h2 className="text-xl font-bold text-primary-dark">
                     AI Explanation ({selectedMethod.toUpperCase()})
                   </h2>
                 </div>
          <div className="card rounded-xl p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-secondary-dark">Generating {selectedMethod} explanation...</p>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={`data:image/png;base64,${xaiResult.explanation_image_base64 || xaiResult.explanation_image || ''}`}
                  alt="XAI Explanation"
                  className="w-full rounded-lg shadow-lg"
                />
                       <div className="mt-3 text-center">
                         <p className="text-secondary-dark text-sm mb-2">
                           Highlighted areas show what the AI focused on during analysis
                         </p>
                         {selectedMethod === 'gradcam' && (
                           <p className="text-accent-dark text-xs">
                             Grad-CAM shows which brain regions the model used for classification using gradient information
                           </p>
                         )}
                         {selectedMethod === 'shap' && (
                           <p className="text-accent-dark text-xs">
                             SHAP shows feature importance using Shapley values - red areas contribute positively to the prediction
                           </p>
                         )}
                         {selectedMethod === 'lime' && (
                           <p className="text-accent-dark text-xs">
                             LIME provides local explanations by analyzing how small changes affect the prediction
                           </p>
                         )}
                       </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Probability Distribution */}
      {predictionResult.probabilities && (
        <div className="card rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-primary-dark mb-4">Probability Distribution</h3>
          <div className="space-y-3">
            {Object.entries(predictionResult.probabilities)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([cls, prob]) => {
                const clsInfo = classInfo[cls] || classInfo.normal
                const percentage = (prob * 100).toFixed(1)
                
                return (
                  <div key={cls} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-dark">{clsInfo.shortLabel}</span>
                      <span className="text-primary-dark font-medium">{percentage}%</span>
                    </div>
                    <div className="w-full bg-accent-200 rounded-full h-2">
                      <div
                        className={`h-full rounded-full ${clsInfo.bg} ${clsInfo.color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}