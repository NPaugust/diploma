import { ChevronRight, Home } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Breadcrumbs({ items }) {
  const navigate = useNavigate()
  return (
    <nav className="flex items-center space-x-2 text-sm text-secondary-dark">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center hover:text-primary-600 transition-colors"
      >
        <Home className="w-4 h-4 mr-1" />
        Home
      </button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-muted-dark" />
          {item.href ? (
            <Link 
              to={item.href}
              replace={false}
              className="hover:text-primary-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-primary-dark font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
