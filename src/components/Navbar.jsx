import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Cloud, 
  PhoneCall, 
  Stethoscope, 
  User, 
  ShieldAlert, 
  LogOut,
  Activity,
  LayoutGrid
} from 'lucide-react';

export default function Navbar({ currentRole, setRole, currentUser, onLogout, onGoToLanding, activeTab, setActiveTab }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-xl border-b border-[#3A6364]/10 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Top Main Navigation Bar */}
      <div className="h-20 w-full px-4 sm:px-8 lg:px-10 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={onGoToLanding || (() => setActiveTab(currentRole === 'Patient' ? 'patient-portal' : currentRole === 'Doctor' ? 'clinical-decision-support' : 'governance-compliance'))}
            title="Click to view Portal & Role Selection"
          >
            <div className="w-10 h-10 rounded-xl bg-[#214B4C] text-white flex items-center justify-center shadow-md shadow-[#214B4C]/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-[#D1E7DD]" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-2xl font-bold tracking-tight text-[#214B4C] leading-none">
                MEDIGEN
              </span>
              <span className="font-sans text-[10px] font-bold text-[#8A9A86] tracking-widest uppercase mt-1">
                Clinical Intelligence &amp; Diagnostic DSS
              </span>
            </div>
          </div>

          {/* Role Navigation Pills */}
          <div className="hidden xl:flex items-center gap-1.5 bg-[#F4F2FF] p-1.5 rounded-full shadow-[0_1px_4px_rgba(58,99,100,0.04)] border border-[#3A6364]/10">
            {onGoToLanding && (
              <button
                type="button"
                onClick={onGoToLanding}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 text-[#536251] hover:text-[#181A2E] hover:bg-[#E6E6FF]"
                title="Return to Landing & Role Selection"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Portals Hub
              </button>
            )}
            <button
              onClick={() => { setRole('Patient'); setActiveTab('patient-portal'); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentRole === 'Patient'
                  ? 'bg-[#214B4C] text-white shadow-sm'
                  : 'text-[#404848] hover:text-[#181A2E] hover:bg-[#E6E6FF]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Patient Portal
            </button>
            <button
              onClick={() => { setRole('Doctor'); setActiveTab('clinical-decision-support'); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentRole === 'Doctor'
                  ? 'bg-[#214B4C] text-white shadow-sm'
                  : 'text-[#404848] hover:text-[#181A2E] hover:bg-[#E6E6FF]'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              Doctor Decision Support
            </button>
            <button
              onClick={() => { setRole('Admin'); setActiveTab('governance-compliance'); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentRole === 'Admin'
                  ? 'bg-[#214B4C] text-white shadow-sm'
                  : 'text-[#404848] hover:text-[#181A2E] hover:bg-[#E6E6FF]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Admin Governance
            </button>
          </div>
        </div>

        {/* Right Info: Helpline, Role Badge, and Profile */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Indian Emergency Helpline Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 bg-[#D4E4CE]/50 rounded-full text-[#536251] border border-[#8A9A86]/20">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8A9A86] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#536251]"></span>
            </span>
            <PhoneCall className="w-3.5 h-3.5 text-[#214B4C]" />
            <span className="text-xs font-semibold tracking-wide text-[#214B4C]">
              +91 1800-MEDIGEN Helpline Active
            </span>
          </div>

          {/* User Profile & Role Switcher Dropdown */}
          <div className="flex items-center gap-3 pl-2 sm:border-l border-[#3A6364]/15">
            {onGoToLanding && (
              <button
                type="button"
                onClick={onGoToLanding}
                className="xl:hidden p-2 rounded-full hover:bg-[#D4E4CE]/50 text-[#1E3A38] transition-colors"
                title="Back to Landing & Role Selection"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            )}

            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-xs font-bold text-[#181A2E] leading-tight">
                {currentUser?.name || (currentRole === 'Doctor' ? 'Dr. Ananya Sharma, MD' : currentRole === 'Patient' ? 'Rajesh Kumar' : 'Dr. Vikramaditya Roy')}
              </span>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold text-[#214B4C] uppercase tracking-wider">
                  {currentRole === 'Doctor' ? 'Senior Radiologist' : currentRole === 'Patient' ? 'ABHA Verified' : 'Compliance Lead'}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#D4E4CE] text-[#586755] font-bold">
                  {currentRole}
                </span>
              </div>
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#3A6364] text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-[#D1E7DD]">
              {currentRole === 'Doctor' ? 'AS' : currentRole === 'Patient' ? 'RK' : 'VR'}
            </div>

            {/* Logout / Switch Role Button */}
            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-[#F8D7DA] text-[#BA1A1A] transition-colors"
              title="Sign Out / Switch Profile"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-header: Regulatory & AI Telemetry Banner */}
      <div className="h-7 w-full px-4 sm:px-8 lg:px-10 bg-[#F4F2FF] border-t border-[#3A6364]/10 flex items-center justify-between text-[#404848] text-[11px]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#214B4C] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#214B4C]" />
            DPDP Act Compliance Verified (Digital Personal Data Protection 2023)
          </span>
          <span className="text-[#C0C8C8] hidden md:inline">|</span>
          <span className="hidden md:flex items-center gap-1.5 text-[#4D3D66] font-semibold">
            <Cpu className="w-3.5 h-3.5 text-[#7C6A96]" />
            Multimodal AI Engine v2.4 Online (Latency: 42ms)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#536251] font-semibold">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#8A9A86] inline-block animate-pulse"></span>
            FHIR R4 Sync Active
          </span>
        </div>
      </div>
    </header>
  );
}
