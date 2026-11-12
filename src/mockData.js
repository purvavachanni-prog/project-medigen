export const initialPatients = [
  {
    id: "pat-1",
    name: "Rajesh Kumar",
    age: 54,
    gender: "Male",
    bloodGroup: "B+",
    abhaId: "91-4829-1092-4819",
    abhaAddress: "rajesh.k@sbx",
    phone: "+91 98765 43210",
    avatar: "RK",
    priority: "High Priority · Under AI Review",
    assignedDoctor: "Dr. Ananya Sharma, MD",
    doctorMci: "DMC-49102-DL",
    vitals: {
      bp: "138/88 mmHg",
      spo2: "96%",
      heartRate: "78 bpm",
      temp: "98.4°F",
      respiratoryRate: "22 /min"
    },
    allergies: ["Penicillin (Severe Anaphylaxis)", "NSAIDs (Gastric Ulceration)"],
    activeMedications: [
      { 
        id: "med-1",
        name: "Metformin", 
        dosage: "1000mg BD", 
        indication: "Type 2 Diabetes Mellitus", 
        startDate: "2023-04-12",
        scheduleSlot: "Morning & Night with Meals",
        instructions: "Hold for 48 hours if undergoing contrast CT scan",
        takenToday: true
      },
      { 
        id: "med-2",
        name: "Telmisartan", 
        dosage: "40mg OD", 
        indication: "Hypertension / Blood Pressure", 
        startDate: "2023-06-18",
        scheduleSlot: "Morning after Breakfast",
        instructions: "Take daily with a glass of water",
        takenToday: true
      },
      { 
        id: "med-3",
        name: "Azithromycin", 
        dosage: "500mg OD", 
        indication: "Acute Chest Bacterial Infection", 
        startDate: "3 days ago", 
        remainingDays: 2,
        scheduleSlot: "Afternoon after Lunch",
        instructions: "Complete full 5-day course without skipping",
        takenToday: false
      }
    ],
    riskScore: 76,
    riskBreakdown: {
      respiratoryCompromise: 68,
      renalStress: 41,
      sepsisRisk: 32
    },
    // Multi-modality imaging modalities with comparative scans
    imagingModalities: [
      {
        id: "mod-xray",
        name: "Chest X-Ray (AP View)",
        dataset: "NIH ChestX-ray14 / CheXNet",
        currentScan: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
        baselineScan: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80",
        slicesCount: 1,
        findings: "Right middle pulmonary zone alveolar airspace consolidation.",
        aiDetections: [
          { label: "Consolidation (Pneumonia)", confidence: 94.2, status: "Positive Finding", severity: "High" },
          { label: "Pleural Effusion", confidence: 3.8, status: "Negative / Normal", severity: "None" },
          { label: "Pneumothorax", confidence: 1.2, status: "Negative / Normal", severity: "None" },
          { label: "Cardiomegaly", confidence: 12.4, status: "Borderline CTR 0.46", severity: "Low" }
        ],
        roi: {
          id: "ROI-01",
          label: "R Mid-Zone Infiltrate",
          confidence: 94.2,
          top: 42,
          left: 48,
          width: 32,
          height: 26,
          span: "3.4 cm"
        }
      },
      {
        id: "mod-ct",
        name: "Thorax HRCT Series",
        dataset: "LIDC-IDRI / DeepLung CT",
        currentScan: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
        baselineScan: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
        slicesCount: 42,
        findings: "Patchy ground-glass attenuation with bronchial wall thickening in right middle lobe.",
        aiDetections: [
          { label: "Ground Glass Opacity", confidence: 91.8, status: "Positive Finding", severity: "Moderate" },
          { label: "Mediastinal Lymphadenopathy", confidence: 24.5, status: "Sub-centimeter", severity: "Low" },
          { label: "Pulmonary Embolism", confidence: 4.1, status: "Negative (Normal D-Dimer)", severity: "None" }
        ],
        roi: {
          id: "ROI-CT-02",
          label: "Right Bronchovascular Bundle",
          confidence: 91.8,
          top: 38,
          left: 45,
          width: 28,
          height: 30,
          span: "2.8 cm"
        }
      },
      {
        id: "mod-mri",
        name: "Whole Body MRI Screening",
        dataset: "BraTS & Spine-Seg Multi-sequence",
        currentScan: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80",
        baselineScan: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
        slicesCount: 24,
        findings: "No metastatic skeletal dissemination. Vertebral marrow signal preserved.",
        aiDetections: [
          { label: "Osseous Lesions", confidence: 2.3, status: "Normal Bone Marrow", severity: "None" },
          { label: "Soft Tissue Inflammation", confidence: 34.0, status: "Localized Thoracic", severity: "Mild" }
        ],
        roi: {
          id: "ROI-MRI-03",
          label: "Thoracic Paravertebral Bed",
          confidence: 88.0,
          top: 35,
          left: 40,
          width: 25,
          height: 25,
          span: "2.1 cm"
        }
      }
    ],
    imaging: {
      modality: "Chest X-Ray AP View (DICOM)",
      capturedAt: "10:45 AM Today",
      scanCenter: "Apex Advanced Imaging, New Delhi",
      imageSrc: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
      baselineSrc: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80",
      roi: {
        id: "ROI-01",
        label: "R Mid-Zone Infiltrate",
        confidence: 94.2,
        top: 42,
        left: 48,
        width: 32,
        height: 26,
        description: "Cloudy airspace consolidation in right middle lobe parenchyma with subtle air bronchograms."
      },
      impression: "Patchy ground-glass opacity noted predominantly in right middle lobe with subtle bronchial wall thickening. No pleural effusion. Heart size within normal limits."
    },
    labs: [
      { parameter: "Hemoglobin (Hb)", value: "11.2", unit: "g/dL", ref: "13.5 - 17.5", status: "Low", category: "Hematology", interpretation: "Mild normocytic anemia, secondary to chronic diabetes or acute inflammation." },
      { parameter: "Total Leukocyte Count (WBC)", value: "14,800", unit: "/uL", ref: "4,000 - 11,000", status: "High", category: "Hematology", interpretation: "Marked neutrophilic leukocytosis confirms acute bacterial cascade." },
      { parameter: "Serum Creatinine", value: "1.4", unit: "mg/dL", ref: "0.7 - 1.2", status: "Borderline High", category: "Biochemistry", interpretation: "Borderline elevation; eGFR ~58 mL/min warrants contrast nephropathy caution." },
      { parameter: "C-Reactive Protein (CRP)", value: "48.0", unit: "mg/L", ref: "< 5.0", status: "Markedly High", category: "Inflammation", interpretation: "Acute phase reactant elevated 9.6x; correlates with lobar consolidation." },
      { parameter: "D-Dimer (FEU)", value: "0.42", unit: "ug/mL", ref: "< 0.50", status: "Normal", category: "Coagulation", interpretation: "Normal value provides strong negative predictive power against pulmonary embolism." },
      { parameter: "Fasting Blood Sugar", value: "142", unit: "mg/dL", ref: "70 - 100", status: "Elevated", category: "Metabolic", interpretation: "Moderate diabetic dysglycemia under systemic acute stress." },
      { parameter: "Platelet Count", value: "2.40", unit: "Lakhs/uL", ref: "1.50 - 4.50", status: "Normal", category: "Hematology", interpretation: "Completely healthy bone marrow megakaryocytic reserve." }
    ],
    differentials: [
      { name: "Community Acquired Pneumonia (CAP)", probability: 84, status: "Primary Candidate", guideline: "IDSA/ATS 2019 Practice Protocol - Right middle lobe bacterial focus" },
      { name: "Atypical Viral Pneumonitis", probability: 46, status: "Alternative", guideline: "Subtle GGO on CT; disfavored by elevated pro-inflammatory WBC" },
      { name: "Pulmonary Thromboembolism (PE)", probability: 4, status: "Ruled Out", guideline: "D-Dimer 0.42 ug/mL normal; Wells Score < 2 (Low Probability)" }
    ],
    clinicalCorrelation: [
      {
        day: "Day -4",
        symptom: "Malaise, mild dry cough",
        temp: "99.4°F",
        crp: "8.2 mg/L",
        wbc: "8,200 /uL",
        medication: "Self-medicated with ginger tea & paracetamol",
        imaging: "No scan performed",
        status: "Prodromal Phase"
      },
      {
        day: "Day -2",
        symptom: "Fever peak (102.1°F), chills, rust-colored sputum",
        temp: "102.1°F",
        crp: "28.5 mg/L",
        wbc: "12,400 /uL",
        medication: "Started Azithromycin 500mg OD via outpatient clinic",
        imaging: "Prescribed HRCT Thorax",
        status: "Acute Exacerbation"
      },
      {
        day: "Day -1",
        symptom: "Progressive dyspnea on exertion, right pleuritic chest discomfort",
        temp: "100.2°F",
        crp: "42.0 mg/L",
        wbc: "14,200 /uL",
        medication: "Metformin 1000mg BD continued (Unsafe with planned IV contrast)",
        imaging: "Scan center visit scheduled",
        status: "Systemic Inflammatory Trigger"
      },
      {
        day: "Today",
        symptom: "Tachypnea (RR 22/min), fever subsided to 98.4°F, persistent cough",
        temp: "98.4°F",
        crp: "48.0 mg/L",
        wbc: "14,800 /uL",
        medication: "AI Drug Safety Alert triggered: Metformin withheld for contrast; Penicillin contraindication locked",
        imaging: "Chest X-Ray AP View shows 3.4cm R Mid-Zone Consolidation (ROI-01)",
        status: "Attending Decision Phase (CAP Confirmed)"
      }
    ],
    knowledgeGraph: {
      nodes: [
        { id: "patient", label: "Rajesh Kumar (54M)", type: "patient", color: "#214B4C" },
        { id: "symp_fever", label: "Acute Fever (102.1°F)", type: "symptom", color: "#BA1A1A" },
        { id: "symp_cough", label: "Productive Sputum Cough", type: "symptom", color: "#BA1A1A" },
        { id: "symp_dyspnea", label: "Exertional Dyspnea", type: "symptom", color: "#BA1A1A" },
        { id: "lab_wbc", label: "Leukocytosis (14.8k WBC)", type: "biomarker", color: "#7C6A96" },
        { id: "lab_crp", label: "Elevated CRP (48 mg/L)", type: "biomarker", color: "#7C6A96" },
        { id: "lab_creat", label: "Creatinine 1.4 mg/dL", type: "biomarker", color: "#7C6A96" },
        { id: "anat_rml", label: "Right Middle Lobe", type: "anatomy", color: "#536251" },
        { id: "diag_cap", label: "Community Acquired Pneumonia", type: "diagnosis", color: "#214B4C" },
        { id: "pathogen", label: "Streptococcus pneumoniae", type: "pathogen", color: "#BA1A1A" },
        { id: "contra_pen", label: "Penicillin Anaphylaxis", type: "contraindication", color: "#BA1A1A" },
        { id: "contra_met", label: "Metformin + Contrast CIN", type: "contraindication", color: "#BA1A1A" },
        { id: "rx_azith", label: "Azithromycin 500mg", type: "medication", color: "#536251" },
        { id: "rx_levo", label: "Levofloxacin 750mg (Safe Alt)", type: "medication", color: "#536251" }
      ],
      edges: [
        { from: "patient", to: "symp_fever", rel: "presents with" },
        { from: "patient", to: "symp_cough", rel: "presents with" },
        { from: "patient", to: "symp_dyspnea", rel: "develops" },
        { from: "patient", to: "contra_pen", rel: "has documented allergy" },
        { from: "patient", to: "contra_met", rel: "carries risk on contrast" },
        { from: "symp_fever", to: "lab_crp", rel: "correlates with" },
        { from: "symp_cough", to: "lab_wbc", rel: "triggers" },
        { from: "lab_wbc", to: "diag_cap", rel: "confirms bacterial cascade" },
        { from: "lab_crp", to: "diag_cap", rel: "supports active inflammation" },
        { from: "anat_rml", to: "diag_cap", rel: "anatomical site of" },
        { from: "diag_cap", to: "pathogen", rel: "likely etiology" },
        { from: "contra_pen", to: "rx_levo", rel: "diverts treatment to" },
        { from: "diag_cap", to: "rx_azith", rel: "partially treated by" }
      ]
    },
    ragDocuments: [
      {
        id: "rag-1",
        title: "IDSA/ATS Practice Guidelines for Community-Acquired Pneumonia (2019)",
        source: "Am J Respir Crit Care Med 2019; 200:e45-e67",
        doi: "10.1164/rccm.201908-1581ST",
        relevanceScore: 0.96,
        snippet: "In patients with acute focal consolidation on chest imaging accompanied by systemic inflammation (fever, leukocytosis, elevated CRP > 40 mg/L), empiric antimicrobial therapy should target S. pneumoniae, H. influenzae, and atypical pathogens. In patients with severe beta-lactam allergies, respiratory fluoroquinolones (Levofloxacin 750mg) or advanced macrolides (Azithromycin 500mg) are established first-line options."
      },
      {
        id: "rag-2",
        title: "ICMR National Guidelines for Antimicrobial Use in Respiratory Infections (2022)",
        source: "Indian Council of Medical Research (ICMR) Evidence Compendium §4.3",
        doi: "ICMR-AMR-RESP-2022-09",
        relevanceScore: 0.93,
        snippet: "For adult Indian patients presenting with CAP in community settings, macrolide monotherapy or combination therapy is recommended depending on CURB-65 / CRB-65 triage score. Cephalosporin monotherapy must strictly be avoided in individuals with documented Type-1 anaphylactic Penicillin sensitivity due to 8-10% cross-reactivity."
      },
      {
        id: "rag-3",
        title: "Contrast-Induced Nephropathy (CIN) & Metformin Safety Directive (CDSCO 2023)",
        source: "Central Drugs Standard Control Organisation (CDSCO) Safety Alert #481",
        doi: "CDSCO-DDI-NEPH-2023",
        relevanceScore: 0.94,
        snippet: "Patients receiving biguanides (Metformin) with Serum Creatinine >= 1.4 mg/dL or eGFR < 60 mL/min/1.73m² face elevated hazard of lactic acidosis and acute renal shutdown when administered intravascular iodinated contrast. Metformin must be withheld 48 hours prior to the procedure and resumed only after re-assessing normal renal function."
      },
      {
        id: "rag-4",
        title: "Fleischner Society Recommendations for Thoracic Ground-Glass Opacities",
        source: "Radiology 2017; 284(1):228-243",
        doi: "10.1148/radiol.2017161659",
        relevanceScore: 0.88,
        snippet: "Patchy ground-glass attenuation within a single lobar distribution in the setting of acute fever and productive cough represents infectious alveolar consolidation rather than neoplasm. Repeat radiograph or low-dose CT in 6-8 weeks is recommended if symptoms fail to resolve after antibiotic course."
      }
    ],
    drugAlerts: [
      {
        id: "alert-1",
        title: "Nephrotoxicity & Lactic Acidosis Synergy",
        severity: "Level 1 Critical",
        medicines: "Metformin (1000mg BD) + Prescribed IV Contrast (Omnipaque 350)",
        description: "Patient Serum Creatinine is elevated (1.4 mg/dL). High risk of Contrast-Induced Nephropathy (CIN) and severe lactic acidosis.",
        recommendation: "Withhold Metformin 48 hours prior to contrast administration. Initiate 0.9% Normal Saline pre-hydration protocol at 100 mL/hr."
      },
      {
        id: "alert-2",
        title: "Severe Anaphylaxis Beta-Lactam Contraindication",
        severity: "Level 1 Critical",
        medicines: "Ceftriaxone IV + Documented Penicillin Allergy",
        description: "Patient has documented Type-1 IgE-mediated anaphylactic reaction to Penicillins. Up to 10% cross-reactivity with 3rd-generation cephalosporins.",
        recommendation: "Switch empirical regimen to Levofloxacin 750mg IV OD or Azithromycin 500mg IV OD plus Vancomycin if MRSA risk present."
      }
    ],
    xaiSteps: [
      { step: 1, title: "Clinical Presentation", detail: "Fever (peak 102.1°F Day -2, current 98.4°F) + tachypnea and productive rusty cough." },
      { step: 2, title: "Systemic Biomarkers", detail: "Marked leukocytosis (14,800/uL) + CRP 48 mg/L confirms active acute bacterial inflammation cascade." },
      { step: 3, title: "Radiological Concurrence", detail: "Segmental alveolar airspace consolidation in R mid zone aligns with lobar bacterial pathology." },
      { step: 4, title: "Ensemble Synthesis", detail: "94% Concordance: Bacterial Community Acquired Pneumonia (CAP). Penicillin/Cephalosporin contra-indicated due to allergy." }
    ],
    timeline: [
      {
        id: "rec-1",
        title: "Chest Radiograph & Thorax Report",
        type: "Radiology",
        date: "Today, 10:45 AM",
        source: "Apex Advanced Imaging • DICOM Web",
        fileSize: "42.1 MB (DICOM)",
        status: "Parsed by AI · Attending Review Complete",
        summary: "Mild right mid-zone opacity detected, confirmed by Dr. Ananya Sharma.",
        hash: "SHA256:88a3b7...9ef1c4",
        metrics: { confidence: "96.8%" }
      },
      {
        id: "rec-2",
        title: "Complete Blood Count & Metabolic Profile",
        type: "Lab Reports",
        date: "Yesterday, 04:30 PM",
        source: "Dr. Lal PathLabs Reference Central",
        fileSize: "1.8 MB (PDF)",
        status: "Doctor Signed & Verified",
        summary: "Elevated WBC (14,800/uL), Hb 11.2 g/dL, normal platelet count (2.4L/uL), Fasting Glucose 142 mg/dL.",
        hash: "SHA256:12e74a...83d2bf",
        metrics: { wbc: "14,800 ▲", platelets: "240k", hba1c: "6.8%" }
      },
      {
        id: "rec-3",
        title: "Outpatient Prescription - Pulmonology",
        type: "Prescriptions",
        date: "3 days ago",
        source: "Apollo Specialty Clinic • Dr. Ananya Sharma (MCI-48192)",
        fileSize: "840 KB (JPEG)",
        status: "Active Course",
        summary: "Prescribed Azithromycin 500mg OD x 5d, Montelukast-Levocetirizine bedtime, Steam Inhalation BID.",
        hash: "SHA256:49c01d...f721ea"
      },
      {
        id: "rec-4",
        title: "Annual Cardiac ECG & Lipid Profile",
        type: "Discharge Summaries",
        date: "14 Nov 2024",
        source: "Fortis Escorts Heart Institute",
        fileSize: "3.2 MB (PDF)",
        status: "Archived Baseline",
        summary: "Normal sinus rhythm at 72 bpm. PR interval 142ms. Normal electrical axis. Serum Cholesterol: 182 mg/dL.",
        hash: "SHA256:91b00e...23ac78"
      }
    ]
  },
  {
    id: "pat-2",
    name: "Priya Nair",
    age: 38,
    gender: "Female",
    bloodGroup: "O+",
    abhaId: "24-9918-0012-7712",
    abhaAddress: "priya.nair@sbx",
    phone: "+91 98112 34567",
    avatar: "PN",
    priority: "Ready · Post-Operative Review",
    assignedDoctor: "Dr. Ananya Sharma, MD",
    doctorMci: "DMC-49102-DL",
    vitals: {
      bp: "122/78 mmHg",
      spo2: "99%",
      heartRate: "72 bpm",
      temp: "98.2°F",
      respiratoryRate: "16 /min"
    },
    allergies: ["Sulfa Drugs"],
    activeMedications: [
      { id: "med-pn1", name: "Pregabalin", dosage: "75mg HS", indication: "Neuropathic Radicular Pain", startDate: "2024-10-01", scheduleSlot: "Night at Bedtime", instructions: "For nerve recovery", takenToday: true },
      { id: "med-pn2", name: "Paracetamol", dosage: "650mg SOS", indication: "Post-op Lumbar Discectomy Pain", startDate: "2024-11-05", scheduleSlot: "As Needed (Max 3/day)", instructions: "Take with water after meals", takenToday: false }
    ],
    riskScore: 28,
    riskBreakdown: {
      respiratoryCompromise: 12,
      renalStress: 18,
      sepsisRisk: 10
    },
    imagingModalities: [
      {
        id: "mod-mri-pn",
        name: "MRI Lumbar Spine L4-L5 (Post-op)",
        dataset: "BraTS & Spine-Seg Multi-sequence",
        currentScan: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
        baselineScan: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
        slicesCount: 28,
        findings: "Resolved thecal sac impingement at L4-L5.",
        aiDetections: [
          { label: "Decompression Bed", confidence: 96.1, status: "Normal Post-op", severity: "None" },
          { label: "Disc Re-herniation", confidence: 2.1, status: "Negative", severity: "None" }
        ],
        roi: {
          id: "ROI-02",
          label: "L4-L5 Decompression Bed",
          confidence: 96.1,
          top: 38,
          left: 44,
          width: 28,
          height: 24,
          span: "2.4 cm"
        }
      }
    ],
    imaging: {
      modality: "MRI Lumbar Spine L4-L5 (Post-op)",
      capturedAt: "08:15 AM Yesterday",
      scanCenter: "AIIMS Neuro-Radiology Center",
      imageSrc: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
      baselineSrc: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
      roi: {
        id: "ROI-02",
        label: "L4-L5 Decompression Bed",
        confidence: 96.1,
        top: 38,
        left: 44,
        width: 28,
        height: 24,
        description: "Satisfactory post-laminotomy status, no epidural hematoma or disc re-herniation."
      },
      impression: "Postoperative changes at L4-L5 level with resolved thecal sac impingement. Neural foramina are patent bilaterally."
    },
    labs: [
      { parameter: "Hemoglobin (Hb)", value: "13.8", unit: "g/dL", ref: "12.0 - 15.5", status: "Normal", category: "Hematology", interpretation: "Healthy oxygen capacity." },
      { parameter: "Total Leukocyte Count (WBC)", value: "6,400", unit: "/uL", ref: "4,000 - 11,000", status: "Normal", category: "Hematology", interpretation: "No signs of post-operative infection." },
      { parameter: "Serum Creatinine", value: "0.8", unit: "mg/dL", ref: "0.6 - 1.1", status: "Normal", category: "Biochemistry", interpretation: "Optimal renal filtration reserve." },
      { parameter: "C-Reactive Protein (CRP)", value: "2.1", unit: "mg/L", ref: "< 5.0", status: "Normal", category: "Inflammation", interpretation: "Low basal inflammatory state." }
    ],
    differentials: [
      { name: "Uncomplicated Post-Discectomy Convalescence", probability: 95, status: "Primary Candidate", guideline: "Normal inflammatory trajectory, no signs of discitis" }
    ],
    drugAlerts: [],
    xaiSteps: [
      { step: 1, title: "Clinical Presentation", detail: "Day 6 post L4-L5 microdiscectomy, surgical site dry, ambulating with minimal support." },
      { step: 2, title: "Systemic Biomarkers", detail: "WBC 6,400/uL and CRP 2.1 mg/L rule out early surgical site infection." },
      { step: 3, title: "Neuro-Radiological Scan", detail: "Satisfactory decompression confirmed on post-op MRI series." }
    ],
    timeline: [
      {
        id: "rec-p1",
        title: "MRI Lumbar Spine High-Field Protocol",
        type: "Radiology",
        date: "Yesterday, 08:15 AM",
        source: "AIIMS Delhi • Neuro-Imaging",
        fileSize: "68.4 MB (DICOM)",
        status: "Doctor Signed",
        summary: "Normal post-surgical alignment, patent canal.",
        hash: "SHA256:77f12a...bb9901"
      }
    ]
  },
  {
    id: "pat-3",
    name: "Amitav Sen",
    age: 67,
    gender: "Male",
    bloodGroup: "A+",
    abhaId: "14-8832-7711-2099",
    abhaAddress: "amitav.sen@sbx",
    phone: "+91 97123 45678",
    avatar: "AS",
    priority: "Ingesting · PET-CT Restaging Protocol",
    assignedDoctor: "Dr. Ananya Sharma, MD",
    doctorMci: "DMC-49102-DL",
    vitals: {
      bp: "144/92 mmHg",
      spo2: "95%",
      heartRate: "82 bpm",
      temp: "99.1°F",
      respiratoryRate: "20 /min"
    },
    allergies: ["Iodinated Radiocontrast (Mild Urticaria)"],
    activeMedications: [
      { id: "med-as1", name: "Amlodipine", dosage: "5mg OD", indication: "Hypertension", startDate: "2022-01-15", scheduleSlot: "Morning after Breakfast", instructions: "Daily blood pressure care", takenToday: true }
    ],
    riskScore: 62,
    riskBreakdown: {
      respiratoryCompromise: 44,
      renalStress: 52,
      sepsisRisk: 28
    },
    imagingModalities: [
      {
        id: "mod-pet-as",
        name: "Whole Body 18F-FDG PET-CT",
        dataset: "PET-CT Oncology Protocol",
        currentScan: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80",
        baselineScan: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
        slicesCount: 64,
        findings: "Sub-centimeter subcarinal node showing borderline metabolic activity (SUVmax 3.8).",
        aiDetections: [
          { label: "Subcarinal Node SUVmax 3.8", confidence: 88.5, status: "Borderline Reactive", severity: "Moderate" },
          { label: "Distant Organ Metastasis", confidence: 3.2, status: "Negative", severity: "None" }
        ],
        roi: {
          id: "ROI-03",
          label: "Subcarinal Lymph Node",
          confidence: 88.5,
          top: 45,
          left: 50,
          width: 22,
          height: 22,
          span: "1.2 cm"
        }
      }
    ],
    imaging: {
      modality: "Whole Body 18F-FDG PET-CT",
      capturedAt: "07:30 AM Today",
      scanCenter: "Fortis Escorts Nuclear Medicine",
      imageSrc: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80",
      baselineSrc: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
      roi: {
        id: "ROI-03",
        label: "Subcarinal Lymph Node",
        confidence: 88.5,
        top: 45,
        left: 50,
        width: 22,
        height: 22,
        description: "Mild hypermetabolic focus (SUVmax 3.8) in subcarinal lymphatic chain."
      },
      impression: "Sub-centimeter subcarinal node showing borderline metabolic activity; suggest 3-month surveillance or EBUS fine-needle sampling."
    },
    labs: [
      { parameter: "Hemoglobin (Hb)", value: "12.4", unit: "g/dL", ref: "13.5 - 17.5", status: "Slightly Low", category: "Hematology", interpretation: "Borderline low hemoglobin." },
      { parameter: "Total Leukocyte Count (WBC)", value: "7,800", unit: "/uL", ref: "4,000 - 11,000", status: "Normal", category: "Hematology", interpretation: "Within standard limits." },
      { parameter: "Serum Creatinine", value: "1.3", unit: "mg/dL", ref: "0.7 - 1.2", status: "Borderline", category: "Biochemistry", interpretation: "Mild age-related reduction in filtration." }
    ],
    differentials: [
      { name: "Reactive Inflammatory Lymphadenopathy", probability: 64, status: "Primary Candidate", guideline: "Low SUVmax (3.8) favors granulomatous or reactive etiology" },
      { name: "Metastatic Restaging Nodal Involvement", probability: 36, status: "Under Investigation", guideline: "Histopathological tissue diagnosis advised prior to chemo protocol modification" }
    ],
    drugAlerts: [],
    xaiSteps: [
      { step: 1, title: "FDG Uptake Quantification", detail: "Subcarinal node SUVmax 3.8 below threshold for aggressive neoplastic progression." },
      { step: 2, title: "Prior Scan Comparison", detail: "Dimensional increase < 2mm over 6-month interval, stability favors indolent/reactive status." }
    ],
    timeline: [
      {
        id: "rec-a1",
        title: "Whole Body 18F-FDG PET-CT Series",
        type: "Radiology",
        date: "Today, 07:30 AM",
        source: "Fortis Escorts Nuclear Medicine Suite",
        fileSize: "112.4 MB (DICOM)",
        status: "AI Ingestion In-Progress",
        summary: "Automated volumetric reconstruction and SUV calculation complete.",
        hash: "SHA256:39fa10...902a11"
      }
    ]
  }
];

