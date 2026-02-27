import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../utils/api';
import { User, Droplets, Calendar, Phone, UserCheck, Pill, AlertTriangle, FileText, Loader2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { IN, US, GB, AU } from 'country-flag-icons/react/3x2';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

const CreateProfile = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneCode, setPhoneCode] = useState('+91');
  const [emergencyCode, setEmergencyCode] = useState('+91');

  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    bloodGroup: '',
    gender: '',
    phone: '',
    alternatePhone: '',
    emergencyContact: { name: '', phone: '' },
    disease: false,
    diseaseDetails: '',
    allergies: '',
    medications: '',
    address: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [field]: value },
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePhoneChange = (e, fieldPath) => {
    // Only allow numbers, up to 10 digits
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);

    if (fieldPath === 'phone') {
      setFormData(prev => ({ ...prev, phone: digitsOnly }));
    } else {
      setFormData(prev => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, phone: digitsOnly }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!formData.name || !formData.bloodGroup || !formData.phone || !formData.emergencyContact.name || !formData.emergencyContact.phone) {
        throw new Error('Please fill in all required fields.');
      }

      const payload = {
        ...formData,
        phone: `${phoneCode} ${formData.phone}`,
        emergencyContact: {
          ...formData.emergencyContact,
          phone: `${emergencyCode} ${formData.emergencyContact.phone}`
        }
      };

      const response = await ApiService.createUser(payload);
      if (response.success) {
        import('react-hot-toast').then(({ toast }) => {
          toast.success('Profile created successfully!', {
            icon: '🚀',
            style: {
              borderRadius: '20px',
              background: 'var(--surfaceRaised)',
              color: 'var(--ink)',
              padding: '16px',
            },
          });
        });
        navigate(`/success/${response.data.uniqueId}`, {
          state: { qrCode: response.data.qrCode, profileUrl: response.data.profileUrl },
        });
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    border: '1.5px solid var(--line)',
    color: 'var(--ink)',
    borderRadius: '16px',
    padding: '16px 20px',
    fontSize: '16px',
    fontWeight: '500',
    background: 'transparent',
    width: '100%',
    outline: 'none',
    transition: 'all 0.3s ease',
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '10px',
    color: 'var(--ink)',
    opacity: 0.8
  };

  const sectionHeadingStyle = {
    fontSize: '13px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'var(--ink)',
    opacity: 0.3,
    marginBottom: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="main-wrap max-w-2xl">

          <div className="animate-slide mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>
              {t.createTitle}
            </h1>
            <p className="text-base opacity-50 mt-4 leading-relaxed max-w-lg">
              {t.createDesc}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="animate-slide" style={{ animationDelay: '0.08s' }}>
            {error && (
              <div className="mb-8 p-5 rounded-2xl font-semibold flex items-center gap-3" style={{ background: 'var(--danger)', color: '#fff', fontSize: '15px' }}>
                <AlertTriangle size={20} /> {error}
              </div>
            )}

            {/* Personal Data */}
            <div className="mb-20">
              <div style={sectionHeadingStyle}>
                {t.personalInfo} <span className="h-px bg-current flex-grow"></span>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label style={labelStyle}>
                    <User size={16} /> {t.fullName} <span className="opacity-40 ml-1">*</span>
                  </label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="E.g. John Doe" required onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                </div>
                <div>
                  <label style={labelStyle}>
                    <Droplets size={16} /> {t.bloodGroup} <span className="opacity-40 ml-1">*</span>
                  </label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} style={{ ...inputStyle, appearance: 'none' }} required>
                    <option value="" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>Select group</option>
                    {bloodGroups.map(g => <option key={g} value={g} style={{ background: 'var(--bg)', color: 'var(--ink)' }}>{g}</option>)}
                  </select>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <label style={labelStyle}>
                      <User size={16} /> {t.gender} <span className="opacity-40 ml-1">*</span>
                    </label>
                    <select name="gender" value={formData.gender} onChange={handleChange} style={{ ...inputStyle, appearance: 'none' }} required>
                      <option value="" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>Select gender</option>
                      {genderOptions.map(g => <option key={g} value={g} style={{ background: 'var(--bg)', color: 'var(--ink)' }}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>
                      <Calendar size={16} /> {t.dob} <span className="opacity-40 ml-1">*</span>
                    </label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                  </div>
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div className="mb-20">
              <div style={sectionHeadingStyle}>
                {t.emergencyContacts} <span className="h-px bg-current flex-grow"></span>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label style={labelStyle}><Phone size={16} /> {t.yourPhone} <span className="opacity-40 ml-1">*</span></label>
                  <div className="flex gap-2">
                    <div className="relative flex items-center">
                      <div className="absolute left-3 w-6 h-[16px] pointer-events-none rounded-[2px] overflow-hidden shadow-sm flex items-center justify-center [&>svg]:w-full [&>svg]:h-full border border-black/10 dark:border-white/10">
                        {phoneCode === '+91' && <IN title="India" />}
                        {phoneCode === '+1' && <US title="United States" />}
                        {phoneCode === '+44' && <GB title="United Kingdom" />}
                        {phoneCode === '+61' && <AU title="Australia" />}
                      </div>
                      <select value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)} style={{ ...inputStyle, width: '100px', padding: '16px 10px 16px 40px', appearance: 'none', background: 'var(--bg)', color: 'var(--ink)' }}>
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+61">+61</option>
                      </select>
                    </div>
                    <input type="tel" name="phone" value={formData.phone} onChange={(e) => handlePhoneChange(e, 'phone')} style={inputStyle} placeholder="1234567890" required onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                  </div>
                </div>
                <div className="hidden md:block"></div> {/* Spacer */}


                <div>
                  <label style={labelStyle}><Phone size={16} /> Emergency No. <span className="opacity-40 ml-1">*</span></label>
                  <div className="flex gap-2">
                    <div className="relative flex items-center">
                      <div className="absolute left-3 w-6 h-[16px] pointer-events-none rounded-[2px] overflow-hidden shadow-sm flex items-center justify-center [&>svg]:w-full [&>svg]:h-full border border-black/10 dark:border-white/10">
                        {emergencyCode === '+91' && <IN title="India" />}
                        {emergencyCode === '+1' && <US title="United States" />}
                        {emergencyCode === '+44' && <GB title="United Kingdom" />}
                        {emergencyCode === '+61' && <AU title="Australia" />}
                      </div>
                      <select value={emergencyCode} onChange={(e) => setEmergencyCode(e.target.value)} style={{ ...inputStyle, width: '100px', padding: '16px 10px 16px 40px', appearance: 'none', background: 'var(--bg)', color: 'var(--ink)' }}>
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+61">+61</option>
                      </select>
                    </div>
                    <input type="tel" name="emergencyContact.phone" value={formData.emergencyContact.phone} onChange={(e) => handlePhoneChange(e, 'emergencyContact.phone')} style={inputStyle} placeholder="1234567890" required onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />

                  </div>

                </div>
                <div>
                  <label style={labelStyle}><UserCheck size={16} /> Contact Name <span className="opacity-40 ml-1">*</span></label>
                  <input type="text" name="emergencyContact.name" value={formData.emergencyContact.name} onChange={handleChange} style={inputStyle} placeholder="Someone you trust" required onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                </div>
              </div>
            </div>

            {/* Medical Context */}
            <div className="mb-20">
              <div style={sectionHeadingStyle}>
                {t.medicalHistory} <span className="h-px bg-current flex-grow"></span>
              </div>

              <div className="space-y-8">
                <div>
                  <label style={labelStyle}><AlertTriangle size={16} /> {t.chronicConditions}</label>
                  <textarea name="diseaseDetails" value={formData.diseaseDetails} onChange={handleChange} style={{ ...inputStyle, minHeight: '100px' }} placeholder="Asthma, Diabetes, etc." onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label style={labelStyle}><Droplets size={16} /> {t.knownAllergies}</label>
                    <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} style={inputStyle} placeholder="Peanuts, Penicillin..." onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                  </div>
                  <div>
                    <label style={labelStyle}><Pill size={16} /> {t.medications}</label>
                    <input type="text" name="medications" value={formData.medications} onChange={handleChange} style={inputStyle} placeholder="Current meds..." onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}><FileText size={16} /> {t.responderNotes}</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} placeholder="Notes for first responders" onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                </div>
              </div>
            </div>

            {/* Footer / Submit */}
            <div className="pt-12 border-t flex flex-col sm:flex-row items-center justify-between gap-10" style={{ borderColor: 'var(--line)' }}>
              <p className="text-sm opacity-30 max-w-xs text-center sm:text-left leading-relaxed">
                {t.disclaimer}
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-12 py-4 text-xs font-bold rounded-full transition-base flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-black/5"
                style={{ background: 'var(--accent)', color: 'var(--accent-ink)', border: 'none', cursor: 'pointer' }}
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> {t.working}</> : <>{t.generateQr} <ArrowRight size={14} /></>}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CreateProfile;
