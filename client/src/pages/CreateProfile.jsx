import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../utils/api';
import { User, Droplets, Calendar, Phone, UserCheck, Pill, AlertTriangle, FileText, Loader2, ArrowRight, ChevronDown } from 'lucide-react';
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
    resize: 'none',
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

  const CustomPhoneSelector = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const options = [
      { code: '+91', icon: <IN title="India" /> },
      { code: '+1', icon: <US title="USA" /> },
      { code: '+44', icon: <GB title="UK" /> },
      { code: '+61', icon: <AU title="Australia" /> },
    ];

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selected = options.find(o => o.code === value) || options[0];

    return (
      <div className="relative min-w-[120px]" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 w-full transition-all duration-300 active:scale-95"
          style={{
            ...inputStyle,
            padding: '16px 14px',
            background: 'var(--surface)',
            borderColor: 'var(--line)'
          }}
        >
          <div className="w-5 h-[13px] flex items-center justify-center border border-black/10 dark:border-white/10 overflow-hidden">
            {selected.icon}
          </div>
          <span className="font-bold text-sm tracking-tight">{selected.code}</span>
          <ChevronDown size={14} className={`ml-auto opacity-40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-full py-2 rounded-2xl border shadow-2xl z-[150] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
              background: 'var(--surfaceRaised)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderColor: 'var(--line)'
            }}>
            {options.map((opt) => (
              <button
                key={opt.code}
                type="button"
                onClick={() => {
                  onChange(opt.code);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                style={{ color: 'var(--ink)' }}
              >
                <div className="w-5 h-[13px] flex items-center justify-center border border-black/10 dark:border-white/10 overflow-hidden">
                  {opt.icon}
                </div>
                <span className="font-bold text-sm">{opt.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-32">
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

            <div className="mb-20">
              <div style={sectionHeadingStyle}>
                {t.personalInfo} <span className="h-px bg-current flex-grow"></span>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label style={labelStyle}><User size={16} /> {t.fullName} <span className="opacity-40 ml-1">*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="E.g. John Doe" required />
                </div>

                <div>
                  <label style={labelStyle}><Droplets size={16} /> {t.bloodGroup} <span className="opacity-40 ml-1">*</span></label>
                  <div className="relative flex items-center">
                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}
                      className="cursor-pointer"
                      style={{ ...inputStyle, appearance: 'none', paddingRight: '40px', background: 'var(--surface)' }} required>
                      <option value="" style={{ background: 'var(--surfaceRaised)', color: 'var(--ink)' }}>Select group</option>
                      {bloodGroups.map(g => <option key={g} value={g} style={{ background: 'var(--surfaceRaised)', color: 'var(--ink)' }}>{g}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 pointer-events-none opacity-40" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-8 md:col-span-2">
                  <div>
                    <label style={labelStyle}><User size={16} /> {t.gender} <span className="opacity-40 ml-1">*</span></label>
                    <div className="relative flex items-center">
                      <select name="gender" value={formData.gender} onChange={handleChange}
                        className="cursor-pointer"
                        style={{ ...inputStyle, appearance: 'none', paddingRight: '40px', background: 'var(--surface)' }} required>
                        <option value="" style={{ background: 'var(--surfaceRaised)', color: 'var(--ink)' }}>Select gender</option>
                        {genderOptions.map(g => <option key={g} value={g} style={{ background: 'var(--surfaceRaised)', color: 'var(--ink)' }}>{g}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 pointer-events-none opacity-40" />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}><Calendar size={16} /> {t.dob} <span className="opacity-40 ml-1">*</span></label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required style={inputStyle} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-20">
              <div style={sectionHeadingStyle}>
                {t.emergencyContacts} <span className="h-px bg-current flex-grow"></span>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label style={labelStyle}><Phone size={16} /> {t.yourPhone} <span className="opacity-40 ml-1">*</span></label>
                  <div className="flex gap-4">
                    <CustomPhoneSelector value={phoneCode} onChange={setPhoneCode} />
                    <input type="tel" name="phone" value={formData.phone} onChange={(e) => handlePhoneChange(e, 'phone')} style={inputStyle} placeholder="1234567890" required />
                  </div>
                </div>
                <div className="md:col-span-2 pt-4">
                  <div style={sectionHeadingStyle} className="!mb-8 opacity-20 text-[10px]">Primary Contact Details</div>
                </div>
                <div>
                  <label style={labelStyle}><Phone size={16} /> Emergency No. <span className="opacity-40 ml-1">*</span></label>
                  <div className="flex gap-4">
                    <CustomPhoneSelector value={emergencyCode} onChange={setEmergencyCode} />
                    <input type="tel" name="emergencyContact.phone" value={formData.emergencyContact.phone} onChange={(e) => handlePhoneChange(e, 'emergencyContact.phone')} style={inputStyle} placeholder="1234567890" required />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}><UserCheck size={16} /> Contact Name <span className="opacity-40 ml-1">*</span></label>
                  <input type="text" name="emergencyContact.name" value={formData.emergencyContact.name} onChange={handleChange} style={inputStyle} placeholder="Someone you trust" required />
                </div>
              </div>
            </div>

            <div className="mb-20">
              <div style={sectionHeadingStyle}>
                {t.medicalHistory} <span className="h-px bg-current flex-grow"></span>
              </div>
              <div className="space-y-8">
                <div>
                  <label style={labelStyle}><AlertTriangle size={16} /> {t.chronicConditions}</label>
                  <textarea name="diseaseDetails" value={formData.diseaseDetails} onChange={handleChange} style={{ ...inputStyle, minHeight: '100px' }} placeholder="Asthma, Diabetes, etc." />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label style={labelStyle}><Droplets size={16} /> {t.knownAllergies}</label>
                    <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} style={inputStyle} placeholder="Peanuts, Penicillin..." />
                  </div>
                  <div>
                    <label style={labelStyle}><Pill size={16} /> {t.medications}</label>
                    <input type="text" name="medications" value={formData.medications} onChange={handleChange} style={inputStyle} placeholder="Current meds..." />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}><FileText size={16} /> {t.responderNotes}</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} placeholder="Notes for first responders" />
                </div>
              </div>
            </div>

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
