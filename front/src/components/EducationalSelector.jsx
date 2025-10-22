import { useState } from 'react'
import { ChevronDown, ChevronUp, Brain, Shield, Heart, Zap, Info } from 'lucide-react'

const educationalTopics = [
  {
    id: 'mri',
    title: 'Understanding MRI Scans',
    icon: Brain,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    content: {
      sections: [
        {
          title: 'What is MRI?',
          content: 'Magnetic Resonance Imaging (MRI) is a safe, non-invasive medical imaging technique that uses powerful magnets and radio waves to create detailed pictures of the brain and other body parts.'
        },
        {
          title: 'How does it work?',
          content: 'MRI machines create a strong magnetic field that aligns hydrogen atoms in your body. Radio waves are then used to create signals that are converted into detailed images by a computer.'
        },
        {
          title: 'Why is it important for brain tumor detection?',
          content: 'MRI provides excellent contrast between different brain tissues, making it the gold standard for detecting brain tumors, their size, location, and characteristics without any radiation exposure.'
        }
      ],
      highlight: {
        title: 'Safety First',
        content: 'MRI is completely safe with no radiation exposure. The procedure is painless and typically takes 30-60 minutes to complete.'
      }
    }
  },
  {
    id: 'early-detection',
    title: 'Importance of Early Detection',
    icon: Heart,
    color: 'text-red-600',
    bg: 'bg-red-100',
    content: {
      sections: [
        {
          title: 'Why early detection matters',
          content: 'Early detection of brain tumors significantly improves treatment outcomes and survival rates. The earlier a tumor is found, the more treatment options are available.'
        },
        {
          title: 'Warning signs to watch for',
          content: 'Common symptoms include persistent headaches, seizures, vision problems, memory issues, personality changes, and coordination difficulties.'
        },
        {
          title: 'When to see a doctor',
          content: 'If you experience any persistent neurological symptoms, especially headaches that worsen over time or new-onset seizures, consult a healthcare professional immediately.'
        }
      ],
      highlight: {
        title: 'Time is Critical',
        content: 'Studies show that early-stage brain tumors have significantly better treatment outcomes compared to advanced stages.'
      }
    }
  },
  {
    id: 'ai-technology',
    title: 'Our AI Technology',
    icon: Zap,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    content: {
      sections: [
        {
          title: 'Deep Learning Model',
          content: 'Our system uses ResNet50, a state-of-the-art convolutional neural network trained on thousands of medical MRI scans to identify brain tumor patterns.'
        },
        {
          title: 'Transfer Learning',
          content: 'We leverage pre-trained models and fine-tune them specifically for brain tumor classification, achieving high accuracy with limited medical data.'
        },
        {
          title: 'Explainable AI (XAI)',
          content: 'Our system provides visual explanations showing exactly which brain regions the AI focused on during analysis, ensuring transparency and trust.'
        }
      ],
      highlight: {
        title: 'Medical-Grade Accuracy',
        content: 'Our model achieves 91% accuracy on clinical datasets, comparable to expert radiologist performance.'
      }
    }
  },
  {
    id: 'brain-anatomy',
    title: 'Brain Anatomy & Regions',
    icon: Info,
    color: 'text-green-600',
    bg: 'bg-green-100',
    content: {
      sections: [
        {
          title: 'Major brain regions',
          content: 'The brain consists of the cerebrum (largest part), cerebellum (balance and coordination), and brainstem (vital functions like breathing and heart rate).'
        },
        {
          title: 'Common tumor locations',
          content: 'Tumors can occur anywhere in the brain, but common locations include the frontal lobe, temporal lobe, and cerebellum.'
        },
        {
          title: 'Impact on function',
          content: 'Tumor location determines symptoms and treatment approach. For example, frontal lobe tumors may affect personality, while cerebellar tumors affect balance.'
        }
      ],
      highlight: {
        title: 'Location Matters',
        content: 'The brain region where a tumor develops directly influences the symptoms and treatment options available.'
      }
    }
  },
  {
    id: 'treatment-options',
    title: 'Treatment Options',
    icon: Shield,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    content: {
      sections: [
        {
          title: 'Surgical removal',
          content: 'Complete or partial surgical removal is often the first-line treatment for accessible brain tumors, especially benign ones.'
        },
        {
          title: 'Radiation therapy',
          content: 'High-energy radiation is used to destroy tumor cells or slow their growth, often used when surgery is not possible or as adjuvant therapy.'
        },
        {
          title: 'Chemotherapy',
          content: 'Anti-cancer drugs are used to kill tumor cells, often combined with other treatments for aggressive or malignant tumors.'
        }
      ],
      highlight: {
        title: 'Multidisciplinary Approach',
        content: 'Modern brain tumor treatment involves a team of specialists including neurosurgeons, oncologists, and radiologists working together.'
      }
    }
  }
]

