import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Stethoscope, 
  User, 
  ShieldCheck, 
  FileBadge, 
  KeyRound, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function RoleLoginModal({ role, isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Role-specific fields
  const [regNo, setRegNo] = useState('');
  const [abhaId, setAbhaId] = useState('');
  const [phone, setPhone] = useState('');
  const [adminToken, setAdminToken] = useState('');
  
  // OTP state for 2FA
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationStage, setVerificationStage] = useState('');

  // Pre-fill role-specific demo presets when opening
  useEffect(() => {
    setErrorMsg('');
    setLoading(false);
    setVerificationStage('');
    setOtpSent(false);
    setOtpCode('');
    setShowPassword(false);

    if (role === 'Doctor') {
      setEmail('doctor.sharma@medigen.ai');
      setPassword('Doc@Medigen2026#');
      setPhone('9876543210');
      setRegNo('DMC-49102-DL');
    } else if (role === 'Patient') {
      setEmail('rajesh.kumar@medigen.ai');
      setPassword('Patient@Abha91#');
      setPhone('9811234567');
      setAbhaId('91-4829-1092-4819@abdm');
    } else if (role === 'Admin') {
      setEmail('compliance.admin@nha.gov.in');
      setPassword('Admin@GovtNHA2026!');
      setPhone('9988776655');
      setAdminToken('NHA-DEL-SEC-09');
    }
  }, [role, isOpen]);

  // Handle simulated 2FA OTP Send
  const handleSendOtp = () => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please provide a valid 10-digit Indian mobile number for 2FA delivery.');
      return;
    }
    setErrorMsg('');
    setOtpSent(true);
    setOtpCode('492817'); // Auto-fill simulated OTP for hackathon demo
    setOtpTimer(45);
    const timer = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle Quick Demo Preset Autofill
  const handleAutofillDemo = () => {
    setErrorMsg('');
    if (role === 'Doctor') {
      setEmail('doctor.sharma@medigen.ai');
      setPassword('Doc@Medigen2026#');
      setPhone('9876543210');
      setRegNo('DMC-49102-DL');
    } else if (role === 'Patient') {
      setEmail('rajesh.kumar@medigen.ai');
      setPassword('Patient@Abha91#');
      setPhone('9811234567');
      setAbhaId('91-4829-1092-4819@abdm');
    } else {
      setEmail('compliance.admin@nha.gov.in');
      setPassword('Admin@GovtNHA2026!');
      setPhone('9988776655');
      setAdminToken('NHA-DEL-SEC-09');
    }
  };

  // Submission & Validation Logic
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setErrorMsg('Please enter a valid institutional or registered email address.');
      return;
    }

    // 2. Password validation
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    // 3. Role-specific validation
    if (role === 'Doctor') {
      if (!regNo.trim()) {
        setErrorMsg('State Medical Council / NMC Registration Number is required.');
        return;
      }
    } else if (role === 'Patient') {
      if (!abhaId.trim()) {
        setErrorMsg('Ayushman Bharat ABHA Health Address is required.');
        return;
      }
    } else if (role === 'Admin') {
      if (!adminToken.trim()) {
        setErrorMsg('Auditor Security Token is mandatory for Hospital Governance.');
        return;
      }
    }

    // Begin Simulated Multi-Step Authentication
    setLoading(true);
    setVerificationStage('Validating credentials against authoritative registry...');

    setTimeout(() => {
      if (role === 'Doctor') {
        setVerificationStage('Verifying NMC Registration & Clinical Enclave permissions...');
      } else if (role === 'Patient') {
        setVerificationStage('Synchronizing ABHA Health Vault & Patient Consent tokens...');
      } else {
        setVerificationStage('Verifying IST Security Audit logs & 2FA hardware keys...');
      }

      setTimeout(() => {
        setLoading(false);
        const userData = {
          role,
          email,
          name: role === 'Doctor' ? 'Dr. Ananya Sharma, MD' : role === 'Patient' ? 'Rajesh Kumar' : 'Dr. Vikramaditya Roy',
          phone: `+91 ${phone.replace(/\D/g, '') || '9876543210'}`,
          regNo: role === 'Doctor' ? regNo : null,
          abhaId: role === 'Patient' ? abhaId : null,
          adminToken: role === 'Admin' ? adminToken : null
        };
        onLoginSuccess(userData);
      }, 500);
    }, 600);
  };

  // Visual Theme configs per role
  const theme = {
    Doctor: {
      badgeBg: 'bg-[#D4E4CE]',
      badgeText: 'text-[#2C4A2E]',
      badgeLabel: 'LICENSED CLINICIANS',
      primaryBtn: 'bg-[#1E3A38] hover:bg-[#142927] text-white',
      borderFocus: 'focus:ring-[#1E3A38]',
      icon: <Stethoscope className="w-6 h-6 text-[#1E3A38]" />,
      accentColor: '#1E3A38'
    },
    Patient: {
      badgeBg: 'bg-[#E8ECF4]',
      badgeText: 'text-[#2D3748]',
      badgeLabel: 'PATIENTS & CAREGIVERS',
      primaryBtn: 'bg-[#2C3B2D] hover:bg-[#1E291F] text-white',
      borderFocus: 'focus:ring-[#2C3B2D]',
      icon: <User className="w-6 h-6 text-[#2D3748]" />,
      accentColor: '#2C3B2D'
    },
    Admin: {
      badgeBg: 'bg-[#EDE9FE]',
      badgeText: 'text-[#4D3D66]',
      badgeLabel: 'HOSPITAL GOVERNANCE',
      primaryBtn: 'bg-[#3C2A5C] hover:bg-[#2B1D44] text-white',
      borderFocus: 'focus:ring-[#3C2A5C]',
      icon: <ShieldCheck className="w-6 h-6 text-[#4D3D66]" />,
      accentColor: '#3C2A5C'
    }
  }[role] || {
    badgeBg: 'bg-[#D4E4CE]',
    badgeText: 'text-[#2C4A2E]',
    badgeLabel: 'AUTHENTICATED ACCESS',
    primaryBtn: 'bg-[#1E3A38] hover:bg-[#142927] text-white',
    borderFocus: 'focus:ring-[#1E3A38]',
    icon: <ShieldCheck className="w-6 h-6 text-[#1E3A38]" />,
    accentColor: '#1E3A38'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fadeIn">
      {/* Modal Box */}
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-[#3A6364]/15 overflow-hidden relative flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Strip */}
        <div className="p-6 sm:p-7 border-b border-[#3A6364]/10 bg-[#FDFBF7] flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${theme.badgeBg} ${theme.badgeText}`}>
                {theme.badgeLabel}
              </span>
              <span className="text-[11px] font-semibold text-[#8A9A86] flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#1E3A38]" /> TLS 1.3
              </span>
            </div>
            <h2 className="font-headline text-2xl font-bold text-[#1A202C]">
              {role === 'Doctor' ? 'Doctor Workspace Login' : role === 'Patient' ? 'Patient Portal Login' : 'Administrator Panel Login'}
            </h2>
            <p className="text-xs text-[#718096]">
              {role === 'Doctor' 
                ? 'Authorized clinical decision access with NMC registration verification.' 
                : role === 'Patient' 
                ? 'Self-sovereign health record access linked to ABHA ID & Mobile 2FA.' 
                : 'Hospital governance and regulatory audit node with mandatory 2FA.'}
            </p>
          </div>

          {/* Close X Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F4F2FF] text-[#718096] hover:text-[#1A202C] transition-colors"
            title="Cancel and close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-5">
          {/* Quick Demo Autofill Hint */}
          <div className="flex items-center justify-between p-2.5 bg-[#F4F2FF] rounded-2xl border border-[#3A6364]/10 text-xs text-[#4A5568]">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-[#7C6A96]" />
              Hackathon Evaluation Mode
            </span>
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="text-[11px] font-bold text-[#1E3A38] hover:underline flex items-center gap-1"
            >
              Autofill Validated Persona
            </button>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-[#FFDAD6] border border-[#BA1A1A]/30 flex items-center gap-2.5 text-xs text-[#93000A] font-medium">
              <AlertCircle className="w-4 h-4 text-[#BA1A1A] shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} id="role-login-form" className="space-y-4">
            {/* 1. Institutional / Registered Email Address */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-[#2D3748]">
                  {role === 'Doctor' ? 'Institutional / Hospital Email' : role === 'Patient' ? 'Registered Patient Email' : 'Government / Auditor Email'}
                </label>
                <span className="text-[10px] font-semibold text-[#8A9A86]">Required</span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#718096]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@hospital.org"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFD] text-[#1A202C] placeholder-[#A0AEC0] text-xs sm:text-sm border border-[#CBD5E0] focus:outline-none focus:bg-white focus:border-transparent ${theme.borderFocus} focus:ring-2 transition-all`}
                  required
                />
              </div>
            </div>

            {/* 2. Secure Password with Show/Hide Toggle */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-[#2D3748]">
                  Secure Account Password
                </label>
                <span className="text-[10px] font-semibold text-[#8A9A86]">Encrypted</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#718096]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#F9FAFD] text-[#1A202C] placeholder-[#A0AEC0] text-xs sm:text-sm border border-[#CBD5E0] focus:outline-none focus:bg-white focus:border-transparent ${theme.borderFocus} focus:ring-2 transition-all font-mono`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#718096] hover:text-[#1A202C] p-0.5 rounded transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 3. Role-Specific Verification Fields */}
            <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#3A6364]/10 space-y-3.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#4A5568] block">
                Role-Specific Security Verification
              </span>

              {/* Doctor Specific: NMC Registration & Optional 2FA */}
              {role === 'Doctor' && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#2D3748]">
                        State Medical Council / NMC Registration No.
                      </label>
                      <span className="px-2 py-0.5 rounded-full bg-[#D4E4CE] text-[#2C4A2E] text-[10px] font-bold flex items-center gap-1">
                        <FileBadge className="w-3 h-3" /> NMC Validated
                      </span>
                    </div>
                    <div className="relative">
                      <FileBadge className="w-4 h-4 absolute left-3.5 top-3 text-[#718096]" />
                      <input
                        type="text"
                        value={regNo}
                        onChange={(e) => setRegNo(e.target.value)}
                        placeholder="e.g. DMC-49102-DL"
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white text-[#1A202C] text-xs sm:text-sm font-mono uppercase border border-[#CBD5E0] focus:outline-none focus:ring-2 focus:ring-[#1E3A38]"
                        required
                      />
                    </div>
                  </div>

                  {/* 2FA Mobile OTP Prompt */}
                  <div>
                    <label className="block text-xs font-bold text-[#2D3748] mb-1">
                      Doctor Registered Mobile (2FA Handshake)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#E2E8F0] rounded-xl text-xs font-bold text-[#2D3748] shrink-0">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#1A202C] text-xs font-mono border border-[#CBD5E0] focus:outline-none focus:ring-2 focus:ring-[#1E3A38]"
                      />
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpTimer > 0}
                        className="px-3 py-2 bg-[#D4E4CE] hover:bg-[#8A9A86] hover:text-white text-[#1E3A38] text-[11px] font-bold rounded-xl shrink-0 transition-colors disabled:opacity-50"
                      >
                        {otpTimer > 0 ? `${otpTimer}s` : otpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    </div>
                    {otpSent && (
                      <div className="mt-2 p-2 bg-[#D1E7DD] rounded-xl text-[11px] text-[#0F5132] flex items-center justify-between">
                        <span>Simulated OTP: <strong>492817</strong></span>
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="Code"
                          className="w-20 px-2 py-0.5 rounded bg-white text-center font-mono font-bold"
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Patient Specific: ABHA Health ID & Mobile Verification */}
              {role === 'Patient' && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#2D3748]">
                        ABHA Health Address / ABDM Identifier
                      </label>
                      <span className="px-2 py-0.5 rounded-full bg-[#E2D9F3] text-[#4D3D66] text-[10px] font-bold">
                        Ayushman Bharat
                      </span>
                    </div>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3 text-[#718096]" />
                      <input
                        type="text"
                        value={abhaId}
                        onChange={(e) => setAbhaId(e.target.value)}
                        placeholder="e.g. 91-4829-1092-4819@abdm"
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white text-[#1A202C] text-xs sm:text-sm font-mono border border-[#CBD5E0] focus:outline-none focus:ring-2 focus:ring-[#2C3B2D]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2D3748] mb-1">
                      Linked Indian Mobile Number
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#E2E8F0] rounded-xl text-xs font-bold text-[#2D3748] shrink-0">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9811234567"
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#1A202C] text-xs font-mono border border-[#CBD5E0] focus:outline-none focus:ring-2 focus:ring-[#2C3B2D]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Admin Specific: Statutory Security Token & Dual Factor */}
              {role === 'Admin' && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#2D3748]">
                        Auditor Security Token / Government Key
                      </label>
                      <span className="px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#4D3D66] text-[10px] font-bold">
                        Statutory Level 3
                      </span>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-[#718096]" />
                      <input
                        type="text"
                        value={adminToken}
                        onChange={(e) => setAdminToken(e.target.value)}
                        placeholder="e.g. NHA-DEL-SEC-09"
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white text-[#1A202C] text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#3C2A5C] border border-[#CBD5E0]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2D3748] mb-1">
                      Authorized Admin Dual-Factor Mobile (+91)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#E2E8F0] rounded-xl text-xs font-bold text-[#2D3748] shrink-0">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9988776655"
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#1A202C] text-xs font-mono border border-[#CBD5E0] focus:outline-none focus:ring-2 focus:ring-[#3C2A5C]"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Verification Stage Notice while loading */}
            {loading && (
              <div className="p-3 bg-[#F0FDF4] border border-[#86EFAC] rounded-2xl flex items-center gap-2 text-xs text-[#166534] animate-pulse">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-[#166534] border-t-transparent animate-spin shrink-0"></span>
                <span>{verificationStage}</span>
              </div>
            )}
          </form>
        </div>

        {/* 4. Action Buttons Footer */}
        <div className="p-5 sm:p-6 border-t border-[#3A6364]/10 bg-[#FDFBF7] flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#CBD5E0] hover:bg-white text-[#4A5568] hover:text-[#1A202C] text-xs sm:text-sm font-bold transition-all text-center"
          >
            Cancel / Back to Role Selection
          </button>

          <button
            type="submit"
            form="role-login-form"
            disabled={loading}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl ${theme.primaryBtn} text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-60`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Verify &amp; Enter Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

