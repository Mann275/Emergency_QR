const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-emergency-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚕</span>
              </div>
              <span className="font-bold text-lg">Emergency QR</span>
            </div>
            <p className="text-gray-300 text-sm">
              Instant access to medical and contact information during emergencies.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Emergency Info</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Keep your QR code on your phone</li>
              <li>• Update information regularly</li>
              <li>• Share with trusted contacts</li>
              <li>• For emergency use only</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Privacy & Security</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Read-only emergency access</li>
              <li>• No login required for scanning</li>
              <li>• Secure data handling</li>
              <li>• Emergency use only</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} Emergency QR. Built for emergency assistance.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;