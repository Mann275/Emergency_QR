import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emergency-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚕</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Emergency QR</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/create" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Create Profile
            </Link>
          </nav>

          <Link 
            to="/create"
            className="btn-primary"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;