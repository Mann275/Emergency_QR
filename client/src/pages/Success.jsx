import { useParams, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';

const Success = () => {
  const { id } = useParams();
  const location = useLocation();
  const { qrCode, profileUrl } = location.state || {};
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownload = () => {
    if (!qrCode) return;

    // Create download link for QR code
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `emergency-qr-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadComplete(true);
  };

  const handleShare = async () => {
    if (navigator.share && profileUrl) {
      try {
        await navigator.share({
          title: 'Emergency QR Profile',
          text: 'My Emergency QR Profile - Scan for emergency contact and medical information',
          url: profileUrl
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      if (profileUrl) {
        navigator.clipboard.writeText(profileUrl);
        alert('Profile URL copied to clipboard!');
      }
    }
  };

  if (!qrCode || !profileUrl) {
    return (
      <div className="min-h-screen py-12 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Profile Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            Unable to load your emergency profile information.
          </p>
          <Link to="/create" className="btn-primary">
            Create New Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Emergency Profile Created Successfully!
          </h1>
          <p className="text-gray-600">
            Your QR code is ready. Follow the steps below to set it up.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Display */}
          <div className="emergency-card text-center">
            <h2 className="text-xl font-semibold mb-4">Your Emergency QR Code</h2>
            
            {qrCode && (
              <div className="mb-6">
                <img 
                  src={qrCode} 
                  alt="Emergency QR Code" 
                  className="mx-auto border-2 border-gray-200 rounded-lg"
                  style={{ width: '250px', height: '250px' }}
                />
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={handleDownload}
                className="btn-primary w-full"
              >
                📥 Download QR Code
              </button>
              
              <button
                onClick={handleShare}
                className="btn-secondary w-full"
              >
                📤 Share Profile URL
              </button>
            </div>
            
            {downloadComplete && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                ✓ QR code downloaded successfully!
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="emergency-card">
            <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emergency-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <div>
                  <h3 className="font-medium text-gray-900">Print the QR Code</h3>
                  <p className="text-sm text-gray-600">
                    Print it as a small sticker (1-2 inches) for best results.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emergency-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <div>
                  <h3 className="font-medium text-gray-900">Place on Your Phone</h3>
                  <p className="text-sm text-gray-600">
                    Stick it on the back of your phone case or inside your phone case.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emergency-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <div>
                  <h3 className="font-medium text-gray-900">Test the QR Code</h3>
                  <p className="text-sm text-gray-600">
                    Scan it with any QR code reader to make sure it works.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emergency-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <div>
                  <h3 className="font-medium text-gray-900">Keep Information Updated</h3>
                  <p className="text-sm text-gray-600">
                    Remember to update your profile if your medical information changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Preview */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold mb-4">Preview Your Emergency Profile</h3>
          <Link 
            to={`/emergency/${id}`}
            className="btn-secondary"
            target="_blank"
          >
            👁️ View Emergency Profile
          </Link>
        </div>

        {/* Important Notes */}
        <div className="mt-12 emergency-highlight">
          <h3 className="font-semibold text-emergency-700 mb-3">
            🚨 Important Notes
          </h3>
          <ul className="text-sm text-emergency-600 space-y-1">
            <li>• This QR code provides access to your emergency information without login</li>
            <li>• Only share with trusted contacts or for emergency use</li>
            <li>• Keep your contact information up to date</li>
            <li>• Consider having multiple copies (wallet, car, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Success;