export const initialAuditLogs = [
  {
    id: "LOG-9942",
    timestamp: "14:22:04 IST",
    doctorName: "Dr. Ananya Sharma",
    doctorMci: "DMC-49102 · Radiologist",
    patientName: "Rajesh K. (54M)",
    abhaId: "91-4829-1092-4819",
    reason: "Differential AI Review (Acute Dyspnea)",
    consentStatus: "ABHA OTP Verified (Active 15-min PIN)",
    compliance: "DPDP Verified · Ledger #9942",
    integrityHash: "0x89f2a71b40c6e189",
    hospitalBranch: "AIIMS New Delhi"
  },
  {
    id: "LOG-9941",
    timestamp: "14:18:51 IST",
    doctorName: "Dr. Rajiv Menon",
    doctorMci: "KMC-11029 · Intensivist",
    patientName: "Pooja Nair (32F)",
    abhaId: "24-9918-0012-7712",
    reason: "Emergency Overrule (ICU Septic Workup)",
    consentStatus: "Emergency Override Protocol §7(2)",
    compliance: "Audited & Encrypted · Ledger #9941",
    integrityHash: "0x33b8a1c900e2a441",
    hospitalBranch: "Apollo Indraprastha"
  },
  {
    id: "LOG-9940",
    timestamp: "14:05:12 IST",
    doctorName: "Dr. Ananya Sharma",
    doctorMci: "DMC-49102 · Radiologist",
    patientName: "Amitav Sen (67M)",
    abhaId: "14-8832-7711-2099",
    reason: "PET-CT Automated Nodal Segmentation",
    consentStatus: "ABHA Pre-Authorized Blanket Token",
    compliance: "DPDP Verified · Ledger #9940",
    integrityHash: "0x54e019fba82c9182",
    hospitalBranch: "Fortis Healthcare (Gurugram)"
  },
  {
    id: "LOG-9939",
    timestamp: "13:42:30 IST",
    doctorName: "Dr. Sunita Rao",
    doctorMci: "MMC-88210 · Pathologist",
    patientName: "Sunita Devi (45F)",
    abhaId: "55-2019-3301-4412",
    reason: "Histopathology OCR Lab Extraction",
    consentStatus: "Patient Biometric Consent via ABDM",
    compliance: "DPDP Verified · Ledger #9939",
    integrityHash: "0x78ab00dcf8129994",
    hospitalBranch: "Manipal Hospital (Bengaluru)"
  },
  {
    id: "LOG-9938",
    timestamp: "13:10:05 IST",
    doctorName: "Dr. Vikramaditya Roy",
    doctorMci: "AIIMS-DIR-001 · CMIO Admin",
    patientName: "System Observability Telemetry",
    abhaId: "N/A (Anonymized Model Probe)",
    reason: "Model Latency & Hallucination Audit",
    consentStatus: "System Statutory Audit Exemption",
    compliance: "CDSCO AI Safety Audit #2026-Nov",
    integrityHash: "0x1109ffab4567ac89",
    hospitalBranch: "National Health Authority Central Node"
  }
];

