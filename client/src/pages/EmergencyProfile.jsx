import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApiService from '../utils/api';
import { Phone, Activity, FileText, ShieldAlert, User, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const EmergencyProfile = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await ApiService.getUserById(id);
        if (response.success) {
          setUser(response.data);
        } else {
          setError(t.notFound);
        }
      } catch (err) {
        setError(t.failedLoad);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, t.failedLoad, t.notFound]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg)' }}>
      <div className="text-center font-sans tracking-tight">
        <div className="text-sm font-bold opacity-30 animate-pulse">{t.retrieving}</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center" style={{ background: 'var(--bg)' }}>
      <div className="max-w-md border p-12 rounded-[2rem]" style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}>
        <ShieldAlert size={40} className="mx-auto mb-6 opacity-30" />
        <h1 className="text-2xl font-bold mb-4 tracking-tight">{t.accessError}</h1>
        <p className="text-base mb-10 opacity-50 leading-relaxed font-medium">{error}</p>
        <Link to="/" className="inline-block px-10 py-3.5 text-xs font-bold rounded-full transition-base" style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>
          {t.returnHome}
        </Link>
      </div>
    </div>
  );

  const SectionTitle = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-3 py-4 border-b mb-6" style={{ borderColor: 'var(--line)' }}>
      <Icon size={16} className="opacity-30" />
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] opacity-30">{title}</h2>
    </div>
  );

  const InfoRow = ({ label, value, color, highlight }) => (
    <div className={`p-6 border-b last:border-0 flex flex-col md:flex-row md:items-center justify-between gap-4 ${highlight ? 'bg-white/[0.01]' : ''}`} style={{ borderColor: 'var(--line)' }}>
      <span className="text-xs font-bold opacity-40">{label}</span>
      <span className={`text-xl font-bold tracking-tight text-right ${color ? '' : 'opacity-90'}`} style={{ color: color || 'var(--ink)', fontFamily: 'var(--font-heading)' }}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)' }}>
      {/* Alert Header */}
      <div className="py-4 px-6 text-center border-b sticky top-0 z-50 transition-base flex items-center justify-between glass" style={{ background: 'var(--danger)', borderColor: 'rgba(0,0,0,0.1)' }}>
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
          <ShieldAlert size={14} className="animate-pulse" />
          {t.emergencyProfile}
        </div>
        <div className="bg-white/25 px-2.5 py-1 rounded-full text-[9px] font-black text-white border border-white/20">
          {t.active}
        </div>
      </div>

      <div className="main-wrap max-w-5xl mt-12 md:mt-20">
        <div className="grid lg:grid-cols-[1.5fr,1fr] gap-10 items-start">

          <div className="space-y-10">
            {/* Identity Card */}
            <div className="border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5" style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}>
              <SectionTitle title={t.identity} icon={User} />
              <div className="px-2">
                <InfoRow label={t.fullName} value={user.name} highlight />
                <div className="grid md:grid-cols-2">
                  <div className="border-b md:border-b-0 md:border-r" style={{ borderColor: 'var(--line)' }}>
                    <InfoRow label={t.gender} value={user.gender || t.notSpecified} />
                  </div>
                  <InfoRow label={t.medicalStatus} value={t.verified} color="var(--success)" />
                </div>
                <div className="p-12 md:p-16 flex flex-col items-center justify-center text-center gap-6">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-20">{t.bloodGroup}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-9xl font-black leading-none" style={{ color: 'var(--danger)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
                      {user.bloodGroup}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Documentation */}
            <div className="border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5" style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}>
              <SectionTitle title={t.medicalDetails} icon={Activity} />
              <div className="px-2">
                <InfoRow label={t.condition} value={user.diseaseDetails || t.noneDisclosed} color={user.diseaseDetails ? 'var(--danger)' : null} />
                <InfoRow label={t.allergies} value={user.allergies || t.noneDisclosed} color={user.allergies ? 'var(--danger)' : null} />
                <InfoRow label={t.medications} value={user.medications || t.noneDisclosed} />

                {user.notes && (
                  <div className="p-10 border-t" style={{ borderColor: 'var(--line)' }}>
                    <p className="text-[11px] font-black uppercase tracking-widest opacity-35 mb-6 flex items-center gap-2">
                      <FileText size={12} /> {t.instructions}
                    </p>
                    <p className="text-2xl font-bold leading-tight opacity-90 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                      "{user.notes}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {/* Contacts */}
            <div className="border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5" style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}>
              <SectionTitle title={t.emergencyContact} icon={Phone} />
              <div className="p-10 space-y-8">
                <div className="border p-8 rounded-[2rem] text-center" style={{ borderColor: 'var(--danger)', background: 'rgba(255, 59, 48, 0.04)' }}>
                  <p className="text-[10px] font-black mb-4 opacity-50 uppercase tracking-widest" style={{ color: 'var(--danger)' }}>{t.primaryKin}</p>
                  <p className="text-3xl font-bold mb-8 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>{user.emergencyContact.name}</p>
                  <a href={`tel:${user.emergencyContact.phone}`} className="flex items-center justify-center gap-3 w-full py-5 text-sm font-bold rounded-full transition-base hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-500/20" style={{ background: 'var(--danger)', color: 'white' }}>
                    <Phone size={18} fill="white" /> {t.callContact}
                  </a>
                  <p className="text-sm mt-5 font-bold opacity-40">{user.emergencyContact.phone}</p>
                </div>

                <div className="pt-4 text-center md:text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-25 mb-4">{t.backupConnection}</p>
                  <a href={`tel:${user.phone}`} className="text-base font-bold flex items-center justify-center md:justify-start gap-2 opacity-50 hover:opacity-100 transition-base">
                    <Phone size={14} /> {user.phone} <span className="text-[10px] opacity-50 ml-1">({t.patient})</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Verification */}
            <div className="border rounded-[2.5rem] p-10 shadow-2xl shadow-black/5" style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}>
              <div className="flex items-center gap-3 opacity-30 mb-6">
                <ShieldCheck size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">{t.verifiedLog}</span>
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-40">
                {t.clinicalDisclaimer}
              </p>
              <div className="mt-10 pt-8 border-t flex justify-between uppercase opacity-20 font-bold tracking-tighter" style={{ borderColor: 'var(--line)', fontSize: '10px' }}>
                <span>REF: {user._id?.substring(0, 8)}</span>
                <span>SECURE_DATA</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmergencyProfile;