export default function EducationalSelector() {
  const [selectedTopic, setSelectedTopic] = useState('mri')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(true) // По умолчанию показываем контент

  const currentTopic = educationalTopics.find(topic => topic.id === selectedTopic)
  const Icon = currentTopic?.icon || Brain

  // При выборе новой темы автоматически показываем контент
  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId)
    setIsExpanded(false)
    setIsContentVisible(true) // Автоматически показываем контент
  }

  return (
    <div className="space-y-4">
      {/* Topic Selector */}
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 bg-accent-50 border border-accent-200 rounded-lg hover:bg-accent-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${currentTopic.bg} rounded-lg flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${currentTopic.color}`} />
            </div>
            <span className="text-primary-dark font-semibold">{currentTopic.title}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-accent-dark" />
          ) : (
            <ChevronDown className="w-5 h-5 text-accent-dark" />
          )}
        </button>

        {/* Dropdown Menu */}
        <div className={`absolute top-full left-0 right-0 mt-1 bg-white border border-accent-200 rounded-lg shadow-lg z-10 transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded 
            ? 'opacity-100 transform translate-y-0 max-h-80' 
            : 'opacity-0 transform -translate-y-2 max-h-0 pointer-events-none'
        }`}>
          <div className="py-1 max-h-80 overflow-y-auto">
            {educationalTopics.map((topic, index) => {
              const TopicIcon = topic.icon
              const isSelected = selectedTopic === topic.id
              return (
                <button
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic.id)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-accent-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    isSelected ? 'bg-accent-100' : ''
                  }`}
                  style={{
                    animationDelay: isExpanded ? `${index * 50}ms` : '0ms'
                  }}
                >
                  <div className={`w-8 h-8 ${topic.bg} rounded-lg flex items-center justify-center transition-transform duration-200 hover:scale-110`}>
                    <TopicIcon className={`w-5 h-5 ${topic.color}`} />
                  </div>
                  <span className="text-primary-dark font-medium">{topic.title}</span>
                  {isSelected && (
                    <svg className="ml-auto w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content Display */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        isContentVisible 
          ? 'opacity-100 max-h-screen transform translate-y-0' 
          : 'opacity-0 max-h-0 transform -translate-y-4'
      }`}>
        {currentTopic && (
          <div className="space-y-4 pt-4">
            {currentTopic.content.sections.map((section, index) => (
              <div 
                key={index}
                className={`transition-all duration-300 ease-out ${
                  isContentVisible 
                    ? 'opacity-100 transform translate-x-0' 
                    : 'opacity-0 transform -translate-x-4'
                }`}
                style={{
                  transitionDelay: isContentVisible ? `${index * 100 + 200}ms` : '0ms'
                }}
              >
                <h4 className="text-primary-dark font-semibold mb-2">{section.title}</h4>
                <p className="text-secondary-dark text-sm leading-relaxed">{section.content}</p>
              </div>
            ))}
            
            {/* Highlight Box */}
            <div 
              className={`bg-blue-50 border border-blue-200 rounded-lg p-4 transition-all duration-300 ease-out ${
                isContentVisible 
                  ? 'opacity-100 transform scale-100' 
                  : 'opacity-0 transform scale-95'
              }`}
              style={{
                transitionDelay: isContentVisible ? `${currentTopic.content.sections.length * 100 + 400}ms` : '0ms'
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 animate-pulse">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-blue-800 font-semibold text-sm mb-1">{currentTopic.content.highlight.title}</h5>
                  <p className="text-blue-700 text-xs">{currentTopic.content.highlight.content}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toggle Content Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => setIsContentVisible(!isContentVisible)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <div className={`transition-transform duration-300 ${isContentVisible ? 'rotate-180' : 'rotate-0'}`}>
            {isContentVisible ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          <span className="transition-all duration-200">
            {isContentVisible ? 'Hide Information' : 'Show Information'}
          </span>
        </button>
      </div>
    </div>
  )
}