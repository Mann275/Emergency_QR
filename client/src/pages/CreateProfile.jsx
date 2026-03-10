import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../utils/api';
import {
  User,
  Droplets,
  Calendar,
  Phone,
  UserCheck,
  Pill,
  AlertTriangle,
  FileText,
  Loader2,
  ArrowRight,
  ChevronDown,
  Shield,
  HeartPulse,
  Info,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { IN, US, GB, AU } from 'country-flag-icons/react/3x2';
import { toast } from 'react-hot-toast';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

const CreateProfile = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
      setFormData((prev) => ({ ...prev, phone: digitsOnly }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, phone: digitsOnly },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.bloodGroup || !formData.gender || !formData.dateOfBirth || !formData.phone || !formData.emergencyContact.name || !formData.emergencyContact.phone) {
        throw new Error('Please fill in all required fields.');
      }

      const payload = {
        ...formData,
        phone: `${phoneCode} ${formData.phone}`,
        emergencyContact: {
          ...formData.emergencyContact,
          phone: `${emergencyCode} ${formData.emergencyContact.phone}`,
        },
      };

      const response = await ApiService.createUser(payload);
      if (response.success) {
        toast.success('Profile created successfully!', {
          style: {
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.92)',
            color: 'var(--ink)',
            padding: '16px',
            border: '1px solid var(--glass-border)',
          },
        });

        navigate(`/success/${response.data.uniqueId}`, {
          state: { qrCode: response.data.qrCode, profileUrl: response.data.profileUrl },
        });
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong.', {
        style: {
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.92)',
          color: 'var(--ink)',
          padding: '16px',
          border: '1px solid rgba(214, 31, 69, 0.14)',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    width: '100%',
    border: '1px solid var(--line)',
    borderRadius: '18px',
    padding: '16px 18px',
    background: 'rgba(255,255,255,0.5)',
    color: 'var(--ink)',
    fontSize: '17px',
    fontWeight: '500',
    outline: 'none',
    backdropFilter: 'blur(14px)',
    resize: 'none',
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.01em',
    marginBottom: '10px',
    color: 'var(--muted)',
  };

  const SectionTitle = ({ icon: Icon, title, copy }) => (
    <div className="mb-6 sm:mb-8">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-600 backdrop-blur-xl">
        <Icon size={14} className="text-[var(--accent)]" />
        {title}
      </div>
      {copy && <p className="mt-3 max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--muted)]">{copy}</p>}
    </div>
  );

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

    const selected = options.find((option) => option.code === value) || options[0];

    return (
      <div className="relative min-w-[110px] sm:min-w-[130px]" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center gap-2 rounded-2xl border border-[var(--line)] bg-white/55 px-3 py-4 text-base font-medium text-[var(--ink)] backdrop-blur-xl"
        >
          <div className="flex h-[16px] w-6 items-center justify-center overflow-hidden rounded-sm border border-slate-200">
            {selected.icon}
          </div>
          <span>{selected.code}</span>
          <ChevronDown size={14} className={`ml-auto opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full z-[120] mt-2 w-full overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[rgba(255,255,255,0.85)] py-2 shadow-[0_20px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            {options.map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => {
                  onChange(option.code);
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-base font-medium text-[var(--ink)] transition-colors hover:bg-white/70"
              >
                <div className="flex h-[16px] w-6 items-center justify-center overflow-hidden rounded-sm border border-slate-200">
                  {option.icon}
                </div>
                {option.code}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pb-24">
      <section className="pt-20 sm:pt-28">
        <div className="main-wrap max-w-3xl">
          <div className="text-center mb-8 animate-slide">
            <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 mb-4">
              <img
                src="/images/illustration3.png"
                alt=""
                className="w-14 sm:w-28 h-auto mix-blend-multiply shrink-0"
              />
              <div className="relative group flex items-center gap-3 sm:gap-4">
                <h1 className="text-3xl sm:text-5xl font-bold text-[var(--ink)] tracking-tight leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                  {t.createTitle}
                </h1>
                <div className="relative pt-1 scale-90 sm:scale-100">
                  <Info size={20} className="text-[var(--muted)] cursor-help opacity-30 hover:opacity-100 transition-opacity" />
                  <div className="absolute top-full right-0 mt-2 w-56 p-3 rounded-xl bg-[#23131a] text-white text-[12px] font-normal tracking-normal shadow-2xl z-[200] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 -translate-y-1 group-hover:translate-y-0 pointer-events-none text-left">
                    <div className="absolute -top-1 right-2 w-2.5 h-2.5 bg-[#23131a] rotate-45"></div>
                    {t.createDesc}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 animate-slide">
            <SectionTitle icon={User} title={t.personalInfo} copy="Fill only the information a responder should see immediately." />
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label style={labelStyle}><User size={14} /> {t.fullName}</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="E.g. John Doe" required style={fieldStyle} />
              </div>

              <div>
                <label style={labelStyle}><Droplets size={14} /> {t.bloodGroup}</label>
                <div className="relative">
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                    style={{ ...fieldStyle, appearance: 'none', paddingRight: '44px' }}
                  >
                    <option value="">{t.selectBloodGroup}</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-40" />
                </div>
              </div>

              <div>
                <label style={labelStyle}><UserCheck size={14} /> {t.gender}</label>
                <div className="relative">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    style={{ ...fieldStyle, appearance: 'none', paddingRight: '44px' }}
                  >
                    <option value="">{t.selectGender}</option>
                    {genderOptions.map((gender) => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-40" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label style={labelStyle}><Calendar size={14} /> {t.dob}</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required style={fieldStyle} />
              </div>
            </div>

            <div className="my-8 h-px bg-[var(--line)]"></div>

            <SectionTitle icon={Phone} title={t.emergencyContacts} copy="These numbers appear high on the emergency profile, so keep them accurate." />
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label style={labelStyle}><Phone size={14} /> {t.yourPhone}</label>
                <div className="flex w-full gap-3">
                  <CustomPhoneSelector value={phoneCode} onChange={setPhoneCode} />
                  <input className="min-w-0 flex-1" type="tel" name="phone" value={formData.phone} onChange={(e) => handlePhoneChange(e, 'phone')} placeholder="1234567890" required style={fieldStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}><UserCheck size={14} /> {t.contactName}</label>
                <input type="text" name="emergencyContact.name" value={formData.emergencyContact.name} onChange={handleChange} placeholder="Someone you trust" required style={fieldStyle} />
              </div>

              <div>
                <label style={labelStyle}><Phone size={14} /> {t.emergencyPhone}</label>
                <div className="flex w-full gap-3">
                  <CustomPhoneSelector value={emergencyCode} onChange={setEmergencyCode} />
                  <input className="min-w-0 flex-1" type="tel" name="emergencyContact.phone" value={formData.emergencyContact.phone} onChange={(e) => handlePhoneChange(e, 'emergencyContact.phone')} placeholder="1234567890" required style={fieldStyle} />
                </div>
              </div>
            </div>

            <div className="my-8 h-px bg-[var(--line)]"></div>

            <SectionTitle icon={HeartPulse} title={t.medicalHistory} copy="Add only the details that are helpful during an emergency." />
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label style={labelStyle}><AlertTriangle size={14} /> {t.chronicConditions}</label>
                <textarea name="diseaseDetails" value={formData.diseaseDetails} onChange={handleChange} placeholder="Asthma, diabetes, epilepsy..." style={{ ...fieldStyle, minHeight: '96px' }} />
              </div>

              <div>
                <label style={labelStyle}><Droplets size={14} /> {t.knownAllergies}</label>
                <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="Penicillin, peanuts..." style={fieldStyle} />
              </div>

              <div>
                <label style={labelStyle}><Pill size={14} /> {t.medications}</label>
                <input type="text" name="medications" value={formData.medications} onChange={handleChange} placeholder="Current medication..." style={fieldStyle} />
              </div>

              <div className="sm:col-span-2">
                <label style={labelStyle}><FileText size={14} /> {t.responderNotes}</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Example: carries inhaler in bag pocket." style={{ ...fieldStyle, minHeight: '88px' }} />
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-5 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-base sm:text-lg leading-relaxed text-[var(--muted)]">
                {t.disclaimer}
              </p>

              <button
                type="submit"
                disabled={loading}
                className="stark-btn gap-3 shrink-0 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> {t.working}</> : <>{t.generateQr} <ArrowRight size={16} /></>}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CreateProfile;
