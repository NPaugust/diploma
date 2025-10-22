import { Brain, Eye, Shield, Info } from 'lucide-react'
import ImageUpload from './ImageUpload'

export default function ProjectIntro() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Main Info */}
      <div className="space-y-6">
        <div className="card rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-primary-dark mb-4">
              AI-Powered Brain Tumor Classification
            </h2>
            <p className="text-secondary-dark text-lg">
              Advanced machine learning system using transfer learning and explainable AI 
              to classify brain tumors from MRI scans with high accuracy and transparency.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-primary-100 p-3 rounded-xl mb-3 inline-block">
                <Brain className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-primary-dark font-semibold mb-1 text-sm">Deep Learning</h3>
              <p className="text-muted-dark text-xs">
                Neural networks trained on thousands of MRI scans
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 p-3 rounded-xl mb-3 inline-block">
                <Eye className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-primary-dark font-semibold mb-1 text-sm">Explainable AI</h3>
              <p className="text-muted-dark text-xs">
                Visual explanations of diagnosis regions
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 p-3 rounded-xl mb-3 inline-block">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-primary-dark font-semibold mb-1 text-sm">Medical Grade</h3>
              <p className="text-muted-dark text-xs">
                Validated on clinical datasets
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="card rounded-xl p-6 bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-blue-800 font-semibold mb-3">How it works?</h4>
              <ol className="text-blue-700 text-sm space-y-2 list-decimal list-inside">
                <li>Upload your brain MRI scan</li>
                <li>AI analyzes the image and determines tumor type</li>
                <li>Get detailed explanation with visualization</li>
                <li>Learn about symptoms, treatment, and prognosis</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Upload Area */}
      <div className="card rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-primary-dark mb-2">
            Start Your Analysis
          </h3>
          <p className="text-secondary-dark">
            Upload your MRI scan to begin AI-powered brain tumor classification
          </p>
        </div>
        <ImageUpload />
      </div>
    </div>
  )
}