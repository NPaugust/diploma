import { Brain, AlertCircle, CheckCircle, Info, Shield, Heart, TrendingUp, ArrowRight } from 'lucide-react'
import TumorImage from './TumorImage'

const tumorTypes = [
  {
    id: 'normal',
    name: 'Normal (No Tumor)',
    severity: 'none',
    description: 'MRI shows normal brain structure',
    whatItIs: 'Your MRI shows normal brain structure without signs of tumors or other pathological changes.',
    symptoms: [],
    treatment: 'No treatment required. Continue maintaining a healthy lifestyle.',
    prognosis: 'Excellent prognosis. Regular preventive checkups are recommended.',
    ageGroups: 'All ages',
    frequency: 'Most common finding',
    treatmentMethods: 'None required',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle
  },
  {
    id: 'meningioma',
    name: 'Meningioma',
    severity: 'low',
    description: 'Benign tumor of brain membranes',
    whatItIs: 'Meningioma is a tumor that develops from the membranes of the brain (meninges). In most cases, it is benign and grows slowly.',
    symptoms: ['Headaches', 'Seizures', 'Weakness in limbs', 'Vision changes', 'Memory problems'],
    treatment: 'Many meningiomas can simply be observed. Surgery or radiation therapy is used when treatment is necessary.',
    prognosis: 'Usually has an excellent prognosis. Most patients live normal lives after treatment.',
    ageGroups: 'Adults 40-70 years (more common in women)',
    frequency: '~30% of all brain tumors',
    treatmentMethods: 'Observation, Surgery, Radiation therapy',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: AlertCircle
  },
  {
    id: 'schwannoma',
    name: 'Schwannoma',
    severity: 'low',
    description: 'Benign tumor of nerve sheaths',
    whatItIs: 'Schwannoma is a benign tumor that develops from Schwann cells surrounding nerves. Most commonly affects the auditory nerve.',
    symptoms: ['Hearing loss', 'Tinnitus', 'Dizziness', 'Balance problems', 'Facial numbness'],
    treatment: 'Treatment includes observation, surgical removal, or radiation therapy depending on size and symptoms.',
    prognosis: 'Usually has an excellent prognosis. Most tumors grow slowly and are not malignant.',
    ageGroups: 'Adults 30-60 years',
    frequency: '~8% of all brain tumors',
    treatmentMethods: 'Observation, Surgery, Radiation therapy',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    icon: AlertCircle
  },
  {
    id: 'ganglioglioma',
    name: 'Ganglioglioma',
    severity: 'low',
    description: 'Rare benign tumor from nerve cells',
    whatItIs: 'Ganglioglioma is a rare tumor consisting of a mixture of glial cells and neurons. Usually grows slowly and is considered benign.',
    symptoms: ['Seizures (most common symptom)', 'Headaches', 'Weakness in limbs', 'Speech problems'],
    treatment: 'Surgical removal is the main treatment method. In most cases, complete removal leads to cure.',
    prognosis: 'Usually has an excellent prognosis with complete surgical removal. Recurrences are rare.',
    ageGroups: 'Children and young adults (under 30)',
    frequency: '~1% of all brain tumors',
    treatmentMethods: 'Surgery (complete resection)',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: AlertCircle
  },
  {
    id: 'granuloma',
    name: 'Granuloma',
    severity: 'low',
    description: 'Inflammatory formation, not a tumor',
    whatItIs: 'Granuloma is an inflammatory formation that occurs in response to infection or foreign body. This is not a cancerous tumor.',
    symptoms: ['Headaches', 'Fever', 'Fatigue', 'Weight loss', 'Night sweats'],
    treatment: 'Treatment depends on the cause. May include antibiotics, anti-inflammatory drugs, or surgical removal.',
    prognosis: 'Usually has a good prognosis with proper treatment of the underlying cause.',
    ageGroups: 'All ages (depends on cause)',
    frequency: 'Rare finding',
    treatmentMethods: 'Antibiotics, Anti-inflammatory drugs, Surgery',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: AlertCircle
  },
  {
    id: 'pituitary',
    name: 'Pituitary Adenoma',
    severity: 'medium',
    description: 'Pituitary tumor affecting hormones',
    whatItIs: 'Pituitary adenoma is a tumor of the pituitary gland, a small gland at the base of the brain that controls many hormones in the body.',
    symptoms: ['Headaches', 'Vision changes', 'Hormonal disorders', 'Fatigue', 'Weight changes'],
    treatment: 'Treatment may include surgery, radiation therapy, or medication depending on the type of tumor.',
    prognosis: 'Most patients have an excellent prognosis with proper treatment. Many tumors can be completely removed.',
    ageGroups: 'Adults 30-50 years',
    frequency: '~15% of all brain tumors',
    treatmentMethods: 'Surgery, Radiation therapy, Hormone therapy',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: AlertCircle
  },
  {
    id: 'ependimoma',
    name: 'Ependimoma',
    severity: 'medium',
    description: 'Tumor from ependymal cells of brain ventricles',
    whatItIs: 'Ependimoma is a tumor that develops from ependymal cells lining the brain ventricles and central canal of the spinal cord.',
    symptoms: ['Headaches', 'Nausea and vomiting', 'Balance problems', 'Weakness in limbs', 'Vision changes'],
    treatment: 'Main treatment is surgical removal. Radiation therapy may be additionally required.',
    prognosis: 'Prognosis depends on tumor location and possibility of complete removal. Many patients have good long-term outcomes.',
    ageGroups: 'Children and young adults (under 40)',
    frequency: '~2% of all brain tumors',
    treatmentMethods: 'Surgery, Radiation therapy',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: AlertCircle
  },
  {
    id: 'germinoma',
    name: 'Germinoma',
    severity: 'medium',
    description: 'Tumor from germ cells, more common in young people',
    whatItIs: 'Germinoma is a tumor that develops from germ cells. Most commonly occurs in children and young adults.',
    symptoms: ['Headaches', 'Nausea and vomiting', 'Hormonal problems', 'Vision changes', 'Fatigue'],
    treatment: 'Very sensitive to radiation therapy and chemotherapy. Surgery may be required for biopsy or partial removal.',
    prognosis: 'With proper treatment has an excellent prognosis with high cure rates.',
    ageGroups: 'Children and adolescents (10-20 years)',
    frequency: '~1% of all brain tumors',
    treatmentMethods: 'Radiation therapy, Chemotherapy, Surgery',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    icon: AlertCircle
  },
  {
    id: 'tuberculoma',
    name: 'Tuberculoma',
    severity: 'medium',
    description: 'Formation caused by tuberculosis infection',
    whatItIs: 'Tuberculoma is a formation in the brain caused by tuberculosis infection. This is not a cancerous tumor, but an inflammatory reaction to infection.',
    symptoms: ['Headaches', 'Fever', 'Fatigue', 'Weight loss', 'Night sweats', 'Seizures'],
    treatment: 'Treatment includes a long course of anti-tuberculosis drugs. Surgery may be required in complex cases.',
    prognosis: 'With proper treatment has a good prognosis. It is important to complete the full course of treatment.',
    ageGroups: 'All ages (more common in developing countries)',
    frequency: 'Rare in developed countries',
    treatmentMethods: 'Anti-tuberculosis drugs, Surgery (if needed)',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    icon: AlertCircle
  },
  {
    id: 'glioma',
    name: 'Glioma',
    severity: 'high',
    description: 'Tumor from glial cells of the brain',
    whatItIs: 'Glioma is a tumor that develops from glial cells (supporting cells of the brain). Includes various types, from benign to very aggressive.',
    symptoms: ['Headaches', 'Seizures', 'Weakness in limbs', 'Speech problems', 'Behavioral changes', 'Nausea and vomiting'],
    treatment: 'Treatment includes surgery, radiation therapy, chemotherapy, and targeted therapy depending on type and grade.',
    prognosis: 'Prognosis varies greatly depending on glioma type. Some have excellent prognosis, others require aggressive treatment.',
    ageGroups: 'Adults 45-65 years (more common in men)',
    frequency: '~25% of all brain tumors',
    treatmentMethods: 'Surgery, Radiation therapy, Chemotherapy, Targeted therapy',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle
  },
  {
    id: 'carcinoma',
    name: 'Carcinoma (Metastatic Tumor)',
    severity: 'high',
    description: 'Secondary tumor spread from another organ',
    whatItIs: 'Carcinoma is a secondary brain tumor that occurs when cancer cells from other parts of the body (e.g., lungs, breast, kidneys) spread to the brain through the bloodstream.',
    symptoms: ['Headaches', 'Nausea and vomiting', 'Seizures', 'Weakness in limbs', 'Speech problems', 'Behavioral changes'],
    treatment: 'Treatment includes surgical removal, radiation therapy, chemotherapy, and steroid drugs to reduce swelling.',
    prognosis: 'Prognosis depends on the primary tumor and number of metastases. Early detection improves treatment outcomes.',
    ageGroups: 'Adults 50+ years (depends on primary cancer)',
    frequency: '~20% of all brain tumors',
    treatmentMethods: 'Surgery, Radiation therapy, Chemotherapy, Steroids',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle
  },
  {
    id: 'medulloblastoma',
    name: 'Medulloblastoma',
    severity: 'high',
    description: 'Aggressive cerebellar tumor, more common in children',
    whatItIs: 'Medulloblastoma is a fast-growing cerebellar tumor that most commonly occurs in children. Can spread through cerebrospinal fluid.',
    symptoms: ['Headaches', 'Nausea and vomiting', 'Balance problems', 'Coordination disorders', 'Behavioral changes'],
    treatment: 'Treatment includes surgery, radiation therapy, and chemotherapy. Requires multidisciplinary approach.',
    prognosis: 'Prognosis has improved with modern treatment methods. Many patients achieve long-term survival.',
    ageGroups: 'Children 3-10 years (most common)',
    frequency: '~2% of all brain tumors',
    treatmentMethods: 'Surgery, Radiation therapy, Chemotherapy',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: AlertCircle
  }
]

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

