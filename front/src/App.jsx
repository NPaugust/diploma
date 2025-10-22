import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
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
import TumorInfo from './components/TumorInfo'
import TumorDetail from './components/TumorDetail'
import Breadcrumbs from './components/Breadcrumbs'
import EducationalSelector from './components/EducationalSelector'
import { getHealthStatus } from './api/api'

function AppContent() {
  const { uploadedImage, predictionResult, setAvailableClasses, reset } = useAppStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Load available classes from API on startup
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const health = await getHealthStatus()
        if (health.classes && health.classes.length > 0) {
          setAvailableClasses(health.classes)
          console.log('Loaded classes from API:', health.classes)
        }
      } catch (error) {
        console.warn('Could not load classes from API, using defaults:', error)
      }
    }
    loadClasses()
  }, [setAvailableClasses])

  // Clear uploaded image when returning to home page
  useEffect(() => {
    if (location.pathname === '/') {
      reset()
    }
  }, [location.pathname, reset])

  // Removed auto-redirect to /analyze on home when an image exists.
  // Navigation is now triggered directly from ImageUpload after file selection.

  const handleTumorClick = (tumor) => {
    navigate(`/tumor-types/${tumor.id}`)
  }

  const handleBackToTumorInfo = () => {
    navigate('/tumor-types')
  }

  const handleAnalyzeClick = () => {
    navigate('/')
  }

  const handleNavigate = (path) => {
    navigate(path)
  }

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs = []
    
    if (pathSegments.length === 0) {
      return []
    }
    
    if (pathSegments[0] === 'tumor-types') {
      breadcrumbs.push({ label: 'Tumor Types', href: '/tumor-types' })
      
      if (pathSegments[1]) {
        // Get tumor name from the ID
        const tumorId = pathSegments[1]
        const tumorNames = {
          normal: 'Normal (No Tumor)',
          meningioma: 'Meningioma',
          schwannoma: 'Schwannoma',
          ganglioglioma: 'Ganglioglioma',
          granuloma: 'Granuloma',
          pituitary: 'Pituitary Adenoma',
          ependimoma: 'Ependimoma',
          germinoma: 'Germinoma',
          tuberculoma: 'Tuberculoma',
          glioma: 'Glioma',
          carcinoma: 'Carcinoma (Metastatic Tumor)',
          medulloblastoma: 'Medulloblastoma'
        }
        breadcrumbs.push({ label: tumorNames[tumorId] || tumorId })
      }
    } else if (pathSegments[0] === 'analyze') {
      breadcrumbs.push({ label: 'Analysis' })
    }
    
    return breadcrumbs
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header onViewChange={handleNavigate} currentView={location.pathname} />
      
      {/* Breadcrumbs */}
      {location.pathname !== '/' && (
        <div className="bg-accent-50 border-b border-accent-200">
          <div className="container mx-auto px-6 py-3 max-w-7xl">
            <Breadcrumbs items={generateBreadcrumbs()} />
          </div>
        </div>
      )}
      
      <Routes>
        <Route path="/" element={
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <ProjectIntro />
                  {/* Image upload on Home to allow adding photos immediately */}
                  <ImageUpload />
                  
                  {/* Educational Content Selector */}
                  <div className="card rounded-xl p-6 overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h3 className="text-primary-dark font-bold text-xl">Educational Resources</h3>
                    </div>
                    
                    <EducationalSelector />
                  </div>
                </div>
                
                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                  <div className="card rounded-xl p-6">
                    <h3 className="text-primary-dark font-bold mb-4">XAI Methods</h3>
                    <XAIMethodSelector />
                  </div>
                  
                  <MetricsPanel />
                  
                  <div className="card rounded-xl p-6">
                    <h3 className="text-primary-dark font-bold mb-4">FAQ</h3>
                    <FAQ />
                  </div>
                  
                  <FooterNote />
                </div>
              </div>
            </div>
          </main>
        } />
        
        <Route path="/tumor-types" element={
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <TumorInfo 
                onTumorClick={handleTumorClick}
                onAnalyzeClick={handleAnalyzeClick}
              />
            </div>
          </main>
        } />
        
        <Route path="/tumor-types/:tumorId" element={
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <TumorDetail 
                onBack={handleBackToTumorInfo}
                onAnalyze={handleAnalyzeClick}
              />
            </div>
          </main>
        } />
        
        <Route path="/analyze" element={
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <ImageUpload />
                  <ResultDisplay />
                </div>
                <div className="space-y-6">
                  <XAIMethodSelector />
                  <BatchUpload />
                  <MetricsPanel />
                  <FAQ />
                  <FooterNote />
                </div>
              </div>
            </div>
          </main>
        } />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App