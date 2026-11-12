import React, { useState } from 'react';
import { 
  Stethoscope, 
  User, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  FileBadge, 
  Cpu, 
  Languages, 
  PhoneCall, 
  Activity,
  HeartPulse,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import RoleLoginModal from './RoleLoginModal';

export default function LandingRoleSelection({ onSelectRole }) {
  const [activeModalRole, setActiveModalRole] = useState(null); // 'Doctor', 'Patient', 'Admin' or null

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A202C] font-sans flex flex-col justify-between selection:bg-[#1E3A38] selection:text-white">
      {/* Top Compliance Bar */}
      <div className="w-full bg-[#F4F2FF] border-b border-[#3A6364]/10 px-4 sm:px-8 py-2 text-xs text-[#404848] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-[#1E3A38]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A38]" />
            DPDP Act (2023) Certified System
          </span>
          <span className="text-[#C0C8C8] hidden sm:inline">|</span>
          <span className="hidden sm:inline text-[#536251] font-medium">
            Ayushman Bharat Digital Mission (ABDM) Integrated
          </span>
        </div>
        <div className="flex items-center gap-3 text-[#536251] font-semibold">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            Multi-Tenant Enclave Node Active
          </span>
          <span className="text-[#C0C8C8] hidden md:inline">|</span>
          <span className="hidden md:inline text-[#7C6A96]">
            Emergency Hotline: 112 / +91 1800-MEDIGEN
          </span>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col justify-center">
        {/* ============================================================
            1. MAIN HEADER SECTION
            ============================================================ */}
        <section className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          {/* Centered Logo/Branding with Medical Shield Icon */}
          <div className="inline-flex items-center justify-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-[#3A6364]/15 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#1E3A38] text-white flex items-center justify-center shadow-md">
              <HeartPulse className="w-6 h-6 text-[#D1E7DD]" />
            </div>
            <div className="text-left">
              <span className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E3A38] leading-none block">
                Project MEDIGEN
              </span>
              <span className="text-[10px] font-bold text-[#8A9A86] tracking-widest uppercase">
                Clinical Intelligence DSS
              </span>
            </div>
          </div>

          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A202C] tracking-tight leading-tight">
            Secure Medical Decision Support &amp; Clinical Intelligence Ecosystem
          </h1>

          <p className="text-sm sm:text-base text-[#4A5568] max-w-2xl mx-auto leading-relaxed">
            Multi-modal diagnostic consensus engine connecting licensed clinicians, self-sovereign patient records, and statutory hospital governance nodes under strict DPDP Act boundaries.
          </p>
        </section>

        {/* ============================================================
            2. THREE ROLE SELECTION CARDS (GRID LAYOUT)
            ============================================================ */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-12">
          {/* ------------------------------------------------------------
              CARD 1: DOCTOR WORKSPACE (LICENSED CLINICIANS)
              ------------------------------------------------------------ */}
          <div className="bg-[#F9FAFD] rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-2px_rgba(30,58,56,0.06)] border border-[#3A6364]/15 flex flex-col justify-between transition-all duration-200 hover:shadow-[0_12px_32px_-4px_rgba(30,58,56,0.12)] hover:border-[#1E3A38]/30 group">
            <div className="space-y-4">
              {/* Badge & Icon Row */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase bg-[#D4E4CE] text-[#2C4A2E] border border-[#8A9A86]/30">
                  LICENSED CLINICIANS
                </span>
                <div className="w-10 h-10 rounded-2xl bg-white text-[#1E3A38] shadow-xs border border-[#3A6364]/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-5 h-5 text-[#1E3A38]" />
                </div>
              </div>

              {/* Title */}
              <div>
                <h2 className="font-headline text-2xl font-bold text-[#1A202C]">
                  Doctor Workspace
                </h2>
                <p className="text-xs text-[#718096] mt-0.5">
                  Clinical Cockpit &amp; Differential DSS
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                Full diagnostic synthesis, Gemini 3.8 Flash lab &amp; Rx extraction, RSSDI guidelines, and imaging risk assessment.
              </p>

              {/* Requirement Note */}
              <div className="p-3 bg-white rounded-2xl border border-[#3A6364]/10 text-xs text-[#2C4A2E] font-medium flex items-center gap-2">
                <FileBadge className="w-4 h-4 text-[#1E3A38] shrink-0" />
                <span>Requires State Medical Council verification.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-2.5">
              <button
                type="button"
                onClick={() => setActiveModalRole('Doctor')}
                className="w-full py-3 px-4 rounded-xl bg-[#1E3A38] hover:bg-[#142927] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group/btn"
              >
                <span>Doctor Login</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onSelectRole('Doctor', 'register')}
                className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-white text-[#1E3A38] font-bold text-xs border border-[#1E3A38]/30 transition-all text-center"
              >
                Register as Doctor
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------
              CARD 2: PATIENT PORTAL (PATIENTS & CAREGIVERS)
              ------------------------------------------------------------ */}
          <div className="bg-[#F9FAFD] rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-2px_rgba(30,58,56,0.06)] border border-[#3A6364]/15 flex flex-col justify-between transition-all duration-200 hover:shadow-[0_12px_32px_-4px_rgba(30,58,56,0.12)] hover:border-[#354A36]/30 group">
            <div className="space-y-4">
              {/* Badge & Icon Row */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase bg-[#E8ECF4] text-[#2D3748] border border-[#CBD5E0]">
                  PATIENTS &amp; CAREGIVERS
                </span>
                <div className="w-10 h-10 rounded-2xl bg-white text-[#2D3748] shadow-xs border border-[#CBD5E0] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <User className="w-5 h-5 text-[#2D3748]" />
                </div>
              </div>

              {/* Title */}
              <div>
                <h2 className="font-headline text-2xl font-bold text-[#1A202C]">
                  Patient Portal
                </h2>
                <p className="text-xs text-[#718096] mt-0.5">
                  Self-Sovereign Health Node
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                Multilingual health summaries in English, Hindi (हिंदी) &amp; Kannada (ಕನ್ನಡ), lab timeline, and emergency hotline 112.
              </p>

              {/* Requirement Note */}
              <div className="p-3 bg-white rounded-2xl border border-[#CBD5E0] text-xs text-[#2D3748] font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#2D3748] shrink-0" />
                <span>UHID &amp; ABHA health record synchronization.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-2.5">
              <button
                type="button"
                onClick={() => setActiveModalRole('Patient')}
                className="w-full py-3 px-4 rounded-xl bg-[#2C3B2D] hover:bg-[#1E291F] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group/btn"
              >
                <span>Patient Login</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onSelectRole('Patient', 'register')}
                className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-white text-[#2C3B2D] font-bold text-xs border border-[#2C3B2D]/30 transition-all text-center"
              >
                Create Patient Account
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------
              CARD 3: ADMINISTRATOR PANEL (HOSPITAL GOVERNANCE)
              (Slightly elevated, distinct border style for primary governance highlight)
              ------------------------------------------------------------ */}
          <div className="bg-[#FAF8FE] rounded-3xl p-6 sm:p-7 shadow-[0_8px_28px_-4px_rgba(77,61,102,0.12)] border-2 border-[#65547F]/40 ring-1 ring-[#65547F]/20 flex flex-col justify-between transition-all duration-200 hover:shadow-[0_16px_36px_-4px_rgba(77,61,102,0.18)] hover:border-[#4D3D66] group relative">
            {/* Top highlight indicator */}
            <div className="absolute -top-3 right-8 bg-[#4D3D66] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
              Governance Node
            </div>

            <div className="space-y-4">
              {/* Badge & Icon Row */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase bg-[#EDE9FE] text-[#4D3D66] border border-[#DDD6FE]">
                  HOSPITAL GOVERNANCE
                </span>
                <div className="w-10 h-10 rounded-2xl bg-white text-[#4D3D66] shadow-xs border border-[#DDD6FE] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-[#4D3D66]" />
                </div>
              </div>

              {/* Title */}
              <div>
                <h2 className="font-headline text-2xl font-bold text-[#1A202C]">
                  Administrator Panel
                </h2>
                <p className="text-xs text-[#718096] mt-0.5">
                  Statutory Audit &amp; Identity Verification
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                Verify doctor State Medical Council registrations, approve credentials, inspect IST security audit logs, and issue invitation tokens.
              </p>

              {/* Requirement Note */}
              <div className="p-3 bg-white rounded-2xl border border-[#DDD6FE] text-xs text-[#4D3D66] font-medium flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#4D3D66] shrink-0" />
                <span>Authorized invitations &amp; 2FA mandatory.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-2.5">
              <button
                type="button"
                onClick={() => setActiveModalRole('Admin')}
                className="w-full py-3 px-4 rounded-xl bg-[#3C2A5C] hover:bg-[#2B1D44] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group/btn"
              >
                <span>Administrator Login</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onSelectRole('Admin', 'register')}
                className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-white text-[#3C2A5C] font-bold text-xs border border-[#3C2A5C]/35 transition-all text-center"
              >
                Invited Admin Register
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================
            3. FOOTER / SECURITY BANNER (ALERT BOX)
            ============================================================ */}
        <section className="w-full rounded-2xl bg-[#FEF9C3]/75 border border-[#FEF08A] p-4 sm:p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-1 rounded-lg bg-[#FEF08A] text-[#854D0E] shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4 text-[#854D0E]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-bold text-[#854D0E] uppercase tracking-wide">
                Role-Based Access Enforcement:
              </h3>
              <p className="text-xs text-[#713F12] leading-relaxed">
                Credentials are verified against backend authority records. Selecting a portal does not grant unauthorized role escalation. Cross-portal requests are automatically rejected.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Bottom Bar */}
      <footer className="w-full border-t border-[#3A6364]/10 py-4 px-4 sm:px-8 text-center text-xs text-[#718096]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Project MEDIGEN • Haute-Clinical Diagnostic Intelligence DSS</span>
          <span>DPDP Act 2023 • Ayushman Bharat Digital Mission (ABDM) • ISO 27001</span>
        </div>
      </footer>

      {/* Role-Specific High-Security Authentication Modal */}
      <RoleLoginModal 
        role={activeModalRole}
        isOpen={!!activeModalRole}
        onClose={() => setActiveModalRole(null)}
        onLoginSuccess={(userData) => {
          setActiveModalRole(null);
          onSelectRole(activeModalRole, 'authenticated', userData);
        }}
      />
    </div>
  );
}

