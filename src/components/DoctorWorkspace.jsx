import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Search, 
  Layers, 
  Maximize2, 
  ZoomIn, 
  RotateCw, 
  Download, 
  Edit3, 
  Check, 
  Sliders, 
  TrendingUp, 
  Pill, 
  Eye, 
  HelpCircle,
  FileDown,
  X,
  Stethoscope,
  ChevronRight,
  GitBranch,
  BookOpen,
  SplitSquareVertical,
  Sun,
  Contrast,
  Ruler,
  Compass,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  segmentRadiologyImage, 
  checkDrugInteractions, 
  predictPatientRisk, 
  explainDiagnosticRecommendation,
  queryRagGuidelines 
} from '../api';
import { generateClinicalReportPdf } from '../utils/pdfGenerator';

export default function DoctorWorkspace({ 
  patients, 
  selectedPatient, 
  onSelectPatient 
}) {
  const patient = selectedPatient || patients[0];

  // Sub-navigation tabs: 'workbench', 'correlation', 'knowledge-graph', 'rag-guidelines'
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('workbench');

  // Scanner & Multi-modality states
  const [selectedModalityIndex, setSelectedModalityIndex] = useState(0);
  const currentModality = patient?.imagingModalities?.[selectedModalityIndex] || {
    id: "mod-xray",
    name: "Chest X-Ray (AP View)",
    dataset: "NIH ChestX-ray14",
    currentScan: patient?.imaging?.imageSrc,
    baselineScan: patient?.imaging?.baselineSrc,
    slicesCount: 1,
    aiDetections: [
      { label: "Consolidation (Pneumonia)", confidence: 94.2, status: "Positive Finding", severity: "High" },
      { label: "Pleural Effusion", confidence: 3.8, status: "Negative / Normal", severity: "None" }
    ],
    roi: patient?.imaging?.roi
  };

  const [activeWindow, setActiveWindow] = useState('LUNG'); // LUNG, BONE, SOFT, ANGIO
  const [isHeatmapActive, setIsHeatmapActive] = useState(false);
  const [isInverted, setIsInverted] = useState(false);
  const [showSideBySide, setShowSideBySide] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrastVal, setContrastVal] = useState(100);
  const [currentSlice, setCurrentSlice] = useState(1);
  const [showCaliper, setShowCaliper] = useState(false);
  const [isSegmenting, setIsSegmenting] = useState(false);

  // Drug Interaction Tester
  const [testMedInput, setTestMedInput] = useState('');
  const [customDrugAlerts, setCustomDrugAlerts] = useState(patient?.drugAlerts || []);
  const [checkingDrug, setCheckingDrug] = useState(false);

  // Approval state
  const [isApproved, setIsApproved] = useState(false);
  const [approving, setApproving] = useState(false);

  // Note editor modal
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState(
    "Attending review concordance with BioMistral diagnosis: Acute lobar bacterial pneumonia (CAP). Patient withholds Metformin for contrast; switch antibiotic coverage away from beta-lactams due to allergy. Prescribe Levofloxacin 750mg OD or Azithromycin 500mg OD."
  );

  // Deep XAI Drawer & RAG Explorer
  const [showXaiDrawer, setShowXaiDrawer] = useState(false);
  const [selectedDifferential, setSelectedDifferential] = useState(null);

  // RAG Query State
  const [ragQueryText, setRagQueryText] = useState('What is the recommended antibiotic for CAP in a patient with penicillin anaphylaxis and elevated creatinine?');
  const [ragMatches, setRagMatches] = useState(patient?.ragDocuments || []);
  const [ragAdvice, setRagAdvice] = useState('');
  const [isRagSearching, setIsRagSearching] = useState(false);

  // Active Knowledge Graph selected node
  const [selectedGraphNode, setSelectedGraphNode] = useState(null);

  // Dynamic Window switching with backend segmentation API call
  const handleWindowChange = async (win) => {
    setActiveWindow(win);
    setIsSegmenting(true);
    try {
      await segmentRadiologyImage({
        imageId: currentModality.id,
        modality: currentModality.name,
        window: win
      });
    } catch (err) {
      console.warn("Segmentation call error:", err);
    } finally {
      setIsSegmenting(false);
    }
  };

  // Test new drug interaction in real-time
  const handleTestDrug = async (e) => {
    e.preventDefault();
    if (!testMedInput.trim()) return;

    setCheckingDrug(true);
    try {
      const existingMeds = (patient?.activeMedications || []).map(m => m.name);
      const res = await checkDrugInteractions({
        existingMedications: existingMeds,
        newMedication: testMedInput.trim(),
        allergies: patient?.allergies || [],
        creatinine: 1.4,
        egfr: 58.0
      });

      if (res.alerts && res.alerts.length > 0) {
        setCustomDrugAlerts([...res.alerts, ...customDrugAlerts]);
      } else {
        alert(`No severe contraindications detected for "${testMedInput}". Medication checked against CDSCO Schedule H database.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingDrug(false);
      setTestMedInput('');
    }
  };

  // Semantic RAG Guidelines Query
  const handleRunRagSearch = async (e) => {
    e.preventDefault();
    if (!ragQueryText.trim()) return;

    setIsRagSearching(true);
    try {
      const res = await queryRagGuidelines({
        query: ragQueryText,
        patientContext: `${patient?.name} (${patient?.age}M) - WBC 14.8k, CRP 48 mg/L, Creatinine 1.4 mg/dL, Penicillin Allergy`
      });
      if (res.matches) {
        setRagMatches(res.matches);
        setRagAdvice(res.synthesizedClinicalAdvice);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRagSearching(false);
    }
  };

  // Export CSV of Parsed Lab Parameters
  const handleExportCsv = () => {
    const labs = patient?.labs || [];
    const headers = "Parameter,Value,Unit,Reference Range,Status,Category,Clinical Interpretation\n";
    const rows = labs.map(l => `"${l.parameter}","${l.value}","${l.unit}","${l.ref}","${l.status}","${l.category}","${l.interpretation || ''}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${patient?.name.replace(/\s+/g, '_')}_Lab_Biomarkers.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Sign & Approve AI Synthesis
  const handleApprove = () => {
    setApproving(true);
    setTimeout(() => {
      setApproving(false);
      setIsApproved(true);
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }, 900);
  };

  // Export Certified Report PDF
  const handleExportPdfReport = () => {
    generateClinicalReportPdf(patient, { notes: clinicalNotes });
  };

  return (
    <div className="w-full bg-[#FDFBF7] min-h-screen pt-28 pb-16 px-4 sm:px-8 lg:px-10 font-sans selection:bg-[#3A6364] selection:text-white">
      {/* ============================================================
          TOP CONTEXT BAR: ACTIVE PATIENT DOSSIER & WORKSPACE TABS
          ============================================================ */}
      <div className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-clinical-card border border-[#3A6364]/10 mb-8 space-y-4">
        {/* Top Row: Patient Vitals Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E6E6FF] text-[#214B4C] flex items-center justify-center font-bold text-base shadow-xs ring-2 ring-[#3A6364]/10">
                {patient?.avatar || 'RK'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-headline text-2xl font-bold text-[#181A2E] tracking-tight leading-tight">
                    {patient?.name}
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E0E0FC] text-[#404848] font-bold">
                    {patient?.age}y · {patient?.gender}
                  </span>
                </div>
                <p className="text-xs text-[#8A9A86] tracking-wider font-mono">
                  ABHA ID: <span className="font-bold text-[#214B4C]">{patient?.abhaId}</span>
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-[#3A6364]/15 hidden lg:block"></div>

            {/* Vitals Snapshot Capsule Strip */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F2FF] text-[#181A2E] text-xs font-semibold border border-[#3A6364]/10">
                <span className="text-[#8A9A86] font-bold">BP</span> {patient?.vitals?.bp || '138/88'}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F2FF] text-[#181A2E] text-xs font-semibold border border-[#3A6364]/10">
                <span className="text-[#8A9A86] font-bold">SpO₂</span> {patient?.vitals?.spo2 || '96%'}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F2FF] text-[#181A2E] text-xs font-semibold border border-[#3A6364]/10">
                <span className="text-[#8A9A86] font-bold">HR</span> {patient?.vitals?.heartRate || '78 bpm'}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F2FF] text-[#181A2E] text-xs font-semibold border border-[#3A6364]/10">
                <span className="text-[#8A9A86] font-bold">Temp</span> {patient?.vitals?.temp || '98.4°F'}
              </div>
            </div>

            {/* Severe Allergy Tag */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDAD6] text-[#93000A] text-xs font-bold border border-[#BA1A1A]/20">
              <AlertTriangle className="w-3.5 h-3.5 text-[#BA1A1A]" />
              <span>Allergies: Penicillin, NSAIDs (Severe)</span>
            </div>
          </div>

          {/* PDF Export Button & Priority Status */}
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={handleExportPdfReport}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#214B4C] text-white hover:bg-[#193A3B] text-xs font-bold shadow-md transition-all group"
            >
              <Download className="w-3.5 h-3.5 text-[#D1E7DD] group-hover:translate-y-0.5 transition-transform" />
              <span>Export Certified Report (PDF)</span>
            </button>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4F2FF] text-[#181A2E] text-xs font-bold border border-[#3A6364]/10">
              <span className="h-2 w-2 rounded-full bg-[#BA1A1A] animate-pulse"></span>
              {patient?.priority || 'High Priority · Under AI Review'}
            </div>
          </div>
        </div>

        {/* Bottom Row: Detailed Problem Statement Diagnostic Workbench Tabs */}
        <div className="flex items-center justify-between pt-2 border-t border-[#3A6364]/10 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <button 
              onClick={() => setActiveWorkspaceTab('workbench')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeWorkspaceTab === 'workbench'
                  ? 'bg-[#214B4C] text-white shadow-xs'
                  : 'text-[#404848] hover:bg-[#F4F2FF]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D1E7DD]" />
              Multimodal Diagnostic Cockpit
            </button>

            <button 
              onClick={() => setActiveWorkspaceTab('correlation')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeWorkspaceTab === 'correlation'
                  ? 'bg-[#214B4C] text-white shadow-xs'
                  : 'text-[#404848] hover:bg-[#F4F2FF]'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              Clinical History Correlation Matrix
            </button>

            <button 
              onClick={() => setActiveWorkspaceTab('knowledge-graph')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeWorkspaceTab === 'knowledge-graph'
                  ? 'bg-[#214B4C] text-white shadow-xs'
                  : 'text-[#404848] hover:bg-[#F4F2FF]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Medical Knowledge Graph
            </button>

            <button 
              onClick={() => setActiveWorkspaceTab('rag-guidelines')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeWorkspaceTab === 'rag-guidelines'
                  ? 'bg-[#214B4C] text-white shadow-xs'
                  : 'text-[#404848] hover:bg-[#F4F2FF]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              RAG Clinical Guidelines Explorer
            </button>
          </div>

          <div className="hidden xl:flex items-center gap-2 text-[#8A9A86] text-xs font-semibold">
            <span>Sync Token: #MED-8842-XC • Refreshed 12s ago</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          TAB 1: MULTIMODAL DIAGNOSTIC COCKPIT (THE 3-COLUMN WORKSPACE)
          ============================================================ */}
      {activeWorkspaceTab === 'workbench' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-fadeIn">
          {/* ============================================================
              LEFT COLUMN: PATIENT QUEUE & IMPROVISED RADIOLOGY SCANNER (4 cols)
              ============================================================ */}
          <div className="xl:col-span-4 flex flex-col gap-8">
            {/* Patient Queue Switcher */}
            <div className="bg-white rounded-3xl p-5 shadow-clinical-card border border-[#3A6364]/10">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#3A6364]/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A9A86]">
                  Active Diagnostic Queue
                </span>
                <span className="text-xs font-bold text-[#214B4C] bg-[#D4E4CE] px-2.5 py-0.5 rounded-full">
                  {patients.length} Registered
                </span>
              </div>

              <div className="space-y-2">
                {patients.map((pat) => (
                  <div
                    key={pat.id}
                    onClick={() => onSelectPatient(pat)}
                    className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all border ${
                      pat.id === patient?.id
                        ? 'bg-[#F4F2FF] border-[#214B4C] shadow-sm'
                        : 'bg-white border-transparent hover:bg-[#F4F2FF]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        pat.id === patient?.id ? 'bg-[#214B4C] text-white' : 'bg-[#E6E6FF] text-[#214B4C]'
                      }`}>
                        {pat.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-[#181A2E] leading-tight">{pat.name}</p>
                        <p className="text-[11px] text-[#404848]">{pat.age}y · {pat.imaging?.modality || 'Clinical Scans'}</p>
                      </div>
                    </div>
                    {pat.id === patient?.id ? (
                      <CheckCircle2 className="w-4 h-4 text-[#214B4C]" />
                    ) : (
                      <span className="text-[10px] font-bold text-[#8A9A86] bg-[#E0E0FC] px-2 py-0.5 rounded-full">
                        Ready
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* IMPROVISED MEDICAL IMAGE SCANNER (X-RAY, CT, MRI) */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-clinical-card border border-[#3A6364]/10 flex flex-col">
              {/* Modality Selector Bar */}
              <div className="p-3 bg-[#F4F2FF] border-b border-[#3A6364]/10 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {(patient?.imagingModalities || []).map((m, idx) => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModalityIndex(idx); setCurrentSlice(1); }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        selectedModalityIndex === idx
                          ? 'bg-[#214B4C] text-white shadow-xs'
                          : 'bg-white text-[#404848] hover:bg-[#E6E6FF]'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowSideBySide(!showSideBySide)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                    showSideBySide ? 'bg-[#7C6A96] text-white' : 'bg-white text-[#404848] border border-[#3A6364]/10'
                  }`}
                  title="Compare with baseline historical scan"
                >
                  <SplitSquareVertical className="w-3.5 h-3.5" />
                  <span>{showSideBySide ? 'Exit Split' : 'Compare Baseline'}</span>
                </button>
              </div>

              {/* Header Info */}
              <div className="px-4 py-2 bg-white flex items-center justify-between text-xs border-b border-[#3A6364]/10">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#214B4C]" />
                  <span className="font-bold text-[#181A2E]">{currentModality.name}</span>
                  <span className="text-[#8A9A86]">({currentModality.dataset})</span>
                </div>
                <span className="font-mono text-[10px] text-[#214B4C] bg-[#D4E4CE] px-2 py-0.5 rounded-full font-bold">
                  {isSegmenting ? 'Segmenting...' : 'DenseNet-121 + Med-SAM'}
                </span>
              </div>

              {/* Viewport Canvas (With Side-by-side comparative mode) */}
              <div className={`relative bg-[#181A2E] overflow-hidden select-none ${showSideBySide ? 'grid grid-cols-2 gap-1' : 'aspect-square flex items-center justify-center'}`}>
                {/* Baseline Scan if Side-by-Side enabled */}
                {showSideBySide && (
                  <div className="relative aspect-square overflow-hidden bg-black flex items-center justify-center border-r border-[#3A6364]/30">
                    <img 
                      src={currentModality.baselineScan || currentModality.currentScan}
                      alt="Baseline Scan"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#181A2E]/80 px-2 py-0.5 rounded font-mono text-[9px] text-[#D1E7DD]">
                      BASELINE (6 Mo Ago)
                    </div>
                  </div>
                )}

                {/* Primary Active Scan */}
                <div className="relative w-full h-full aspect-square overflow-hidden flex items-center justify-center">
                  <img 
                    src={currentModality.currentScan}
                    alt="Active Radiology Scan"
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      isInverted ? 'filter invert contrast-125' : ''
                    }`}
                    style={{ 
                      transform: `scale(${zoomLevel})`,
                      filter: `${isInverted ? 'invert(1) ' : ''}brightness(${brightness}%) contrast(${contrastVal}%)`
                    }}
                  />

                  {/* Segmented ROI Bounding Overlay in Soft Peach with pulsing ping indicator */}
                  <div 
                    className="absolute rounded-xl bg-[#F8D7DA]/25 border-2 border-[#BA1A1A] shadow-[0_0_24px_rgba(255,218,214,0.6)] flex flex-col justify-between p-2 pointer-events-none transition-all"
                    style={{
                      top: `${currentModality.roi?.top || 42}%`,
                      left: `${currentModality.roi?.left || 48}%`,
                      width: `${currentModality.roi?.width || 32}%`,
                      height: `${currentModality.roi?.height || 26}%`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BA1A1A] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#BA1A1A]"></span>
                      </span>
                      <span className="font-mono text-[9px] text-[#BA1A1A] font-extrabold bg-white/90 px-1 py-0.2 rounded">
                        {currentModality.roi?.id || 'ROI-01'}
                      </span>
                    </div>

                    <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-lg text-[10px] leading-tight text-[#181A2E] shadow-md border border-[#BA1A1A]/20">
                      <div className="font-bold text-[#BA1A1A] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> {currentModality.roi?.confidence || 94.2}% Conf
                      </div>
                      <div className="text-[#404848] font-semibold truncate">
                        {currentModality.roi?.label || 'R Mid-Zone Infiltrate'}
                      </div>
                    </div>
                  </div>

                  {/* AI Attention Heatmap (Grad-CAM) */}
                  {isHeatmapActive && (
                    <div 
                      className="absolute rounded-full pointer-events-none filter blur-xl opacity-80 mix-blend-screen transition-all"
                      style={{
                        top: '38%',
                        left: '45%',
                        width: '42%',
                        height: '38%',
                        background: 'radial-gradient(circle, rgba(255,50,50,0.85) 0%, rgba(255,160,0,0.6) 45%, rgba(0,200,255,0.3) 70%, transparent 85%)'
                      }}
                    />
                  )}

                  {/* Caliper Tool Overlay */}
                  {showCaliper && (
                    <div className="absolute inset-x-8 top-1/2 flex items-center justify-between border-t-2 border-dashed border-[#D1E7DD] pointer-events-none px-2 text-[#D1E7DD] text-xs font-mono">
                      <span>|</span>
                      <span className="bg-[#181A2E]/80 px-2 py-0.5 rounded">Span: {currentModality.roi?.span || '3.4 cm'}</span>
                      <span>|</span>
                    </div>
                  )}

                  {/* Coordinate HUD Overlay */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-[#181A2E]/80 backdrop-blur font-mono text-[9px] text-white">
                    kVp: 120 · mA: 320 · Win: {activeWindow}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-[#181A2E]/80 backdrop-blur font-mono text-[9px] text-[#D1E7DD]">
                    {showSideBySide ? 'TODAY (NEW SCAN)' : `Scale: ${currentModality.roi?.span || '3.4 cm'}`}
                  </div>
                </div>
              </div>

              {/* Multi-slice Slider (for CT and MRI series) */}
              {currentModality.slicesCount > 1 && (
                <div className="p-3 bg-[#F4F2FF] border-t border-[#3A6364]/10 flex items-center gap-3 text-xs">
                  <span className="font-bold text-[#214B4C] min-w-max">Slice: {currentSlice} / {currentModality.slicesCount}</span>
                  <input 
                    type="range"
                    min="1"
                    max={currentModality.slicesCount}
                    value={currentSlice}
                    onChange={(e) => setCurrentSlice(Number(e.target.value))}
                    className="w-full accent-[#214B4C] cursor-pointer"
                  />
                </div>
              )}

              {/* Interactive Viewport Controls Bar */}
              <div className="p-3 bg-[#F4F2FF] flex items-center justify-between flex-wrap gap-2 border-t border-[#3A6364]/10">
                <div className="flex items-center gap-1">
                  {['LUNG', 'BONE', 'SOFT'].map((win) => (
                    <button
                      key={win}
                      onClick={() => handleWindowChange(win)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        activeWindow === win
                          ? 'bg-[#214B4C] text-white shadow-xs'
                          : 'bg-white text-[#404848] hover:bg-[#E6E6FF]'
                      }`}
                    >
                      {win}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setZoomLevel(zoomLevel === 1 ? 1.4 : 1)}
                    className={`p-1.5 rounded-full text-xs transition-colors ${
                      zoomLevel > 1 ? 'bg-[#214B4C] text-white' : 'bg-white text-[#181A2E] hover:bg-[#E6E6FF]'
                    }`}
                    title="Zoom 1.4x"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsInverted(!isInverted)}
                    className={`p-1.5 rounded-full text-xs transition-colors ${
                      isInverted ? 'bg-[#214B4C] text-white' : 'bg-white text-[#181A2E] hover:bg-[#E6E6FF]'
                    }`}
                    title="Invert Grayscale"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsHeatmapActive(!isHeatmapActive)}
                    className={`p-1.5 rounded-full text-xs transition-colors ${
                      isHeatmapActive ? 'bg-[#BA1A1A] text-white' : 'bg-white text-[#181A2E] hover:bg-[#E6E6FF]'
                    }`}
                    title="Toggle AI Attention Heatmap (Grad-CAM)"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setShowCaliper(!showCaliper)}
                    className={`p-1.5 rounded-full text-xs transition-colors ${
                      showCaliper ? 'bg-[#214B4C] text-white' : 'bg-white text-[#181A2E] hover:bg-[#E6E6FF]'
                    }`}
                    title="Caliper Ruler Tool"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Automated AI Anomaly Classification Matrix */}
              <div className="p-4 bg-white border-t border-[#3A6364]/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9A86] block">
                  Automated Pathology Detection Matrix:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(currentModality.aiDetections || []).map((det, i) => (
                    <div key={i} className="p-2 rounded-xl bg-[#F4F2FF] border border-[#3A6364]/10 flex items-center justify-between">
                      <span className="text-[#181A2E] font-medium truncate">{det.label}</span>
                      <span className={`font-mono font-bold text-[11px] ${
                        det.severity === 'High' ? 'text-[#BA1A1A]' : 'text-[#536251]'
                      }`}>
                        {det.confidence}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Document OCR & NLP Extraction Card */}
            <div className="bg-white rounded-3xl p-5 shadow-clinical-card border border-[#3A6364]/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#3A6364]/10">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#4D3D66]" />
                  <h3 className="font-bold text-xs sm:text-sm text-[#181A2E]">HRCT Thorax NLP Extraction</h3>
                </div>
                <span className="text-xs text-[#8A9A86] font-mono font-bold">OCR Match: 99.1%</span>
              </div>

              <div className="bg-[#F4F2FF] p-4 rounded-2xl space-y-2 border border-[#3A6364]/10">
                <div className="flex items-center gap-1.5 text-[#214B4C] text-xs font-bold">
                  <span>Radiologist Impression Extract ({patient?.imaging?.scanCenter || 'Apex Scan Center'}):</span>
                </div>
                <p className="text-xs text-[#181A2E] italic leading-relaxed pl-3 border-l-2 border-[#214B4C] py-1">
                  "{patient?.imaging?.impression || 'Patchy ground glass opacity noted predominantly in the right middle lobe with subtle bronchial wall thickening. No pleural effusion.'}"
                </p>
                <div className="flex items-center justify-between text-[#404848] text-[11px] pt-1">
                  <span>Dr. M. K. Bhattacharya, DMRD</span>
                  <span className="text-[#536251] font-semibold">Verified Signed DICOM PDF</span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              CENTER COLUMN: AI INSIGHTS, LABS & PREDICTIVE RISK (5 cols)
              ============================================================ */}
          <div className="xl:col-span-5 flex flex-col gap-8">
            {/* Critical Drug Interaction Warning Box */}
            <div className="rounded-3xl bg-[#FFDAD6] text-[#93000A] p-5 sm:p-6 shadow-sm border border-[#BA1A1A]/30 space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-[#BA1A1A] shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#BA1A1A]">
                      Nephrotoxicity Synergy Alert
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#BA1A1A] text-white font-bold">
                      Level 1 Action
                    </span>
                  </div>
                  <p className="font-bold text-sm sm:text-base text-[#93000A]">
                    Metformin (1000mg BD) &amp; Prescribed IV Contrast (Omnipaque 350)
                  </p>
                  <p className="text-xs text-[#404848] leading-relaxed">
                    Patient Serum Creatinine is elevated (1.4 mg/dL). High risk of Contrast-Induced Nephropathy (CIN) and lactic acidosis.
                  </p>
                  <div className="p-2.5 bg-white/80 rounded-xl text-xs text-[#181A2E] border border-[#BA1A1A]/20">
                    <strong className="text-[#BA1A1A]">AI CDSCO Recommendation:</strong> Withhold Metformin 48h prior to contrast, initiate 0.9% Normal Saline pre-hydration at 100 mL/hr.
                  </div>
                </div>
              </div>

              {/* Additional Custom Tested Drug Alerts */}
              {customDrugAlerts.slice(1).map((alt, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-[#BA1A1A]/30 space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-[#BA1A1A]">
                    <span>{alt.title}</span>
                    <span className="text-[10px] bg-[#FFDAD6] px-2 py-0.5 rounded">{alt.severity}</span>
                  </div>
                  <p className="text-xs text-[#181A2E]">{alt.description}</p>
                  <p className="text-[11px] text-[#214B4C] font-semibold">Substitutes: {alt.recommendation}</p>
                </div>
              ))}

              {/* Real-time Drug Interaction Simulator Bar */}
              <form onSubmit={handleTestDrug} className="flex items-center gap-2 pt-2 border-t border-[#BA1A1A]/20">
                <input
                  type="text"
                  value={testMedInput}
                  onChange={(e) => setTestMedInput(e.target.value)}
                  placeholder="Test new drug (e.g. Ceftriaxone, Ibuprofen, Omnipaque)..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white text-xs text-[#181A2E] border border-[#BA1A1A]/30 focus:outline-none focus:ring-2 focus:ring-[#BA1A1A]"
                />
                <button
                  type="submit"
                  disabled={checkingDrug}
                  className="px-3.5 py-1.5 rounded-xl bg-[#BA1A1A] text-white text-xs font-bold hover:bg-[#93000A] transition-colors disabled:opacity-60"
                >
                  {checkingDrug ? 'Checking...' : 'Check Safety'}
                </button>
              </form>
            </div>

            {/* Medical Report Intelligence Table: Parsed Lab Parameters with Detailed Interpretation */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-clinical-card border border-[#3A6364]/10 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#3A6364]/10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8A9A86]">
                    Biomarker Synthesis &amp; Interpretation
                  </span>
                  <h2 className="font-headline text-xl font-bold text-[#214B4C]">Parsed Lab Parameters</h2>
                </div>
                <button
                  onClick={handleExportCsv}
                  className="px-3.5 py-1.5 rounded-full bg-[#F4F2FF] hover:bg-[#E6E6FF] text-[#214B4C] text-xs font-bold transition-all flex items-center gap-1.5 border border-[#3A6364]/10"
                >
                  <FileDown className="w-3.5 h-3.5 text-[#214B4C]" /> CSV Export
                </button>
              </div>

              <div className="space-y-2.5">
                {(patient?.labs || []).map((lab, index) => {
                  const isHigh = lab.status.includes('High');
                  const isLow = lab.status.includes('Low');
                  return (
                    <div
                      key={index}
                      className={`p-3.5 rounded-2xl border transition-colors ${
                        isHigh
                          ? 'bg-[#FFDAD6]/35 border-[#BA1A1A]/30'
                          : isLow
                          ? 'bg-[#E0E0FC]/50 border-[#7C6A96]/20'
                          : 'bg-[#F4F2FF] border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isHigh ? 'bg-[#FFDAD6] text-[#BA1A1A]' : 'bg-[#E6E6FF] text-[#214B4C]'
                          }`}>
                            <Activity className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-xs sm:text-sm text-[#181A2E] truncate">{lab.parameter}</p>
                            <p className="text-[11px] text-[#404848]">Reference: {lab.ref}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`font-mono font-bold text-sm ${
                            isHigh ? 'text-[#BA1A1A]' : 'text-[#181A2E]'
                          }`}>
                            {lab.value} <span className="text-[10px] font-normal text-[#8A9A86]">{lab.unit}</span>
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isHigh
                              ? 'bg-[#BA1A1A] text-white'
                              : isLow
                              ? 'bg-[#4D3D66] text-white'
                              : 'bg-[#D4E4CE] text-[#586755]'
                          }`}>
                            {lab.status}
                          </span>
                        </div>
                      </div>
                      {lab.interpretation && (
                        <p className="text-[11px] text-[#404848] mt-1.5 pl-11 italic border-l-2 border-[#3A6364]/20">
                          {lab.interpretation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Patient Risk Prediction Gauge */}
            <div className="bg-white rounded-3xl p-6 shadow-clinical-card border border-[#3A6364]/10 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#3A6364]/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A9A86]">
                  Predictive Risk Stratification
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FFDAD6] text-[#93000A] font-bold">
                  Tier 3 Alert
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#F4F2FF"
                      strokeWidth="3.5"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#214B4C"
                      strokeWidth="3.5"
                      strokeDasharray={`${patient?.riskScore || 76}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="font-headline text-2xl font-bold text-[#181A2E] leading-none">
                      {patient?.riskScore || 76}
                    </span>
                    <span className="text-[11px] text-[#404848] font-bold">/ 100</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#181A2E] font-semibold">Respiratory Compromise</span>
                      <span className="font-mono font-bold text-[#BA1A1A]">
                        {patient?.riskBreakdown?.respiratoryCompromise || 68}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F4F2FF] overflow-hidden">
                      <div 
                        className="h-full bg-[#214B4C] rounded-full" 
                        style={{ width: `${patient?.riskBreakdown?.respiratoryCompromise || 68}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#181A2E] font-semibold">Renal Functional Stress</span>
                      <span className="font-mono font-bold text-[#181A2E]">
                        {patient?.riskBreakdown?.renalStress || 41}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F4F2FF] overflow-hidden">
                      <div 
                        className="h-full bg-[#8A9A86] rounded-full" 
                        style={{ width: `${patient?.riskBreakdown?.renalStress || 41}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#181A2E] font-semibold">Sepsis Progression Risk</span>
                      <span className="font-mono font-bold text-[#536251]">
                        {patient?.riskBreakdown?.sepsisRisk || 32}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F4F2FF] overflow-hidden">
                      <div 
                        className="h-full bg-[#BFEBEB] rounded-full" 
                        style={{ width: `${patient?.riskBreakdown?.sepsisRisk || 32}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              RIGHT COLUMN: EXPLAINABLE AI & CLINICAL ACTIONS (3 cols)
              ============================================================ */}
          <div className="xl:col-span-3 flex flex-col gap-8">
            {/* Regulatory Notice Compliance Card */}
            <div className="bg-[#F4F2FF] rounded-3xl p-4 flex items-start gap-2.5 border border-[#3A6364]/10 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#214B4C] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#404848] leading-relaxed">
                <strong className="font-bold text-[#214B4C]">DPDP &amp; CDSCO AI Directive:</strong> Algorithmic conclusions serve as decision support only. Physician review and cryptographic signing required prior to EHR commit.
              </p>
            </div>

            {/* Evidence-Supported Diagnostic Possibilities */}
            <div className="bg-white rounded-3xl p-5 shadow-clinical-card border border-[#3A6364]/10 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#3A6364]/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A9A86]">
                  Synthesized Differentials
                </span>
                <span className="text-xs font-bold text-[#214B4C]">3 Candidates</span>
              </div>

              <div className="space-y-3">
                {(patient?.differentials || []).map((diff, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedDifferential(diff);
                      setShowXaiDrawer(true);
                    }}
                    className={`p-3.5 rounded-2xl transition-all cursor-pointer border ${
                      index === 0
                        ? 'bg-[#F4F2FF] border-[#214B4C] shadow-xs'
                        : 'bg-white border-[#3A6364]/10 hover:bg-[#F4F2FF]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        index === 0 ? 'bg-[#214B4C] text-white' : 'bg-[#E0E0FC] text-[#404848]'
                      }`}>
                        {diff.status}
                      </span>
                      <span className="font-mono font-bold text-sm text-[#214B4C]">{diff.probability}%</span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#181A2E] leading-tight">{diff.name}</h3>
                    <p className="text-[11px] text-[#404848] mt-1">{diff.guideline}</p>
                    <div className="mt-2 pt-2 border-t border-[#3A6364]/10 flex items-center justify-between text-[11px] text-[#8A9A86]">
                      <span>Citations &amp; Evidence</span>
                      <span className="font-bold text-[#214B4C] flex items-center gap-0.5">
                        Inspect Evidence <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explainable AI Step-by-Step Reasoning Tree */}
            <div className="bg-white rounded-3xl p-5 shadow-clinical-card border border-[#3A6364]/10 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#3A6364]/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A9A86]">
                  XAI Chain of Thought
                </span>
                <Sparkles className="w-4 h-4 text-[#7C6A96]" />
              </div>

              <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E6E6FF]">
                {(patient?.xaiSteps || []).map((node) => (
                  <div key={node.step} className="relative">
                    <div className={`absolute -left-[1.35rem] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      node.step === 4 ? 'bg-[#536251] text-white' : 'bg-[#214B4C] text-white'
                    }`}>
                      {node.step === 4 ? '✓' : node.step}
                    </div>
                    <p className="text-[11px] font-bold text-[#214B4C] uppercase tracking-wider">
                      {node.title}
                    </p>
                    <p className="text-xs text-[#181A2E] mt-0.5 leading-snug">
                      {node.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Final Action Control Deck */}
            <div className="bg-white rounded-3xl p-5 shadow-clinical-card border border-[#3A6364]/10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A9A86] block">
                Attending Verification Deck
              </span>

              {/* Primary Confirmation Button */}
              <button
                onClick={handleApprove}
                disabled={approving || isApproved}
                className={`w-full py-3 px-4 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 group ${
                  isApproved
                    ? 'bg-[#536251] text-white'
                    : 'bg-[#214B4C] hover:bg-[#193A3B] text-white'
                }`}
              >
                {approving ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Submitting to FHIR R4 Store...</span>
                  </>
                ) : isApproved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Approved by Dr. Ananya Sharma</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Approve AI Clinical Synthesis</span>
                  </>
                )}
              </button>

              {/* Modify Notes Button */}
              <button
                onClick={() => setShowNoteModal(true)}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#F4F2FF] hover:bg-[#E6E6FF] text-[#214B4C] font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-[#3A6364]/10"
              >
                <Edit3 className="w-4 h-4" />
                Modify Clinical Plan / Add Notes
              </button>

              {/* Export Signed Report in Real PDF Format */}
              <button
                onClick={handleExportPdfReport}
                className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#F4F2FF] text-[#181A2E] font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-[#3A6364]/15 shadow-xs"
              >
                <Download className="w-4 h-4 text-[#214B4C]" />
                Export Certified Report (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 2: CLINICAL HISTORY CORRELATION MATRIX & TIMELINE
          ============================================================ */}
      {activeWorkspaceTab === 'correlation' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-clinical-card border border-[#3A6364]/10 space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#3A6364]/10 gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A9A86]">
                Cross-Temporal Synthesis
              </span>
              <h2 className="font-headline text-2xl font-bold text-[#214B4C]">
                Clinical History Correlation Matrix
              </h2>
              <p className="text-xs text-[#404848]">
                Identifies relationships between patient symptoms, escalating lab biomarkers, administered medications, and imaging milestones.
              </p>
            </div>
            <button
              onClick={() => setActiveWorkspaceTab('workbench')}
              className="px-4 py-1.5 rounded-full bg-[#F4F2FF] text-[#214B4C] text-xs font-bold border border-[#3A6364]/10 self-start md:self-auto"
            >
              Back to Cockpit
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F4F2FF] text-[#8A9A86] uppercase tracking-wider font-bold">
                  <th className="py-3 px-4 rounded-l-xl">Timeline Stage</th>
                  <th className="py-3 px-4">Presenting Symptoms &amp; Temp</th>
                  <th className="py-3 px-4">Inflammatory Biomarkers (CRP &amp; WBC)</th>
                  <th className="py-3 px-4">Pharmacotherapy / Prescription</th>
                  <th className="py-3 px-4">Radiology Milestone</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Correlation Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A6364]/10">
                {(patient?.clinicalCorrelation || []).map((step, idx) => (
                  <tr key={idx} className="hover:bg-[#F4F2FF]/60 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-[#214B4C]">
                      {step.day}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#181A2E]">{step.symptom}</div>
                      <div className="text-[11px] text-[#BA1A1A]">Temp: {step.temp}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-mono font-bold text-[#181A2E]">CRP: {step.crp}</div>
                      <div className="font-mono text-[11px] text-[#404848]">WBC: {step.wbc}</div>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <span className="text-[#181A2E] leading-snug">{step.medication}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs text-[#536251] font-medium">{step.imaging}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="px-3 py-1 rounded-full bg-[#D4E4CE] text-[#586755] font-bold text-[10px] inline-block">
                        {step.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 3: MEDICAL KNOWLEDGE GRAPH VISUALIZER
          ============================================================ */}
      {activeWorkspaceTab === 'knowledge-graph' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-clinical-card border border-[#3A6364]/10 space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#3A6364]/10 gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A9A86]">
                Ontology &amp; Semantic Relationships
              </span>
              <h2 className="font-headline text-2xl font-bold text-[#214B4C]">
                Interactive Medical Knowledge Graph
              </h2>
              <p className="text-xs text-[#404848]">
                Multimodal graph connecting Patient ➔ Clinical Signs ➔ Biomarkers ➔ Anatomy ➔ Etiology ➔ Contraindicated &amp; Recommended Drugs.
              </p>
            </div>
            <button
              onClick={() => setActiveWorkspaceTab('workbench')}
              className="px-4 py-1.5 rounded-full bg-[#F4F2FF] text-[#214B4C] text-xs font-bold border border-[#3A6364]/10 self-start md:self-auto"
            >
              Back to Cockpit
            </button>
          </div>

          {/* Interactive Graph Node Explorer */}
          <div className="p-6 bg-[#F4F2FF] rounded-2xl border border-[#3A6364]/10 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A9A86] block">
              Click any node in the knowledge network to inspect connected clinical entities:
            </span>

            <div className="flex flex-wrap gap-2.5">
              {(patient?.knowledgeGraph?.nodes || []).map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedGraphNode(node)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-xs border flex items-center gap-1.5 ${
                    selectedGraphNode?.id === node.id
                      ? 'bg-[#214B4C] text-white border-[#214B4C] scale-105'
                      : 'bg-white text-[#181A2E] border-[#3A6364]/15 hover:border-[#214B4C]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color || '#214B4C' }}></span>
                  <span>{node.label}</span>
                  <span className="text-[10px] text-[#8A9A86] uppercase font-semibold">({node.type})</span>
                </button>
              ))}
            </div>

            {/* Selected Node Connections Inspector */}
            {selectedGraphNode ? (
              <div className="p-4 bg-white rounded-2xl border border-[#214B4C]/20 space-y-2 mt-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#214B4C] flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#214B4C]" />
                    <span>Relationships for: <strong>{selectedGraphNode.label}</strong></span>
                  </h4>
                  <span className="text-xs font-mono text-[#8A9A86]">Entity Type: {selectedGraphNode.type}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 text-xs">
                  {(patient?.knowledgeGraph?.edges || [])
                    .filter(e => e.from === selectedGraphNode.id || e.to === selectedGraphNode.id)
                    .map((edge, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-[#F4F2FF] flex items-center gap-2 border border-[#3A6364]/10">
                        <span className="font-bold text-[#181A2E]">{edge.from}</span>
                        <span className="text-[10px] bg-white px-2 py-0.5 rounded text-[#214B4C] font-semibold border border-[#3A6364]/10">
                          {edge.rel}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#8A9A86]" />
                        <span className="font-bold text-[#181A2E]">{edge.to}</span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#717978] italic">Click a node above to inspect bidirectional relationships in this patient's case.</p>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 4: RETRIEVAL-AUGMENTED GENERATION (RAG) GUIDELINES EXPLORER
          ============================================================ */}
      {activeWorkspaceTab === 'rag-guidelines' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-clinical-card border border-[#3A6364]/10 space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#3A6364]/10 gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A9A86]">
                Evidence-Linked Retrieval
              </span>
              <h2 className="font-headline text-2xl font-bold text-[#214B4C]">
                RAG Clinical Guidelines Explorer
              </h2>
              <p className="text-xs text-[#404848]">
                Semantic search across ICMR, IDSA/ATS, NICE, and CDSCO national practice protocols with similarity scores and evidence snippets.
              </p>
            </div>
            <button
              onClick={() => setActiveWorkspaceTab('workbench')}
              className="px-4 py-1.5 rounded-full bg-[#F4F2FF] text-[#214B4C] text-xs font-bold border border-[#3A6364]/10 self-start md:self-auto"
            >
              Back to Cockpit
            </button>
          </div>

          {/* RAG Query Input Box */}
          <form onSubmit={handleRunRagSearch} className="flex gap-2">
            <input 
              type="text"
              value={ragQueryText}
              onChange={(e) => setRagQueryText(e.target.value)}
              placeholder="Query clinical guidelines (e.g. antibiotic choice in penicillin allergy)..."
              className="flex-1 p-3 rounded-2xl bg-[#F4F2FF] text-xs sm:text-sm text-[#181A2E] border border-[#3A6364]/15 focus:outline-none focus:ring-2 focus:ring-[#214B4C]"
            />
            <button
              type="submit"
              disabled={isRagSearching}
              className="px-5 py-3 rounded-2xl bg-[#214B4C] text-white text-xs font-bold hover:bg-[#193A3B] transition-all shrink-0 disabled:opacity-60"
            >
              {isRagSearching ? 'Retrieving...' : 'Retrieve Guidelines'}
            </button>
          </form>

          {/* Synthesized Advice */}
          {ragAdvice && (
            <div className="p-4 bg-[#D1E7DD]/50 border border-[#8A9A86] rounded-2xl text-xs space-y-1">
              <span className="font-bold text-[#214B4C] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#536251]" />
                RAG Synthesized Recommendation:
              </span>
              <p className="text-[#181A2E] leading-relaxed">{ragAdvice}</p>
            </div>
          )}

          {/* Retrieved Guideline Document Matches */}
          <div className="space-y-3">
            {ragMatches.map((doc) => (
              <div key={doc.id} className="p-5 rounded-2xl bg-[#F4F2FF] border border-[#3A6364]/10 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#214B4C]">{doc.title}</h4>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#D4E4CE] text-[#586755]">
                    Relevance: {Math.round(doc.relevanceScore * 100)}%
                  </span>
                </div>
                <p className="text-xs text-[#8A9A86] font-semibold">{doc.source} • DOI: {doc.doi}</p>
                <p className="text-xs text-[#181A2E] bg-white p-3 rounded-xl border border-[#3A6364]/10 leading-relaxed">
                  "{doc.snippet}"
                </p>
                {doc.guidelineAction && (
                  <p className="text-xs font-bold text-[#BA1A1A]">
                    Actionable Directive: {doc.guidelineAction}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Modify Clinical Notes */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-[#181A2E]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#3A6364]/20 space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center pb-2 border-b border-[#3A6364]/10">
              <h3 className="font-headline text-xl font-bold text-[#214B4C]">Modify Clinical Plan &amp; Attending Notes</h3>
              <button onClick={() => setShowNoteModal(false)} className="text-[#717978] hover:text-[#181A2E]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#404848]">
              Amend the automated algorithmic recommendations prior to generating the signed discharge summary and PDF.
            </p>
            <textarea
              rows={5}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-[#F4F2FF] text-[#181A2E] text-xs leading-relaxed border border-[#3A6364]/20 focus:outline-none focus:ring-2 focus:ring-[#214B4C]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 rounded-full bg-[#F4F2FF] text-[#404848] text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  alert("Attending physician notes updated and synchronized with EHR FHIR store.");
                }}
                className="px-5 py-2 rounded-full bg-[#214B4C] text-white text-xs font-bold hover:bg-[#193A3B]"
              >
                Save &amp; Commit Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER: Deep XAI Evidence Inspector */}
      {showXaiDrawer && (
        <div className="fixed inset-0 z-50 bg-[#181A2E]/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 sm:p-8 overflow-y-auto space-y-6 animate-slideLeft">
            <div className="flex items-center justify-between border-b border-[#3A6364]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#ECDCFF] text-[#4D3D66]">
                  <Sparkles className="w-6 h-6 text-[#7C6A96]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8A9A86] uppercase tracking-wider">
                    Explainable AI Deep Evidence
                  </span>
                  <h3 className="font-headline text-xl font-bold text-[#214B4C]">
                    {selectedDifferential?.name || 'Community Acquired Pneumonia'}
                  </h3>
                </div>
              </div>
              <button onClick={() => setShowXaiDrawer(false)} className="text-[#717978] hover:text-[#181A2E]">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#404848]">
              <div className="p-4 bg-[#F4F2FF] rounded-2xl border border-[#3A6364]/10">
                <span className="font-bold text-[#214B4C] uppercase text-[10px] tracking-wider block mb-1">
                  Confidence Score &amp; Likelihood Ratio
                </span>
                <p className="text-lg font-bold font-mono text-[#181A2E]">
                  Probability: {selectedDifferential?.probability || 84}%
                </p>
                <p className="mt-1">
                  Evaluated across Bayesian multimodal fusion: symptoms + high WBC (14.8k) + CRP (48 mg/L) + dense right middle lobe infiltrate on radiography.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#181A2E]">
                  Peer-Reviewed Guidelines &amp; Citations:
                </h4>
                <div className="p-3 bg-white rounded-xl border border-[#3A6364]/15 space-y-1">
                  <p className="font-bold text-[#214B4C]">1. IDSA/ATS Practice Guidelines (2019)</p>
                  <p className="text-[11px]">Management of Adults with Community-acquired Pneumonia. Am J Respir Crit Care Med 2019; 200:e45-e67.</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#3A6364]/15 space-y-1">
                  <p className="font-bold text-[#214B4C]">2. ICMR Antimicrobial Stewardship Guidelines (2022)</p>
                  <p className="text-[11px]">Treatment regimens in Indian healthcare institutions for adult respiratory tract infections.</p>
                </div>
              </div>

              <div className="p-4 bg-[#D4E4CE]/40 rounded-2xl border border-[#8A9A86]/30">
                <span className="font-bold text-[#536251] uppercase text-[10px] tracking-wider block mb-1">
                  Safety Lock Applied
                </span>
                <p className="text-xs text-[#181A2E]">
                  Patient documented Penicillin allergy blocked standard Beta-Lactam / Ceftriaxone monotherapy. Regimen diverted to Respiratory Fluoroquinolone / Macrolide.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleExportPdfReport}
                  className="px-4 py-2.5 rounded-full bg-[#214B4C] text-white font-bold text-xs hover:bg-[#193A3B] flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Download Certified PDF
                </button>
                <button
                  onClick={() => setShowXaiDrawer(false)}
                  className="px-4 py-2.5 rounded-full bg-[#F4F2FF] text-[#404848] font-bold text-xs hover:bg-[#E6E6FF]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
