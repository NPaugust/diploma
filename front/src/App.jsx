import Header from './components/Header'
import ImageUpload from './components/ImageUpload'
import ResultDisplay from './components/ResultDisplay'
import XAIMethodSelector from './components/XAIMethodSelector'
import useAppStore from './store/useAppStore'
import ProjectIntro from './components/ProjectIntro'
import MetricsPanel from './components/MetricsPanel'
import FAQ from './components/FAQ'
import FooterNote from './components/FooterNote'
import BatchUpload from './components/BatchUpload'

function App() {
  const { uploadedImage, predictionResult } = useAppStore()

  // State 1: No image - center upload
  if (!uploadedImage) {
    return (
      <div className="min-h-screen flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
          <div className="w-full max-w-3xl mx-auto glass-dark rounded-2xl p-10 shadow-2xl transform transition-all duration-500">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🧠</div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Brain Tumor Classification
              </h2>
              <p className="text-white/70">
                Upload an MRI scan to begin AI-powered analysis with explainable insights
              </p>
            </div>
            <ImageUpload />
          </div>
          <ProjectIntro />
          <MetricsPanel />
          <FAQ />
          <FooterNote />
        </main>
      </div>
    )
  }

  // State 2: Image uploaded but no results - show method selector
  if (!predictionResult) {
    return (
      <div className="min-h-screen flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid grid-cols-2 gap-6 h-full">
            <div className="glass-dark rounded-2xl p-6 shadow-2xl transform transition-all duration-500">
              <h2 className="text-xl font-bold text-white mb-4">
                Uploaded Image
              </h2>
              <ImageUpload />
            </div>
            
            <div className="glass-dark rounded-2xl p-6 shadow-2xl transform transition-all duration-500">
              <h2 className="text-xl font-bold text-white mb-4">
                Select XAI Method
              </h2>
              <p className="text-white/60 text-sm mb-6">
                Choose an explainability method to understand the AI's decision-making process
              </p>
              <XAIMethodSelector />
              <div className="mt-6">
                <BatchUpload />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // State 3: Results available - full analysis view
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-6 animate-fadeIn">
          {/* Left sidebar: Image preview & controls */}
          <div className="col-span-4 flex flex-col gap-4">
            <div className="glass-dark rounded-xl p-5 shadow-xl">
              <h3 className="text-sm font-semibold text-white/80 mb-3">
                Analyzed Image
              </h3>
              <ImageUpload />
            </div>
            
            <div className="glass-dark rounded-xl p-5 shadow-xl">
              <h3 className="text-sm font-semibold text-white/80 mb-3">
                XAI Method
              </h3>
              <XAIMethodSelector />
            </div>
          </div>
          
          {/* Right: Results */}
          <div className="col-span-8 h-full overflow-auto">
            <ResultDisplay />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

