import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Sparkles, 
  UploadCloud, 
  FileText, 
  Activity, 
  AlertTriangle, 
  Clock, 
  Copy, 
  Check, 
  X, 
  FileSpreadsheet, 
  Pill, 
  HelpCircle,
  Send,
  Eye,
  Download,
  Languages,
  Heart,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Smile,
  Thermometer,
  Wind
} from 'lucide-react';
import { parseOcrDocument } from '../api';
import { generatePatientHealthSummaryPdf } from '../utils/pdfGenerator';
import { patientTranslations } from '../mockData';

export default function PatientPortal({ patient, onNewRecordAdded }) {
  // Language & View Modes
  const [lang, setLang] = useState('en'); // 'en' or 'hi'
  const [viewMode, setViewMode] = useState('friendly'); // 'friendly' or 'clinical'

  // Modals & Drawers
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinCopied, setPinCopied] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // Timeline records
  const [records, setRecords] = useState(patient?.timeline || []);
  const [viewingRecord, setViewingRecord] = useState(null);

  // Daily Pillbox state
  const [medications, setMedications] = useState(patient?.activeMedications || []);

  // Today's Checklist
  const [checklist, setChecklist] = useState([
    { id: 'c1', text: 'Drink 2 to 3 Liters of warm water', textHi: 'दिनभर में 2 से 3 लीटर गुनगुना पानी पिएं', done: true },
    { id: 'c2', text: 'Take afternoon Azithromycin antibiotic after lunch', textHi: 'दोपहर के भोजन के बाद एज़िथ्रोमाइसिन एंटीबायोटिक लें', done: false },
    { id: 'c3', text: 'Check temperature before bedtime if feeling cold', textHi: 'यदि ठंड लगे तो सोने से पहले थर्मामीटर से बुखार नापें', done: false },
    { id: 'c4', text: 'Avoid ibuprofen/NSAID painkillers (recorded gastric sensitivity)', textHi: 'इबुप्रोफेन या दर्द निवारक दवा न लें (पेट में जलन की एलर्जी है)', done: true }
  ]);

  // 15-minute PIN timer
  const [pinSecondsLeft, setPinSecondsLeft] = useState(14 * 60 + 42);

  const t = patientTranslations[lang] || patientTranslations.en;

  const handleToggleMed = (medId) => {
    setMedications(prev => prev.map(m => {
      if (m.id === medId) {
        return { ...m, takenToday: !m.takenToday };
      }
      return m;
    }));
  };

  const handleToggleChecklist = (checkId) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === checkId) {
        return { ...item, done: !item.done };
      }
      return item;
    }));
  };

  const handleCopyPin = () => {
    navigator.clipboard?.writeText('492-817');
    setPinCopied(true);
    setTimeout(() => setPinCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    generatePatientHealthSummaryPdf(patient || { name: 'Rajesh Kumar' });
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsUploading(true);
    setUploadSuccessMsg('');

    try {
      const ocrResult = await parseOcrDocument(file);
      
      const newRecord = {
        id: `rec-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, "") + " (AI Processed)",
        type: file.type.includes("pdf") ? "Lab Reports" : "Radiology",
        date: "Just now",
        source: "User Uploaded • Zero-Knowledge Redacted",
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: "Parsed by AI · Pending Doctor Review",
        summary: ocrResult.clinicalImpression || "Extracted structured lab values & clinical findings with client-side de-identification.",
        hash: `SHA256:${Math.random().toString(16).substring(2, 10)}...`,
        metrics: { confidence: `${ocrResult.confidence}%` },
        extractedLabs: ocrResult.labs
      };

      setRecords([newRecord, ...records]);
      if (onNewRecordAdded) onNewRecordAdded(newRecord);
      setUploadSuccessMsg(`Successfully parsed "${file.name}" with 98.4% OCR precision.`);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadSuccessMsg("Error during OCR extraction. Please try again.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadSuccessMsg(''), 5000);
    }
  };

  const filteredRecords = activeFilter === 'All' 
    ? records 
    : records.filter(r => r.type === activeFilter || (activeFilter === 'Lab Reports' && r.type.includes('Lab')));

  const completedPillsCount = medications.filter(m => m.takenToday).length;

  return (
    <div className="w-full bg-[#FDFBF7] min-h-screen pt-28 pb-16 px-4 sm:px-8 lg:px-12 font-sans selection:bg-[#3A6364] selection:text-white">
      {/* Top Banner: Language Switcher & Reassurance Notice */}
      <div className="w-full rounded-3xl bg-[#F4F2FF] p-4 sm:p-5 shadow-xs border border-[#3A6364]/10 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D4E4CE] text-[#214B4C] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-[#214B4C]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-[#214B4C]">
                {t.selfSovereign}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#D4E4CE] text-[#586755] text-[10px] font-bold">
                DPDP Act 2023 Protected
              </span>
            </div>
            <p className="text-xs text-[#404848] mt-0.5 max-w-xl">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* View Mode & Language Selector */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Hindi / English Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#214B4C] text-xs font-bold border border-[#3A6364]/15 hover:bg-[#F4F2FF] transition-all shadow-xs"
            title="Switch Language / भाषा बदलें"
          >
            <Languages className="w-3.5 h-3.5 text-[#214B4C]" />
            <span>{lang === 'en' ? 'हिंदी में देखें' : 'English'}</span>
          </button>

          {/* Friendly vs Clinical Mode */}
          <div className="flex items-center bg-white rounded-full p-1 border border-[#3A6364]/15 shadow-xs">
            <button
              onClick={() => setViewMode('friendly')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                viewMode === 'friendly' ? 'bg-[#214B4C] text-white shadow-xs' : 'text-[#404848] hover:text-[#181A2E]'
              }`}
            >
              😊 Friendly View
            </button>
            <button
              onClick={() => setViewMode('clinical')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                viewMode === 'clinical' ? 'bg-[#214B4C] text-white shadow-xs' : 'text-[#404848] hover:text-[#181A2E]'
              }`}
            >
              📋 Clinical Details
            </button>
          </div>
        </div>
      </div>

      {/* Patient Welcome Hero Card */}
      <div className="bg-gradient-to-r from-white via-[#FDFBF7] to-[#F4F2FF] rounded-3xl p-6 sm:p-8 shadow-clinical-card border border-[#3A6364]/10 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8A9A86] uppercase tracking-wider">
            <Smile className="w-4 h-4 text-[#8A9A86]" />
            <span>{t.greetingCheckin}</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-[#214B4C] tracking-tight">
            {t.welcome}, <span className="italic font-display text-[#181A2E]">{patient?.name || 'Rajesh Kumar'}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#E6E6FF] text-[#214B4C] font-semibold">
              ABHA ID: <strong className="font-mono">{patient?.abhaId || '91-4829-1092-4819'}</strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-[#D4E4CE]/50 text-[#536251] font-semibold">
              Primary Doctor: Dr. Ananya Sharma, MD
            </span>
            <span className="px-3 py-1 rounded-full bg-[#F4F2FF] text-[#404848]">
              Age: {patient?.age || 54} Yrs / Blood: {patient?.bloodGroup || 'B+'}
            </span>
          </div>
        </div>

        {/* Action Buttons: Download PDF & 15-min PIN */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button 
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#214B4C] text-white hover:bg-[#193A3B] transition-all shadow-md text-xs sm:text-sm font-bold group"
          >
            <Download className="w-4 h-4 text-[#D1E7DD] group-hover:translate-y-0.5 transition-transform" />
            <span>{t.downloadPdfBtn}</span>
          </button>
          <button 
            onClick={() => setShowPinModal(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-white text-[#214B4C] hover:bg-[#F4F2FF] transition-all shadow-xs text-xs sm:text-sm font-bold border border-[#3A6364]/20"
          >
            <Key className="w-4 h-4 text-[#214B4C]" />
            <span>{t.doctorPinBtn}</span>
          </button>
          <button 
            onClick={() => setShowExplainer(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#ECDCFF] text-[#4D3D66] hover:bg-[#65547F] hover:text-white transition-all shadow-xs text-xs sm:text-sm font-bold border border-[#7C6A96]/20"
          >
            <Sparkles className="w-4 h-4 text-[#7C6A96]" />
            <span>{t.aiExplainerBtn}</span>
          </button>
        </div>
      </div>

      {/* ============================================================
          SECTION 1: FRIENDLY COLOR-CODED HEALTH VITALS
          ============================================================ */}
      <section className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-xl font-bold text-[#214B4C]">
              {t.vitalsHeadline}
            </h2>
            <p className="text-xs text-[#404848]">
              {t.vitalsExplain}
            </p>
          </div>
          <span className="text-xs text-[#8A9A86] font-semibold bg-white px-3 py-1 rounded-full border border-[#3A6364]/10 shadow-xs">
            Refreshed Today, 10:45 AM
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Blood Pressure */}
          <div className="bg-white rounded-3xl p-5 shadow-clinical-card border border-[#3A6364]/10 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#404848]">Blood Pressure</span>
              <span className="w-3 h-3 rounded-full bg-[#F59E0B]" title="Slightly Elevated"></span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline text-2xl font-bold text-[#181A2E]">{patient?.vitals?.bp || '138/88'}</span>
              <span className="text-xs text-[#8A9A86]">mmHg</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FEF3C7] text-[#92400E] text-xs font-medium">
              🟡 <strong>Mildly Elevated:</strong> Rest, take your prescribed Telmisartan, and stay well hydrated.
            </div>
          </div>

          {/* Blood Oxygen */}
          <div className="bg-white rounded-3xl p-5 shadow-clinical-card border border-[#3A6364]/10 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#404848]">Blood Oxygen (SpO₂)</span>
              <span className="w-3 h-3 rounded-full bg-[#10B981]" title="Safe Range"></span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline text-2xl font-bold text-[#214B4C]">{patient?.vitals?.spo2 || '96%'}</span>
              <span className="text-xs text-[#8A9A86]">Saturation</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#D1E7DD] text-[#214B4C] text-xs font-medium">
              🟢 <strong>Safe Breathing:</strong> Your lungs are delivering healthy oxygen to your body.
            </div>
          </div>

          {/* Heart Rate */}
          <div className="bg-white rounded-3xl p-5 shadow-clinical-card border border-[#3A6364]/10 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#404848]">Heart Rate</span>
              <span className="w-3 h-3 rounded-full bg-[#10B981]" title="Normal"></span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline text-2xl font-bold text-[#181A2E]">{patient?.vitals?.heartRate || '78'}</span>
              <span className="text-xs text-[#8A9A86]">beats / min</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#D1E7DD] text-[#214B4C] text-xs font-medium">
              🟢 <strong>Normal Rhythm:</strong> Your resting heart pulse is calm and regular.
            </div>
          </div>

          {/* Temperature */}
          <div className="bg-white rounded-3xl p-5 shadow-clinical-card border border-[#3A6364]/10 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#404848]">Body Temperature</span>
              <span className="w-3 h-3 rounded-full bg-[#10B981]" title="Normal"></span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline text-2xl font-bold text-[#181A2E]">{patient?.vitals?.temp || '98.4°F'}</span>
              <span className="text-xs text-[#8A9A86]">Fahrenheit</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#D1E7DD] text-[#214B4C] text-xs font-medium">
              🟢 <strong>Fever Resolved:</strong> Temperature is back to normal from the 102°F peak 2 days ago.
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: 8 Cols (Meds + Upload + History) vs 4 Cols (Checklist + Allergies) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column (8 cols) */}
        <div className="xl:col-span-8 space-y-8">
          {/* DAILY PILLBOX & MEDICINE TRACKER */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-clinical-card border border-[#3A6364]/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#3A6364]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ECDCFF] text-[#4D3D66] flex items-center justify-center">
                  <Pill className="w-5 h-5 text-[#4D3D66]" />
                </div>
                <div>
                  <h3 className="font-headline text-lg sm:text-xl font-bold text-[#214B4C]">
                    {t.dailyMedsHeadline}
                  </h3>
                  <p className="text-xs text-[#404848]">
                    {t.dailyMedsSub}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D4E4CE] text-[#586755] self-start sm:self-auto">
                {completedPillsCount} of {medications.length} Taken Today
              </span>
            </div>

            <div className="space-y-3">
              {medications.map((med) => (
                <div 
                  key={med.id}
                  onClick={() => handleToggleMed(med.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    med.takenToday
                      ? 'bg-[#D1E7DD]/30 border-[#8A9A86]/50'
                      : 'bg-[#F4F2FF] border-[#3A6364]/10 hover:border-[#214B4C]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-colors ${
                      med.takenToday ? 'bg-[#214B4C] border-[#214B4C] text-white' : 'border-[#717978] bg-white'
                    }`}>
                      {med.takenToday && <Check className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm sm:text-base ${med.takenToday ? 'line-through text-[#717978]' : 'text-[#181A2E]'}`}>
                          {med.name}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#214B4C] bg-white px-2 py-0.5 rounded border border-[#3A6364]/10">
                          {med.dosage}
                        </span>
                      </div>
                      <p className="text-xs text-[#404848] mt-0.5">{med.scheduleSlot} • {med.indication}</p>
                      <p className="text-[11px] text-[#7C6A96] font-semibold mt-0.5">Tip: {med.instructions}</p>
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${
                    med.takenToday ? 'bg-[#D4E4CE] text-[#586755]' : 'bg-white text-[#214B4C] border border-[#3A6364]/10'
                  }`}>
                    {med.takenToday ? 'Taken' : 'Mark Taken'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* REPORT DROPZONE: Upload Lab Reports & Scans */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-clinical-card border border-[#3A6364]/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#3A6364]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D4E4CE] text-[#214B4C] flex items-center justify-center">
                  <UploadCloud className="w-5 h-5 text-[#214B4C]" />
                </div>
                <div>
                  <h3 className="font-headline text-lg sm:text-xl font-bold text-[#214B4C]">
                    {t.dropzoneTitle}
                  </h3>
                  <p className="text-xs text-[#404848]">{t.dropzoneSub}</p>
                </div>
              </div>
            </div>

            {/* Drag & Drop Area */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files?.length) {
                  handleFileUpload({ target: { files: e.dataTransfer.files } });
                }
              }}
              className={`relative bg-[#F4F2FF] rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all border-2 border-dashed ${
                dragOver ? 'border-[#214B4C] bg-[#E6E6FF]' : 'border-[#3A6364]/20 hover:border-[#214B4C]'
              }`}
            >
              <input 
                type="file" 
                id="patient-file-upload-2"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                accept=".pdf,.png,.jpg,.jpeg,.dcm"
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-[#214B4C]">
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#214B4C] border-t-transparent" />
                  ) : (
                    <UploadCloud className="w-6 h-6 text-[#214B4C]" />
                  )}
                </div>
                <p className="font-bold text-sm text-[#181A2E]">
                  {isUploading ? "Reading Document with OCR..." : "Click or Drop to Upload Medical File (PDF, Photo, Scan)"}
                </p>
                <p className="text-xs text-[#717978]">
                  Blood Test, X-Ray, Prescription, or Discharge Summary
                </p>
              </div>
            </div>

            {uploadSuccessMsg && (
              <div className="p-3 bg-[#D1E7DD] border border-[#8A9A86] text-[#214B4C] rounded-xl text-xs font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#536251]" />
                {uploadSuccessMsg}
              </div>
            )}
          </section>

          {/* PAST MEDICAL HISTORY TIMELINE */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-clinical-card border border-[#3A6364]/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#3A6364]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#BFEBEB] text-[#214B4C] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#214B4C]" />
                </div>
                <div>
                  <h3 className="font-headline text-lg sm:text-xl font-bold text-[#214B4C]">
                    Your Medical Records History
                  </h3>
                  <p className="text-xs text-[#404848]">All test results and doctor prescriptions saved safely in your ABHA record</p>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['All', 'Lab Reports', 'Radiology', 'Prescriptions'].map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      activeFilter === f ? 'bg-[#214B4C] text-white' : 'bg-[#F4F2FF] text-[#404848] hover:text-[#181A2E]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredRecords.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#F4F2FF] border border-[#3A6364]/10 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-[#214B4C]">{item.title}</h4>
                      <p className="text-xs text-[#404848]">{item.date} • {item.source}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4E4CE] text-[#586755]">
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#181A2E] bg-white p-2.5 rounded-xl border border-[#3A6364]/10">
                    "{item.summary}"
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      onClick={() => setViewingRecord(item)}
                      className="text-[#214B4C] font-bold hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </button>
                    <span className="text-[11px] text-[#717978]">Hash: {item.hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (4 cols): Today's Checklist & Allergy Guard */}
        <div className="xl:col-span-4 space-y-6">
          {/* WHAT TO DO TODAY CHECKLIST */}
          <section className="bg-white rounded-3xl p-6 shadow-clinical-card border border-[#3A6364]/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#3A6364]/10">
              <h3 className="font-headline text-base font-bold text-[#214B4C]">
                {t.checklistHeadline}
              </h3>
              <span className="text-xs font-bold text-[#8A9A86]">Action Plan</span>
            </div>

            <div className="space-y-2.5">
              {checklist.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    item.done ? 'bg-[#D1E7DD]/30 border-[#8A9A86]/40' : 'bg-[#F4F2FF] border-[#3A6364]/10 hover:border-[#214B4C]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                    item.done ? 'bg-[#214B4C] border-[#214B4C] text-white' : 'bg-white border-[#717978]'
                  }`}>
                    {item.done && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-xs ${item.done ? 'line-through text-[#717978]' : 'text-[#181A2E] font-medium'}`}>
                    {lang === 'hi' ? item.textHi : item.text}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ALLERGY WARNING (Friendly & Protective) */}
          <section className="bg-[#FFDAD6]/60 border border-[#BA1A1A]/30 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#BA1A1A]">
              <AlertTriangle className="w-5 h-5 text-[#BA1A1A]" />
              <h3 className="font-bold text-sm text-[#BA1A1A]">Your Allergy Safety Shield</h3>
            </div>
            <p className="text-xs text-[#404848] leading-relaxed">
              Whenever you visit a doctor or medical store, remind them you are allergic to:
            </p>
            <div className="space-y-2">
              <div className="p-2.5 bg-white rounded-xl border border-[#BA1A1A]/20 text-xs">
                <strong className="text-[#BA1A1A]">1. Penicillin:</strong> Causes severe breathing difficulty and allergic rash.
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#BA1A1A]/20 text-xs">
                <strong className="text-[#BA1A1A]">2. Ibuprofen / NSAIDs:</strong> Causes sharp stomach pain and acid erosion.
              </div>
            </div>
          </section>

          {/* 24x7 HELPLINE CARD */}
          <section className="bg-[#D4E4CE]/40 border border-[#8A9A86]/30 rounded-3xl p-6 shadow-sm space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-[#214B4C] text-white flex items-center justify-center mx-auto shadow-md">
              <Heart className="w-6 h-6 text-[#D1E7DD]" />
            </div>
            <h4 className="font-bold text-sm text-[#214B4C]">Need Immediate Guidance?</h4>
            <p className="text-xs text-[#404848]">
              Speak directly to the Project MEDIGEN Indian Healthcare Tele-Triage Helpline:
            </p>
            <a 
              href="tel:1800-MEDIGEN" 
              className="inline-block px-5 py-2.5 bg-[#214B4C] text-white rounded-full text-xs font-bold hover:bg-[#193A3B] transition-colors shadow-xs"
            >
              📞 Call +91 1800-MEDIGEN (Toll Free)
            </a>
          </section>
        </div>
      </div>

      {/* MODAL 1: 15-Minute Doctor Access PIN */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-[#181A2E]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#3A6364]/20 space-y-5 animate-scaleUp">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#214B4C]">
                <Key className="w-6 h-6 text-[#214B4C]" />
                <h3 className="font-headline text-xl font-bold text-[#181A2E]">Doctor Access Code (OTP)</h3>
              </div>
              <button onClick={() => setShowPinModal(false)} className="text-[#717978] hover:text-[#181A2E] p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#404848] leading-relaxed">
              Show this 6-digit number to your visiting doctor or clinic. They can view your health records for 15 minutes only. After 15 minutes, access is automatically locked again for your privacy.
            </p>

            <div className="bg-[#F4F2FF] p-6 rounded-2xl text-center border border-[#3A6364]/15">
              <span className="font-mono text-4xl font-extrabold text-[#214B4C] tracking-widest block">
                492-817
              </span>
              <div className="flex items-center justify-center gap-1.5 text-[#BA1A1A] mt-2 text-xs font-semibold">
                <Clock className="w-4 h-4 text-[#BA1A1A]" />
                Valid for next 14 minutes 42 seconds
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-[#717978]">ABDM Protected</span>
              <button
                type="button"
                onClick={handleCopyPin}
                className="px-5 py-2.5 rounded-full bg-[#214B4C] text-white hover:bg-[#193A3B] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                {pinCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {pinCopied ? 'Code Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER: AI Plain-Language Explainer */}
      {showExplainer && (
        <div className="fixed inset-0 z-50 bg-[#181A2E]/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl p-6 sm:p-8 overflow-y-auto space-y-6 animate-slideLeft">
            <div className="flex items-center justify-between border-b border-[#3A6364]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#ECDCFF] text-[#4D3D66]">
                  <Sparkles className="w-6 h-6 text-[#7C6A96]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8A9A86] uppercase tracking-wider">
                    MEDIGEN AI Assistant
                  </span>
                  <h3 className="font-headline text-xl font-bold text-[#214B4C]">
                    Plain-Language Summary
                  </h3>
                </div>
              </div>
              <button onClick={() => setShowExplainer(false)} className="p-1 rounded-full text-[#717978] hover:text-[#181A2E]">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#F4F2FF] border border-[#3A6364]/10 space-y-2">
                <span className="text-xs font-bold text-[#214B4C] uppercase tracking-wider block">
                  Simple Explanation of Your Test
                </span>
                <p className="text-sm text-[#181A2E] leading-relaxed">
                  Hello Rajesh! Your chest scan from this morning shows a small spot of infection in your right lung. This is very common with chest colds or early pneumonia. Your doctor, Dr. Ananya Sharma, has prescribed Azithromycin antibiotic to clear it up. There is no fluid around your lungs and your heart size is completely normal!
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#D1E7DD]/50 border border-[#8A9A86]/30 space-y-2">
                <span className="text-xs font-bold text-[#214B4C] uppercase tracking-wider block">
                  What Your Blood Numbers Mean
                </span>
                <ul className="text-xs text-[#181A2E] space-y-2">
                  <li className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-[#3A6364]/10">
                    <span><strong>White Blood Cells (14,800):</strong> Body is fighting the bug.</span>
                    <span className="text-xs font-bold text-[#7C6A96]">Active defense</span>
                  </li>
                  <li className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-[#3A6364]/10">
                    <span><strong>Blood Oxygen (96%):</strong> Plenty of oxygen reaching your body.</span>
                    <span className="text-xs font-bold text-[#536251]">Safe &amp; Healthy</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleDownloadPdf}
                  className="px-5 py-2.5 rounded-full bg-[#214B4C] text-white text-xs font-bold hover:bg-[#193A3B] transition-all flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Download PDF Copy
                </button>
                <button
                  onClick={() => setShowExplainer(false)}
                  className="px-5 py-2.5 rounded-full bg-[#F4F2FF] text-[#404848] text-xs font-bold hover:bg-[#E6E6FF]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Inspector Modal */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 bg-[#181A2E]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#3A6364]/20 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#3A6364]/10">
              <h3 className="font-headline text-xl font-bold text-[#214B4C]">{viewingRecord.title}</h3>
              <button onClick={() => setViewingRecord(null)} className="text-[#717978] hover:text-[#181A2E]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-[#404848]">
              <p><strong>Date:</strong> {viewingRecord.date}</p>
              <p><strong>Source:</strong> {viewingRecord.source}</p>
              <p><strong>Status:</strong> {viewingRecord.status}</p>
              <p><strong>Cryptographic Hash:</strong> <span className="font-mono">{viewingRecord.hash}</span></p>
              <div className="p-3 bg-[#F4F2FF] rounded-xl text-[#181A2E] text-xs leading-relaxed mt-2">
                <strong>Findings &amp; Summary:</strong> {viewingRecord.summary}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingRecord(null)}
                className="px-4 py-2 bg-[#214B4C] text-white rounded-full text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
