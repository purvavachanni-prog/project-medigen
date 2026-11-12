import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Stethoscope, 
  User, 
  ShieldAlert, 
  Lock, 
  Mail, 
  Phone, 
  FileBadge, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AuthPortal({ onLoginSuccess, initialRole = 'Doctor', initialMode = 'signin', onBackToLanding }) {
  const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'
  const [role, setRole] = useState(initialRole); // 'Doctor', 'Patient', 'Admin'
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(initialRole === 'Doctor' ? 'doctor.sharma@medigen.ai' : initialRole === 'Patient' ? 'rajesh.kumar@medigen.ai' : 'compliance.admin@nha.gov.in');
  const [phone, setPhone] = useState(initialRole === 'Doctor' ? '9876543210' : initialRole === 'Patient' ? '9811234567' : '9988776655');
  const [regNo, setRegNo] = useState('DMC-49102-DL');
  const [abhaId, setAbhaId] = useState('91-4829-1092-4819@abdm');
  const [adminToken, setAdminToken] = useState('NHA-DEL-SEC-09');
  
  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick preset selector for hackathon demo
  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    setErrorMsg('');
    if (selectedRole === 'Doctor') {
      setEmail('doctor.sharma@medigen.ai');
      setFullName('Dr. Ananya Sharma, MD');
      setPhone('9876543210');
      setRegNo('DMC-49102-DL');
    } else if (selectedRole === 'Patient') {
      setEmail('rajesh.kumar@medigen.ai');
      setFullName('Rajesh Kumar');
      setPhone('9811234567');
      setAbhaId('91-4829-1092-4819@abdm');
    } else {
      setEmail('compliance.admin@nha.gov.in');
      setFullName('Dr. Vikramaditya Roy');
      setPhone('9988776655');
      setAdminToken('NHA-DEL-SEC-09');
    }
  };

  const handleSendOtp = () => {
    if (!phone || phone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setErrorMsg('');
    setOtpSent(true);
    setOtpCode('492817'); // Simulated OTP
    setOtpTimer(45);
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Indian mobile phone validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('Indian mobile number must be exactly 10 digits without +91.');
      return;
    }

    if (role === 'Doctor' && !regNo.trim()) {
      setErrorMsg('State Medical Council / NMC Registration Number is required for Clinician access.');
      return;
    }

    if (role === 'Patient' && !abhaId.trim()) {
      setErrorMsg('Ayushman Bharat ABHA Health Identifier is required for Patient record isolation.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        role,
        name: fullName || (role === 'Doctor' ? 'Dr. Ananya Sharma, MD' : role === 'Patient' ? 'Rajesh Kumar' : 'Dr. Vikramaditya Roy'),
        email,
        phone: `+91 ${cleanPhone}`,
        regNo: role === 'Doctor' ? regNo : null,
        abhaId: role === 'Patient' ? abhaId : null
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden pt-28">
      {/* Decorative ambient aura */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[#D4E4CE] opacity-40 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#E2D9F3] opacity-35 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-10 shadow-[0_20px_40px_-8px_rgba(58,99,100,0.12)] border border-[#3A6364]/10 relative z-10">
        {onBackToLanding && (
          <button
            type="button"
            onClick={onBackToLanding}
            className="mb-4 text-xs font-bold text-[#1E3A38] hover:text-[#142927] flex items-center gap-1.5 transition-colors"
          >
            ← Back to Portal Selection
          </button>
        )}
        {/* Header / Brand identity */}
        <div className="flex flex-col items-center text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4E4CE]/60 text-[#214B4C] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#214B4C]" />
            High-Integrity Clinical Portal • DPDP Act 2023
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="w-10 h-10 rounded-xl bg-[#214B4C] text-white flex items-center justify-center shadow-md">
              <Stethoscope className="w-6 h-6 text-[#D1E7DD]" />
            </div>
            <h1 className="font-headline text-3xl font-bold text-[#181A2E] tracking-tight">
              Project MEDIGEN
            </h1>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#404848] max-w-md">
            Secure Medical Decision Support &amp; Clinical Intelligence Ecosystem
          </p>

          {/* Quick 1-Click Demo Fill Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-[11px] font-bold text-[#8A9A86] uppercase tracking-wider mr-1">Demo Quick-Load:</span>
            <button
              type="button"
              onClick={() => handleSelectRole('Doctor')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                role === 'Doctor'
                  ? 'bg-[#214B4C] text-white'
                  : 'bg-[#F4F2FF] text-[#214B4C] hover:bg-[#E6E6FF]'
              }`}
            >
              🩺 Doctor (Dr. Sharma)
            </button>
            <button
              type="button"
              onClick={() => handleSelectRole('Patient')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                role === 'Patient'
                  ? 'bg-[#214B4C] text-white'
                  : 'bg-[#F4F2FF] text-[#214B4C] hover:bg-[#E6E6FF]'
              }`}
            >
              👤 Patient (Rajesh K.)
            </button>
            <button
              type="button"
              onClick={() => handleSelectRole('Admin')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                role === 'Admin'
                  ? 'bg-[#214B4C] text-white'
                  : 'bg-[#F4F2FF] text-[#214B4C] hover:bg-[#E6E6FF]'
              }`}
            >
              🛡️ Admin (Auditor)
            </button>
          </div>
        </div>

        {/* Mode Toggle: Sign In vs Create Account */}
        <div className="w-full bg-[#F4F2FF] p-1 rounded-full flex items-center mb-6 border border-[#3A6364]/10">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`w-1/2 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
              mode === 'signin'
                ? 'bg-[#214B4C] text-white shadow-sm'
                : 'text-[#404848] hover:text-[#181A2E]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`w-1/2 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
              mode === 'signup'
                ? 'bg-[#214B4C] text-white shadow-sm'
                : 'text-[#404848] hover:text-[#181A2E]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Role Switcher Module */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#404848] uppercase tracking-wider">
              Select Practitioner Profile
            </span>
            <span className="text-xs text-[#214B4C] font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#214B4C]" />
              TLS 1.3 Certified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Doctor Role */}
            <button
              type="button"
              onClick={() => handleSelectRole('Doctor')}
              className={`p-3 rounded-2xl text-left border transition-all relative ${
                role === 'Doctor'
                  ? 'bg-[#D4E4CE]/40 border-[#214B4C] shadow-sm'
                  : 'bg-[#F4F2FF] border-transparent hover:border-[#3A6364]/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#214B4C]" />
                <span className="font-bold text-sm text-[#181A2E]">Doctor</span>
              </div>
              <p className="text-[11px] text-[#404848] mt-1 leading-snug">
                Clinical Decision Support &amp; Radiology DSS
              </p>
              {role === 'Doctor' && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#214B4C]"></span>
              )}
            </button>

            {/* Patient Role */}
            <button
              type="button"
              onClick={() => handleSelectRole('Patient')}
              className={`p-3 rounded-2xl text-left border transition-all relative ${
                role === 'Patient'
                  ? 'bg-[#D4E4CE]/40 border-[#214B4C] shadow-sm'
                  : 'bg-[#F4F2FF] border-transparent hover:border-[#3A6364]/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#536251]" />
                <span className="font-bold text-sm text-[#181A2E]">Patient</span>
              </div>
              <p className="text-[11px] text-[#404848] mt-1 leading-snug">
                Health Records, ABHA ID &amp; Prescriptions
              </p>
              {role === 'Patient' && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#214B4C]"></span>
              )}
            </button>

            {/* Admin Role */}
            <button
              type="button"
              onClick={() => handleSelectRole('Admin')}
              className={`p-3 rounded-2xl text-left border transition-all relative ${
                role === 'Admin'
                  ? 'bg-[#D4E4CE]/40 border-[#214B4C] shadow-sm'
                  : 'bg-[#F4F2FF] border-transparent hover:border-[#3A6364]/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#4D3D66]" />
                <span className="font-bold text-sm text-[#181A2E]">Admin</span>
              </div>
              <p className="text-[11px] text-[#404848] mt-1 leading-snug">
                Audit Logs, Governance &amp; AI Latency
              </p>
              {role === 'Admin' && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#214B4C]"></span>
              )}
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#FFDAD6] border border-[#BA1A1A]/30 flex items-center gap-2 text-xs text-[#93000A] font-semibold">
            <AlertCircle className="w-4 h-4 text-[#BA1A1A] shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name (if signup or changing) */}
          {(mode === 'signup' || role === 'Patient') && (
            <div>
              <label className="block text-xs font-semibold text-[#404848] mb-1">
                Full Legal Name (as per Aadhaar / Medical Council)
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-[#717978]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === 'Doctor' ? 'Dr. Ananya Sharma' : role === 'Patient' ? 'Rajesh Kumar' : 'Dr. Vikramaditya Roy'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F2FF] text-[#181A2E] placeholder-[#717978] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#214B4C] border border-transparent focus:bg-white transition-all"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-[#404848]">
                Institutional or Verified Email
              </label>
              <span className="text-[11px] font-bold text-[#7C6A96]">Hospital SSO Enabled</span>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#717978]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor.sharma@medigen.ai"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F2FF] text-[#181A2E] placeholder-[#717978] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#214B4C] border border-transparent focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          {/* Indian Mobile Number with Fixed +91 Prefix */}
          <div>
            <label className="block text-xs font-semibold text-[#404848] mb-1">
              Indian Mobile Number (for 2FA Authentication)
            </label>
            <div className="flex items-center gap-2">
              {/* Flag + Fixed Prefix */}
              <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#E6E6FF] rounded-xl text-[#181A2E] font-bold text-xs sm:text-sm select-none border border-[#3A6364]/10 shrink-0">
                <span className="text-base leading-none">🇮🇳</span>
                <span>+91</span>
              </div>
              <div className="relative flex-1">
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full pl-3 pr-24 py-2.5 rounded-xl bg-[#F4F2FF] text-[#181A2E] placeholder-[#717978] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#214B4C] border border-transparent focus:bg-white transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpTimer > 0}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#D4E4CE] hover:bg-[#8A9A86] hover:text-white text-[#214B4C] text-[11px] font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {otpTimer > 0 ? `Resend (${otpTimer}s)` : otpSent ? 'Resend OTP' : 'Send OTP'}
                </button>
              </div>
            </div>
          </div>

          {/* Simulated OTP Field if sent */}
          {otpSent && (
            <div className="p-3 rounded-xl bg-[#D1E7DD]/50 border border-[#8A9A86]/30 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#214B4C] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#536251]" />
                  Simulated OTP Delivered to +91 {phone}
                </span>
                <span className="font-mono text-xs font-bold text-[#214B4C] bg-white px-2 py-0.5 rounded shadow-xs">
                  Code: 492817
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-3 py-2 rounded-lg bg-white text-[#181A2E] text-xs font-mono tracking-widest text-center border border-[#3A6364]/20 focus:outline-none focus:ring-2 focus:ring-[#214B4C]"
                />
              </div>
            </div>
          )}

          {/* Role-Specific Credential Section */}
          <div className="p-3.5 rounded-2xl bg-[#F4F2FF] border border-[#3A6364]/10 space-y-3">
            {role === 'Doctor' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#404848]">
                    State Medical Council / NMC Registration No.
                  </label>
                  <span className="px-2 py-0.5 rounded-full bg-[#D4E4CE] text-[#586755] text-[10px] font-bold flex items-center gap-1">
                    <FileBadge className="w-3 h-3" /> NMC Validated
                  </span>
                </div>
                <div className="relative">
                  <FileBadge className="w-4 h-4 absolute left-3 top-2.5 text-[#717978]" />
                  <input
                    type="text"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="DMC-49102-DL"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white text-[#181A2E] text-xs sm:text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#214B4C] border border-[#3A6364]/10"
                    required
                  />
                </div>
              </div>
            )}

            {role === 'Patient' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#404848]">
                    ABHA Address / National Health ID (ABDM)
                  </label>
                  <span className="text-[10px] font-bold text-[#7C6A96]">Ayushman Bharat Sync</span>
                </div>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-[#717978]" />
                  <input
                    type="text"
                    value={abhaId}
                    onChange={(e) => setAbhaId(e.target.value)}
                    placeholder="91-4829-1092-4819@abdm"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white text-[#181A2E] text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#214B4C] border border-[#3A6364]/10"
                    required
                  />
                </div>
              </div>
            )}

            {role === 'Admin' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#404848]">
                    Auditor Security Token / Government Key
                  </label>
                  <span className="px-2 py-0.5 rounded-full bg-[#ECDCFF] text-[#4D3D66] text-[10px] font-bold">
                    Statutory Level 3
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-[#717978]" />
                  <input
                    type="password"
                    value={adminToken}
                    onChange={(e) => setAdminToken(e.target.value)}
                    placeholder="NHA-DEL-SEC-09"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white text-[#181A2E] text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#214B4C] border border-[#3A6364]/10"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#214B4C] hover:bg-[#193A3B] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <span>Enter MEDIGEN Clinical Platform ({role})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer Regulatory Footnote */}
        <div className="mt-6 pt-4 border-t border-[#3A6364]/10 flex items-center justify-center gap-4 text-[11px] text-[#717978]">
          <span>Protected under DPDP Act 2023</span>
          <span>•</span>
          <span>Ayushman Bharat ABDM Compliant</span>
          <span>•</span>
          <span>AES-256 Enclave</span>
        </div>
      </div>
    </div>
  );
}

