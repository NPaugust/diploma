import { Brain, Activity, User, Home, Info } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import useAppStore from '../store/useAppStore'

export default function Header({ onViewChange, currentView }) {
  const { reset } = useAppStore()
  const location = useLocation()
  
  const handleHome = () => {
    reset()
    onViewChange?.('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTumorInfo = () => {
    onViewChange?.('/tumor-types')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="bg-white border-b border-accent-200 shadow-sm">
      <div className="container mx-auto px-6 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer select-none" onClick={handleHome}>
            <div className="relative" aria-label="Home">
              <div className="bg-primary-600 p-3 rounded-xl shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-dark" onClick={handleHome}>
                Brain Tumor Classification with XAI
              </h1>
              <p className="text-secondary-dark text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Transfer Learning & Explainable AI for MRI Analysis
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Navigation */}
            <nav className="flex items-center gap-2">
              <Link
                to="/"
                onClick={handleHome}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  location.pathname === '/' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-secondary-dark hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Home</span>
              </Link>
              
              <Link
                to="/tumor-types"
                onClick={handleTumorInfo}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  location.pathname.startsWith('/tumor-types') 
                    ? 'bg-primary-600 text-white' 
                    : 'text-secondary-dark hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium">Tumor Types</span>
              </Link>
            </nav>
            
            <div className="flex items-center gap-3 bg-accent-50 border border-accent-200 px-4 py-2 rounded-xl">
              <img 
                src="/Ala-Too_International_University_Seal.png" 
                alt="Ala-Too University Logo" 
                className="w-6 h-6"
              />
              <span className="text-secondary-dark text-sm font-medium">Ala-Too International University Project</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}