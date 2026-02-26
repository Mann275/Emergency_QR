import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../utils/api';

const CreateProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    dateOfBirth: '',
    bloodGroup: '',
    gender: '',
    
    // Contact Information
    phone: '',
    alternatePhone: '',
    emergencyContact: {
      name: '',
      phone: ''
    },
    
    // Medical Information
    disease: false,
    diseaseDetails: '',
    allergies: '',
    medications: '',
    
    // Other Information
    address: '',
    notes: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.bloodGroup || !formData.phone || 
          !formData.emergencyContact.name || !formData.emergencyContact.phone) {
        throw new Error('Please fill in all required fields');
      }

      // Log the data being sent for debugging
      console.log('Form data being sent:', formData);

      const response = await ApiService.createUser(formData);
      
      if (response.success) {
        navigate(`/success/${response.data.uniqueId}`, {
          state: { qrCode: response.data.qrCode, profileUrl: response.data.profileUrl }
        });
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message || 'Failed to create emergency profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="emergency-header">Create Your Emergency Profile</h1>
          <p className="text-gray-600">
            Fill in your details to create a QR code for emergency situations
          </p>
        </div>

        <div className="emergency-card">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                👤 Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="emergency-label">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="emergency-label">
                    Blood Group *
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select blood group</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="emergency-label">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="emergency-label">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select gender</option>
                    {genderOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📞 Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="emergency-label">
                    Primary Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    required
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="emergency-label">
                    Alternate Phone Number
                  </label>
                  <input
                    type="tel"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+1 (555) 987-6543"
                  />
                </div>
                
                <div>
                  <label className="emergency-label">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={formData.emergencyContact.name}
                    onChange={handleChange}
                    className="input-field"
                    required
                    placeholder="Contact person name"
                  />
                </div>
                
                <div>
                  <label className="emergency-label">
                    Emergency Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact.phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleChange}
                    className="input-field"
                    required
                    placeholder="+1 (555) 111-2222"
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                🏥 Medical Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="disease"
                      checked={formData.disease}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-emergency-600 focus:ring-emergency-500"
                    />
                    <span className="emergency-label mb-0">I have existing medical conditions</span>
                  </label>
                </div>
                
                {formData.disease && (
                  <div>
                    <label className="emergency-label">
                      Disease/Condition Details
                    </label>
                    <textarea
                      name="diseaseDetails"
                      value={formData.diseaseDetails}
                      onChange={handleChange}
                      className="input-field"
                      rows="3"
                      placeholder="Describe your medical conditions..."
                    />
                  </div>
                )}
                
                <div>
                  <label className="emergency-label">
                    Allergies
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Food, drug, or other allergies..."
                  />
                </div>
                
                <div>
                  <label className="emergency-label">
                    Current Medications
                  </label>
                  <input
                    type="text"
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="List current medications..."
                  />
                </div>
              </div>
            </div>

            {/* Other Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📍 Additional Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="emergency-label">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Your address (optional)"
                  />
                </div>
                
                <div>
                  <label className="emergency-label">
                    Notes for Emergency Responders
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="input-field"
                    rows="3"
                    placeholder="Any additional information for emergency responders..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-lg px-8 py-3 disabled:opacity-50"
              >
                {loading ? 'Creating Profile...' : 'Create Emergency Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;