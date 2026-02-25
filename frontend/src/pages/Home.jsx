import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emergency-50 to-medical-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Emergency QR
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Instant access to your medical and contact information during emergencies
            </p>
            <div className="space-x-4">
              <Link to="/create" className="btn-primary text-lg px-8 py-3">
                Create Your Profile
              </Link>
              <a href="#how-it-works" className="btn-secondary text-lg px-8 py-3">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emergency-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Fill Your Details</h3>
              <p className="text-gray-600">
                Enter your medical information, emergency contacts, and personal details
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emergency-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Get Your QR Code</h3>
              <p className="text-gray-600">
                Download and print your QR code sticker for your phone or wallet
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emergency-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚑</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Emergency Ready</h3>
              <p className="text-gray-600">
                First responders can instantly access your critical information
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Emergency Information Included
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="emergency-card">
              <h3 className="font-semibold text-lg mb-2 text-emergency-700">
                👤 Personal Information
              </h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Full Name</li>
                <li>• Blood Group</li>
                <li>• Date of Birth</li>
                <li>• Gender</li>
              </ul>
            </div>
            
            <div className="emergency-card">
              <h3 className="font-semibold text-lg mb-2 text-emergency-700">
                📞 Contact Information
              </h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Primary Phone</li>
                <li>• Alternate Phone</li>
                <li>• Emergency Contact</li>
                <li>• Contact Phone</li>
              </ul>
            </div>
            
            <div className="emergency-card">
              <h3 className="font-semibold text-lg mb-2 text-emergency-700">
                🏥 Medical Information
              </h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Existing Diseases</li>
                <li>• Allergies</li>
                <li>• Current Medications</li>
                <li>• Emergency Notes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emergency-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">
            Be Prepared for Any Emergency
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Create your emergency profile today and give yourself and your loved ones peace of mind
          </p>
          <Link 
            to="/create" 
            className="bg-white text-emergency-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
          >
            Create Your Emergency Profile
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;