export const aiModelMetrics = [
  {
    name: "Vision-OCR Extractor",
    engine: "LayoutLMv3 + TrOCR Fine-Tuned",
    status: "8/8 Workers Online",
    type: "Multimodal OCR",
    precision: "97.4%",
    recall: "98.1%",
    avgLatency: "84ms",
    throughput: "42 docs/sec",
    testedDataset: "14,200 handwritten Indian prescriptions & reports"
  },
  {
    name: "Radiology Segmentation",
    engine: "DenseNet-121 + Med-SAM Enclave",
    status: "Active ResNet/ViT Tensor",
    type: "DICOM & X-Ray AI",
    diceScore: "0.89 Index",
    avgLatency: "380ms",
    throughput: "18 slices/sec",
    testedDataset: "NIH ChestX-ray14 & Indian Tertiary Care DICOMs"
  },
  {
    name: "Differential Reasoner",
    engine: "BioMistral-7B + Med-PaLM-2 Fine-Tuned",
    status: "Quantized 4-bit Engine",
    type: "Clinical XAI Reasoning",
    concordance: "99.4%",
    avgLatency: "142ms",
    perplexity: "2.18",
    hallucinations: "0 Detected in 500 test clinical dossiers"
  },
  {
    name: "DDI & Drug Safety Validator",
    engine: "CDSCO Schedule H/H1 + US-FDA Matrix",
    status: "Deterministic Rule Core",
    type: "Pharmacopeia Guard",
    rulesCoverage: "100% CDSCO",
    avgLatency: "12ms",
    throughput: "2,400 checks/sec",
    renalClearanceRules: "Cockcroft-Gault & CKD-EPI active"
  }
];

