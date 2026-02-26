import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApiService from '../utils/api';
import { Phone, Droplets, Activity, Pill, AlertTriangle, FileText, ShieldAlert, ArrowLeft, User, ShieldCheck } from 'lucide-react';

const EmergencyProfile = () => {
  const { id } = useParams();
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
          setError('Profile not found.');
        }
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg)' }}>
      <div className="text-center font-mono">
        <div className="text-xs font-bold uppercase tracking-[0.2em] opacity-40">SYSTEM: INITIALIZING_SECURE_FETCH...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center" style={{ background: 'var(--bg)' }}>
      <div className="max-w-md border p-12 rounded-lg" style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}>
        <ShieldAlert size={40} className="mx-auto mb-6 opacity-40" />
        <h1 className="text-xl font-bold mb-4 uppercase tracking-tighter" style={{ color: 'var(--danger)' }}>Critical System Error</h1>
        <p className="text-sm mb-10 opacity-60 leading-relaxed font-medium">{error}</p>
        <Link to="/" className="inline-block border px-8 py-3 text-xs font-bold uppercase tracking-widest transition-base" style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}>
          Return to Registry
        </Link>
      </div>
    </div>
  );

  const SectionTitle = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-3 py-4 border-b mb-6" style={{ borderColor: 'var(--line)' }}>
      <Icon size={14} className="opacity-40" />
      <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{title}</h2>
    </div>
  );

  const InfoRow = ({ label, value, color, highlight }) => (
    <div className={`p-5 border-b last:border-0 flex flex-col md:flex-row md:items-center justify-between gap-4 ${highlight ? 'bg-white/[0.02]' : ''}`} style={{ borderColor: 'var(--line)' }}>
      <span className="text-[11px] font-bold uppercase tracking-wider opacity-30 flex-shrink-0">{label}</span>
      <span className={`text-base md:text-lg font-bold tracking-tight text-right ${color ? '' : 'opacity-90'}`} style={{ color: color || 'var(--ink)' }}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 font-sans" style={{ background: 'var(--bg)' }}>
      {/* Clinical Alert Header */}
      <div className="py-3 px-6 text-center border-b z-50 transition-base flex items-center justify-between" style={{ background: 'var(--danger)', borderColor: 'rgba(0,0,0,0.1)' }}>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
          <ShieldAlert size={12} />
          SECURE MEDICAL LOG / {user.uniqueId?.substring(0, 8).toUpperCase()}
        </div>
        <div className="bg-white/20 px-2 py-0.5 rounded text-[8px] font-black text-white border border-white/20">
          PROFILESYNC_ACTIVE
        </div>
      </div>

      <div className="main-wrap max-w-4xl mt-12 md:mt-16">
        <div className="grid md:grid-cols-3 gap-8 items-start">

          {/* Main Clinical Data */}
          <div className="md:col-span-2 space-y-8">

            {/* Subject Identity Case */}
            <div className="border rounded-lg overflow-hidden lg:shadow-xl" style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}>
              <SectionTitle title="Subject Profile" icon={User} />
              <div className="px-1 outline-none">
                <InfoRow label="Subject Identity" value={user.name} highlight />
                <div className="grid md:grid-cols-2">
                  <div className="border-b md:border-b-0 md:border-r" style={{ borderColor: 'var(--line)' }}>
                    <InfoRow label="Biological Gender" value={user.gender || 'Not Disclosed'} />
                  </div>
                  <InfoRow label="Clinical Status" value="Verified" color="var(--success)" />
                </div>
                <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center gap-4 bg-white/[0.01]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-20">Assigned Blood Group</p>
                  <div className="flex items-center gap-4">
                    <span className="text-8xl md:text-9xl font-black leading-none" style={{ color: 'var(--danger)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.05em' }}>
                      {user.bloodGroup}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Documentation */}
            <div className="border rounded-lg overflow-hidden" style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}>
              <SectionTitle title="Clinical Documentation" icon={Activity} />
              <div className="px-1">
                <InfoRow label="Chronic Diagnoses" value={user.diseaseDetails || 'None Logged'} color={user.diseaseDetails ? 'var(--danger)' : null} />
                <InfoRow label="Adverse Reactions / Allergies" value={user.allergies || 'None Logged'} color={user.allergies ? 'var(--danger)' : null} />
                <InfoRow label="Active Pharmacotherapy" value={user.medications || 'None Logged'} />

                {user.notes && (
                  <div className="p-8 border-t" style={{ borderColor: 'var(--line)', background: 'white/[0.01]' }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-35 mb-4 flex items-center gap-2">
                      <FileText size={10} /> Responder Protocols / Special Instructions
                    </p>
                    <p className="text-base font-bold leading-relaxed opacity-80 uppercase tracking-tight">
                      {user.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Verification Sidebar */}
          <div className="space-y-8">

            {/* Communication Protocol */}
            <div className="border rounded-lg overflow-hidden" style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}>
              <SectionTitle title="Protocols" icon={Phone} />
              <div className="p-8 space-y-6">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-35 mb-4">Emergency Contact Hierarchy</p>
                  <div className="border p-6 rounded" style={{ borderColor: 'var(--danger)', background: 'rgba(255, 59, 48, 0.05)' }}>
                    <p className="text-sm font-black mb-1 opacity-70 uppercase tracking-tight">{user.emergencyContact.name}</p>
                    <p className="text-lg font-black mb-6 tabular-nums" style={{ color: 'var(--danger)' }}>{user.emergencyContact.phone}</p>
                    <a href={`tel:${user.emergencyContact.phone}`} className="flex items-center justify-center gap-2 w-full py-4 text-xs font-black uppercase tracking-widest rounded transition-base active:scale-95" style={{ background: 'var(--danger)', color: 'white' }}>
                      Establish Contact
                    </a>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-25 mb-3">Backup Identification</p>
                  <a href={`tel:${user.phone}`} className="text-sm font-black flex items-center gap-2 opacity-60 hover:opacity-100 transition-base">
                    <Phone size={12} /> {user.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* System Authentication */}
            <div className="border rounded-lg p-8" style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}>
              <div className="flex items-center gap-2 opacity-30 mb-6">
                <ShieldCheck size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Verified Registry Entry</span>
              </div>
              <p className="text-[10px] font-medium leading-relaxed opacity-40 uppercase tracking-wide">
                This document is a secure digital emergency pass. Unauthorized alteration is impossible. Medical personnel must verify all data.
              </p>
              <div className="mt-8 pt-6 border-t font-mono text-[9px] opacity-10 flex justify-between uppercase tracking-tighter" style={{ borderColor: 'var(--line)' }}>
                <span>ID: {user._id?.substring(0, 12)}</span>
                <span>REV_01</span>
              </div>
            </div>

          </div>

        </div>

        <div className="mt-16 text-center">
          <Link to="/" className="text-[10px] font-black uppercase tracking-[0.3em] opacity-20 hover:opacity-50 transition-base">
            Exit Secure View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmergencyProfile;