export default function TumorInfo({ onTumorClick, onAnalyzeClick }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-primary-dark">Brain Tumor Types</h1>
        </div>
        <p className="text-secondary-dark text-lg max-w-3xl mx-auto">
          Detailed information about different types of brain tumors, their symptoms, treatment, and prognosis
        </p>
      </div>

      {/* Severity Legend */}
      <div className="card rounded-xl p-6">
        <h3 className="text-primary-dark font-semibold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary-600" />
          Risk Levels
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-secondary-dark text-sm">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-secondary-dark text-sm">Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-secondary-dark text-sm">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-secondary-dark text-sm">High Risk</span>
          </div>
        </div>
      </div>

      {/* Tumor Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tumorTypes.map((tumor) => {
          const Icon = tumor.icon
          return (
            <div 
              key={tumor.id} 
              className="card-hover rounded-xl p-6 cursor-pointer"
              onClick={() => onTumorClick?.(tumor)}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <TumorImage tumorType={tumor.id} className="w-full h-full" />
                </div>
                <div className="flex-1">
                  <h3 className="text-primary-dark font-bold text-lg mb-1">{tumor.name}</h3>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(tumor.severity)}`}>
                    {getSeverityText(tumor.severity)}
                  </div>
                </div>
              </div>
              
              <p className="text-secondary-dark text-sm mb-4 leading-relaxed">
                {tumor.description}
              </p>
              
              {tumor.symptoms.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-primary-dark font-semibold text-sm mb-2 flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    Symptoms:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {tumor.symptoms.slice(0, 3).map((symptom, index) => (
                      <span key={index} className="bg-accent-100 rounded px-2 py-1 text-secondary-dark text-xs">
                        {symptom}
                      </span>
                    ))}
                    {tumor.symptoms.length > 3 && (
                      <span className="bg-accent-100 rounded px-2 py-1 text-secondary-dark text-xs">
                        +{tumor.symptoms.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-accent-dark font-medium">Age Groups:</span>
                  <span className="text-secondary-dark">{tumor.ageGroups}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-accent-dark font-medium">Frequency:</span>
                  <span className="text-secondary-dark">{tumor.frequency}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-accent-dark font-medium">Treatment:</span>
                  <span className="text-secondary-dark">{tumor.treatmentMethods}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary-600 text-sm font-medium">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    onAnalyzeClick?.()
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Analyze
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Important Notice */}
      <div className="card rounded-xl p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-blue-800 font-semibold mb-2">Important Information</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              This information is for educational purposes only and does not replace professional medical consultation. 
              If you suspect a brain tumor, immediately consult a qualified doctor for accurate diagnosis and appropriate treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}