export const patientTranslations = {
  en: {
    welcome: "Welcome back",
    selfSovereign: "Self-Sovereign Health Node",
    subtitle: "Your personal health record is private, secured with Ayushman Bharat ID, and readable without complicated medical jargon.",
    greetingCheckin: "How are you feeling this morning?",
    vitalsHeadline: "Your Vitals at a Glance",
    vitalsExplain: "Everything you see below is color-coded so you know what is healthy and what needs attention.",
    dailyMedsHeadline: "Your Daily Medicine Schedule",
    dailyMedsSub: "Check off your medicine when you take it to keep your record up to date.",
    checklistHeadline: "What Should You Do Today?",
    downloadPdfBtn: "Download Patient Health Summary (PDF)",
    doctorPinBtn: "15-min Doctor Access PIN",
    aiExplainerBtn: "Explain in Plain English",
    dropzoneTitle: "Add New Lab Report or Prescription",
    dropzoneSub: "Drop any lab paper photo, X-ray scan, or PDF. We will remove your name & Aadhaar locally for privacy.",
    emergencyHelp: "Need Emergency Help? Call 24x7 Helpline +91 1800-MEDIGEN"
  },
  hi: {
    welcome: "नमस्ते और स्वागत है",
    selfSovereign: "स्व-संप्रभु स्वास्थ्य नोड (आयुष्मान भारत)",
    subtitle: "आपका स्वास्थ्य रिकॉर्ड पूरी तरह निजी है, आयुष्मान भारत आईडी से सुरक्षित है, और बिना कठिन डॉक्टरी शब्दों के आसानी से समझ आने योग्य है।",
    greetingCheckin: "आज सुबह आप कैसा महसूस कर रहे हैं?",
    vitalsHeadline: "आपके स्वास्थ्य संकेतक (वाइटल्स)",
    vitalsExplain: "नीचे दी गई सभी जानकारी रंग-कोडित है ताकि आप आसानी से जान सकें कि क्या सामान्य है और किस पर ध्यान देना है।",
    dailyMedsHeadline: "आपकी दैनिक दवाइयों का समय",
    dailyMedsSub: "दवा लेने के बाद टिक करें ताकि आपका रिकॉर्ड हमेशा अपडेट रहे।",
    checklistHeadline: "आज आपको क्या करना चाहिए?",
    downloadPdfBtn: "मेरा सरल स्वास्थ्य सारांश डाउनलोड करें (PDF)",
    doctorPinBtn: "15-मिनट डॉक्टर एक्सेस पिन",
    aiExplainerBtn: "सरल भाषा में समझें",
    dropzoneTitle: "नई लैब रिपोर्ट या पर्चा जोड़ें",
    dropzoneSub: "लैब रिपोर्ट की फोटो, एक्स-रे या पीडीएफ यहाँ डालें। आपकी गोपनीयता के लिए नाम और आधार स्थानीय रूप से हटा दिए जाएंगे।",
    emergencyHelp: "आपातकालीन सहायता चाहिए? 24x7 हेल्पलाइन पर कॉल करें: +91 1800-MEDIGEN"
  }
};
