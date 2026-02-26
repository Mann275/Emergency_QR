import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../utils/api';
import { User, Droplets, Calendar, Phone, UserCheck, Pill, AlertTriangle, FileText, Loader2, ClipboardList, ShieldAlert } from 'lucide-react';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

const CreateProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!formData.name || !formData.bloodGroup || !formData.phone || !formData.emergencyContact.name || !formData.emergencyContact.phone) {
        throw new Error('Please fill in all required fields.');
      }
      const response = await ApiService.createUser(formData);
      if (response.success) {
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
    borderRadius: '4px',
    padding: '16px 18px',
    fontSize: '16px',
    fontWeight: '600',
    background: 'rgba(255, 255, 255, 0.02)',
    width: '100%',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '10px',
    color: 'var(--ink)',
    opacity: 0.6
  };

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-20 md:pt-36 md:pb-28">
        <div className="main-wrap max-w-2xl">

          <div className="animate-slide mb-14 border-b pb-8" style={{ borderColor: 'var(--line)' }}>
            <div className="flex items-center gap-4 mb-4">
              <ClipboardList size={20} className="opacity-30" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Registry Module / New Entry</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase" style={{ color: 'var(--ink)' }}>
              Medical Enrollment
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="animate-slide" style={{ animationDelay: '0.08s' }}>
            {error && (
              <div className="mb-8 p-6 rounded-sm border-l-4 font-bold flex items-center gap-4" style={{ background: 'rgba(255, 59, 48, 0.1)', borderColor: 'var(--danger)', color: 'var(--danger)', fontSize: '14px' }}>
                <ShieldAlert size={20} /> {error}
              </div>
            )}

            {/* Personal Data Block */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8 opacity-20">
                <span className="h-px bg-current flex-grow"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Block 01 / Identity</span>
                <span className="h-px bg-current flex-grow"></span>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label style={labelStyle}>
                    Subject Full identity <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="LEGAL NAME AS PER ID" required onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                </div>
                <div>
                  <label style={labelStyle}>
                    Blood group <span className="text-red-500">*</span>
                  </label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} style={{ ...inputStyle, background: 'rgba(255,255,255,0.03)' }} required>
                    <option value="" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>SELECT TYPE</option>
                    {bloodGroups.map(g => <option key={g} value={g} style={{ background: 'var(--bg)', color: 'var(--ink)' }}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>
                    Biological gender
                  </label>
                  <select name="gender" value={formData.gender} onChange={handleChange} style={{ ...inputStyle, background: 'rgba(255,255,255,0.03)' }}>
                    <option value="" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>NOT SPECIFIED</option>
                    {genderOptions.map(o => <option key={o} value={o} style={{ background: 'var(--bg)', color: 'var(--ink)' }}>{o.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Communication Block */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8 opacity-20">
                <span className="h-px bg-current flex-grow"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Block 02 / Protocols</span>
                <span className="h-px bg-current flex-grow"></span>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label style={labelStyle}>Primary Contact</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} placeholder="+X XXX XXX XXXX" required onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                </div>
                <div>
                  <label style={labelStyle}>Alternate Contact</label>
                  <input type="tel" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} style={inputStyle} placeholder="OPTIONAL" onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                </div>
                <div>
                  <label style={labelStyle}>Emergency kin name <span className="text-red-500">*</span></label>
                  <input type="text" name="emergencyContact.name" value={formData.emergencyContact.name} onChange={handleChange} style={inputStyle} placeholder="PRIMARY RESPONDER NAME" required onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                </div>
                <div>
                  <label style={labelStyle}>Emergency kin phone <span className="text-red-500">*</span></label>
                  <input type="tel" name="emergencyContact.phone" value={formData.emergencyContact.phone} onChange={handleChange} style={inputStyle} placeholder="+X XXX XXX XXXX" required onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                </div>
              </div>
            </div>

            {/* Clinical Data Block */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8 opacity-20">
                <span className="h-px bg-current flex-grow"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Block 03 / Clinical Data</span>
                <span className="h-px bg-current flex-grow"></span>
              </div>

              <div className="space-y-8">
                <div>
                  <label style={labelStyle}>Chronic diagnoses</label>
                  <textarea name="diseaseDetails" value={formData.diseaseDetails} onChange={handleChange} style={{ ...inputStyle, minHeight: '100px' }} placeholder="SPECIFY KNOWN CONDITIONS" onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label style={labelStyle}>Documented allergies</label>
                    <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} style={inputStyle} placeholder="e.g. PEANUTS, PENICILLIN" onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Active pharmacotherapy</label>
                    <input type="text" name="medications" value={formData.medications} onChange={handleChange} style={inputStyle} placeholder="CURRENT MEDICATIONS" onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Protocol Instructions</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} placeholder="CRITICAL NOTES FOR RESPONDERS" onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                </div>
              </div>
            </div>

            {/* Submission Block */}
            <div className="pt-12 border-t flex flex-col sm:flex-row items-center justify-between gap-8" style={{ borderColor: 'var(--line)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-20 max-w-xs text-center sm:text-left leading-relaxed">
                By generating this QR, you authorize the public display of this sensitive medical data for emergency retrieval.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-12 py-5 text-sm font-black uppercase tracking-[0.2em] rounded transition-base flex items-center justify-center gap-3 active:scale-95"
                style={{ background: 'var(--accent)', color: 'var(--accent-ink)', border: 'none', cursor: 'pointer' }}
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : 'Initialize Registry'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CreateProfile;
