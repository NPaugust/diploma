import { ArrowLeft, Brain, Heart, Shield, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import { useParams } from 'react-router-dom'
import TumorImage from './TumorImage'

const tumorData = {
  normal: {
    name: 'Normal (No Tumor)',
    severity: 'none',
    description: 'MRI shows normal brain structure',
    whatItIs: 'Your MRI shows normal brain structure without signs of tumors or other pathological changes.',
    symptoms: [],
    treatment: 'No treatment required. Continue maintaining a healthy lifestyle.',
    prognosis: 'Excellent prognosis. Regular preventive checkups are recommended.',
    urgency: 'No urgent action required',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle
  },
  meningioma: {
    name: 'Meningioma',
    severity: 'low',
    description: 'Benign tumor of brain membranes',
    whatItIs: 'Meningioma is a tumor that develops from the membranes of the brain (meninges). In most cases, it is benign and grows slowly.',
    symptoms: ['Headaches', 'Seizures', 'Weakness in limbs', 'Vision changes', 'Memory problems'],
    treatment: 'Many meningiomas can simply be observed. Surgery or radiation therapy is used when treatment is necessary.',
    prognosis: 'Usually has an excellent prognosis. Most patients live normal lives after treatment.',
    urgency: 'Routine monitoring by neurosurgeon',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: AlertCircle
  },
  schwannoma: {
    name: 'Schwannoma',
    severity: 'low',
    description: 'Benign tumor of nerve sheaths',
    whatItIs: 'Schwannoma is a benign tumor that develops from Schwann cells surrounding nerves. Most commonly affects the auditory nerve.',
    symptoms: ['Hearing loss', 'Tinnitus', 'Dizziness', 'Balance problems', 'Facial numbness'],
    treatment: 'Treatment includes observation, surgical removal, or radiation therapy depending on size and symptoms.',
    prognosis: 'Usually has an excellent prognosis. Most tumors grow slowly and are not malignant.',
    urgency: 'Routine monitoring by ENT or neurosurgeon',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    icon: AlertCircle
  },
  ganglioglioma: {
    name: 'Ganglioglioma',
    severity: 'low',
    description: 'Rare benign tumor from nerve cells',
    whatItIs: 'Ganglioglioma is a rare tumor consisting of a mixture of glial cells and neurons. Usually grows slowly and is considered benign.',
    symptoms: ['Seizures (most common symptom)', 'Headaches', 'Weakness in limbs', 'Speech problems'],
    treatment: 'Surgical removal is the main treatment method. In most cases, complete removal leads to cure.',
    prognosis: 'Usually has an excellent prognosis with complete surgical removal. Recurrences are rare.',
    urgency: 'Planned treatment by neurosurgeon',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: AlertCircle
  },
  granuloma: {
    name: 'Granuloma',
    severity: 'low',
    description: 'Inflammatory formation, not a tumor',
    whatItIs: 'Granuloma is an inflammatory formation that occurs in response to infection or foreign body. This is not a cancerous tumor.',
    symptoms: ['Headaches', 'Fever', 'Fatigue', 'Weight loss', 'Night sweats'],
    treatment: 'Treatment depends on the cause. May include antibiotics, anti-inflammatory drugs, or surgical removal.',
    prognosis: 'Usually has a good prognosis with proper treatment of the underlying cause.',
    urgency: 'Consultation with infectious disease specialist or neurologist',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: AlertCircle
  },
  pituitary: {
    name: 'Pituitary Adenoma',
    severity: 'medium',
    description: 'Pituitary tumor affecting hormones',
    whatItIs: 'Pituitary adenoma is a tumor of the pituitary gland, a small gland at the base of the brain that controls many hormones in the body.',
    symptoms: ['Headaches', 'Vision changes', 'Hormonal disorders', 'Fatigue', 'Weight changes'],
    treatment: 'Treatment may include surgery, radiation therapy, or medication depending on the type of tumor.',
    prognosis: 'Most patients have an excellent prognosis with proper treatment. Many tumors can be completely removed.',
    urgency: 'Consultation with endocrinologist and neurosurgeon',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: AlertCircle
  },
  ependimoma: {
    name: 'Ependimoma',
    severity: 'medium',
    description: 'Tumor from ependymal cells of brain ventricles',
    whatItIs: 'Ependimoma is a tumor that develops from ependymal cells lining the brain ventricles and central canal of the spinal cord.',
    symptoms: ['Headaches', 'Nausea and vomiting', 'Balance problems', 'Weakness in limbs', 'Vision changes'],
    treatment: 'Main treatment is surgical removal. Radiation therapy may be additionally required.',
    prognosis: 'Prognosis depends on tumor location and possibility of complete removal. Many patients have good long-term outcomes.',
    urgency: 'Consultation with neurosurgeon',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: AlertCircle
  },
  germinoma: {
    name: 'Germinoma',
    severity: 'medium',
    description: 'Tumor from germ cells, more common in young people',
    whatItIs: 'Germinoma is a tumor that develops from germ cells. Most commonly occurs in children and young adults.',
    symptoms: ['Headaches', 'Nausea and vomiting', 'Hormonal problems', 'Vision changes', 'Fatigue'],
    treatment: 'Very sensitive to radiation therapy and chemotherapy. Surgery may be required for biopsy or partial removal.',
    prognosis: 'With proper treatment has an excellent prognosis with high cure rates.',
    urgency: 'Consultation with oncologist and endocrinologist',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    icon: AlertCircle
  },
  tuberculoma: {
    name: 'Tuberculoma',
    severity: 'medium',
    description: 'Formation caused by tuberculosis infection',
    whatItIs: 'Tuberculoma is a formation in the brain caused by tuberculosis infection. This is not a cancerous tumor, but an inflammatory reaction to infection.',
    symptoms: ['Headaches', 'Fever', 'Fatigue', 'Weight loss', 'Night sweats', 'Seizures'],
    treatment: 'Treatment includes a long course of anti-tuberculosis drugs. Surgery may be required in complex cases.',
    prognosis: 'With proper treatment has a good prognosis. It is important to complete the full course of treatment.',
    urgency: 'Consultation with infectious disease specialist and neurologist',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    icon: AlertCircle
  },
  glioma: {
    name: 'Glioma',
    severity: 'high',
    description: 'Tumor from glial cells of the brain',
    whatItIs: 'Glioma is a tumor that develops from glial cells (supporting cells of the brain). Includes various types, from benign to very aggressive.',
    symptoms: ['Headaches', 'Seizures', 'Weakness in limbs', 'Speech problems', 'Behavioral changes', 'Nausea and vomiting'],
    treatment: 'Treatment includes surgery, radiation therapy, chemotherapy, and targeted therapy depending on type and grade.',
    prognosis: 'Prognosis varies greatly depending on glioma type. Some have excellent prognosis, others require aggressive treatment.',
    urgency: 'Immediate consultation with neuro-oncologist',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle
  },
  carcinoma: {
    name: 'Carcinoma (Metastatic Tumor)',
    severity: 'high',
    description: 'Secondary tumor spread from another organ',
    whatItIs: 'Carcinoma is a secondary brain tumor that occurs when cancer cells from other parts of the body (e.g., lungs, breast, kidneys) spread to the brain through the bloodstream.',
    symptoms: ['Headaches', 'Nausea and vomiting', 'Seizures', 'Weakness in limbs', 'Speech problems', 'Behavioral changes'],
    treatment: 'Treatment includes surgical removal, radiation therapy, chemotherapy, and steroid drugs to reduce swelling.',
    prognosis: 'Prognosis depends on the primary tumor and number of metastases. Early detection improves treatment outcomes.',
    urgency: 'Immediate consultation with oncologist',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle
  },
  medulloblastoma: {
    name: 'Medulloblastoma',
    severity: 'high',
    description: 'Aggressive cerebellar tumor, more common in children',
    whatItIs: 'Medulloblastoma is a fast-growing cerebellar tumor that most commonly occurs in children. Can spread through cerebrospinal fluid.',
    symptoms: ['Headaches', 'Nausea and vomiting', 'Balance problems', 'Coordination disorders', 'Behavioral changes'],
    treatment: 'Treatment includes surgery, radiation therapy, and chemotherapy. Requires multidisciplinary approach.',
    prognosis: 'Prognosis has improved with modern treatment methods. Many patients achieve long-term survival.',
    urgency: 'Immediate consultation with pediatric neuro-oncologist',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: AlertCircle
  }
}

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'none': return 'text-green-600 bg-green-50 border-green-200'
    case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'high': return 'text-red-600 bg-red-50 border-red-200'
    default: return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

const getSeverityText = (severity) => {
  switch (severity) {
    case 'none': return 'Normal'
    case 'low': return 'Low Risk'
    case 'medium': return 'Medium Risk'
    case 'high': return 'High Risk'
    default: return 'Unknown'
  }
}

export default function TumorDetail({ onBack, onAnalyze }) {
  const { tumorId } = useParams()
  const tumor = tumorData[tumorId]
  if (!tumor) return null

  const Icon = tumor.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-accent-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Image and Basic Info */}
        <div className="lg:col-span-1">
          <div className="card rounded-xl p-6 sticky top-6">
            <div className="w-full h-85 rounded-lg overflow-hidden mb-6">
              <TumorImage tumorType={tumorId} className="w-full h-full object-cover" />
            </div>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-primary-dark mb-2">{tumor.name}</h1>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(tumor.severity)}`}>
                {getSeverityText(tumor.severity)}
              </div>
              <p className="text-secondary-dark mt-3">{tumor.description}</p>
            </div>

            <div className="mt-6">
              <button
                onClick={onAnalyze}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Brain className="w-4 h-4" />
                Analyze My Scan
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* What is it */}
          <div className="card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold text-primary-dark">What is {tumor.name}?</h2>
            </div>
            <p className="text-secondary-dark leading-relaxed">{tumor.whatItIs}</p>
          </div>

          {/* Symptoms */}
          {tumor.symptoms.length > 0 && (
            <div className="card rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-bold text-primary-dark">Common Symptoms</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tumor.symptoms.map((symptom, index) => (
                  <div key={index} className="bg-accent-50 rounded-lg px-4 py-3 text-secondary-dark">
                    {symptom}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Treatment & Prognosis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-primary-dark">Treatment</h2>
            </div>
            <p className="text-secondary-dark leading-relaxed">{tumor.treatment}</p>
          </div>

          <div className="card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-primary-dark">Prognosis</h2>
            </div>
            <p className="text-secondary-dark leading-relaxed">{tumor.prognosis}</p>
            </div>
          </div>

          {/* Urgency */}
          <div className="card rounded-xl p-6 bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h2 className="text-xl font-bold text-primary-dark">Next Steps</h2>
            </div>
            <p className="text-secondary-dark leading-relaxed">{tumor.urgency}</p>
          </div>

          {/* Important Notice */}
          <div className="card rounded-xl p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-blue-800 font-semibold mb-2">Important Information</h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  This analysis is performed using artificial intelligence and is intended only for preliminary assessment. 
                  For accurate diagnosis, always consult a qualified doctor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
