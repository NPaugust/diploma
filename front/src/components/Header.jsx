import { Brain, Activity, User } from 'lucide-react'
import useAppStore from '../store/useAppStore'

export default function Header() {
  const { reset } = useAppStore()
  const handleHome = () => {
    // reset to initial state (landing screen)
    reset()
    // scroll to top just in case
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <header className="glass-dark border-b border-white/10">
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleHome}>
            <div className="relative" aria-label="Home">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg blur-md opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent" onClick={handleHome}>
                Brain Tumor Classification with XAI
              </h1>
              <p className="text-white/70 text-xs flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Transfer Learning & Explainable AI for MRI Analysis
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <span className="text-white text-sm font-medium">Research</span>
          </div>
        </div>
      </div>
    </header>
  )
}

