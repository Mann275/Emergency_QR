import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../utils/api';

const EmergencyProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await ApiService.getUserById(id);
        if (response.success) {
          setProfile(response.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load emergency profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emergency-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading emergency profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="emergency-card max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Profile Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            {error || 'The emergency profile could not be found or has been deactivated.'}
          </p>
          <p className="text-sm text-gray-500">
            Please contact the profile owner for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Emergency Header */}
        <div className="bg-emergency-600 text-white rounded-lg p-6 mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            🚨 EMERGENCY PROFILE
          </h1>
          <p className="text-emergency-100">
            Critical medical and contact information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal & Blood Group - Most Important */}
          <div className="lg:col-span-3">
            <div className="emergency-card bg-emergency-50 border-l-4 border-emergency-600">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {profile.name}
                  </h2>
                  {profile.age && (
                    <p className="text-gray-600 text-lg">Age: {profile.age} years old</p>
                  )}
                </div>
                <div className="mt-4 md:mt-0 text-center">
                  <div className="blood-group-highlight bg-emergency-600 text-white px-6 py-3 rounded-lg">
                    <p className="text-sm font-medium">BLOOD GROUP</p>
                    <p className="text-3xl font-bold">{profile.bloodGroup}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="lg:col-span-2">
            <div className="emergency-card">
              <h3 className="text-xl font-semibold text-emergency-700 mb-4 flex items-center">
                📞 Emergency Contacts
              </h3>
              
              <div className="space-y-4">
                {/* Primary Phone */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Primary Phone</p>
                    <p className="text-lg text-gray-700">{ApiService.formatPhone(profile.phone)}</p>
                  </div>
                  <button
                    onClick={() => handleCall(profile.phone)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    📞 Call
                  </button>
                </div>

                {/* Emergency Contact */}
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{profile.emergencyContact.name}</p>
                    <p className="text-sm text-gray-600">Emergency Contact</p>
                    <p className="text-lg text-gray-700">{ApiService.formatPhone(profile.emergencyContact.phone)}</p>
                  </div>
                  <button
                    onClick={() => handleCall(profile.emergencyContact.phone)}
                    className="bg-emergency-600 hover:bg-emergency-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    🚨 Call
                  </button>
                </div>

                {/* Alternate Phone */}
                {profile.alternatePhone && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Alternate Phone</p>
                      <p className="text-lg text-gray-700">{ApiService.formatPhone(profile.alternatePhone)}</p>
                    </div>
                    <button
                      onClick={() => handleCall(profile.alternatePhone)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      📞 Call
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <div className="emergency-card">
              <h3 className="text-xl font-semibold text-emergency-700 mb-4 flex items-center">
                🏥 Medical Info
              </h3>
              
              <div className="space-y-4">
                {/* Diseases */}
                {profile.disease && profile.diseaseDetails && (
                  <div className="emergency-highlight">
                    <h4 className="font-medium text-emergency-700 mb-1">Medical Conditions</h4>
                    <p className="text-sm text-emergency-600">{profile.diseaseDetails}</p>
                  </div>
                )}

                {/* Allergies */}
                {profile.allergies && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                    <h4 className="font-medium text-yellow-800 mb-1">⚠️ Allergies</h4>
                    <p className="text-sm text-yellow-700">{profile.allergies}</p>
                  </div>
                )}

                {/* Medications */}
                {profile.medications && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                    <h4 className="font-medium text-blue-800 mb-1">💊 Medications</h4>
                    <p className="text-sm text-blue-700">{profile.medications}</p>
                  </div>
                )}

                {!profile.disease && !profile.allergies && !profile.medications && (
                  <p className="text-gray-500 text-sm italic">
                    No specific medical information provided
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Notes */}
          {profile.notes && (
            <div className="lg:col-span-3">
              <div className="emergency-card bg-yellow-50 border-l-4 border-yellow-500">
                <h3 className="text-xl font-semibold text-yellow-700 mb-3 flex items-center">
                  📝 Emergency Notes
                </h3>
                <p className="text-yellow-800 whitespace-pre-wrap">{profile.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500 space-y-1">
          <p>🚑 For Emergency Services: Call 911 immediately</p>
          <p>Profile ID: {profile.uniqueId}</p>
          {profile.lastUpdated && (
            <p>Last Updated: {new Date(profile.lastUpdated).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyProfile;