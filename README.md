# Project MEDIGEN - Intelligent Clinical Decision Support System (CDSS)
### Haute-Clinical Diagnostic Intelligence & Patient Governance Platform

Developed for the Indian Healthcare Hackathon, **Project MEDIGEN** transforms healthcare delivery through multimodal AI-assisted diagnostics, strict DPDP Act (2023) privacy compliance, and Ayushman Bharat Digital Mission (ABDM) integration.

---

## 🌟 Key Features & Problem Statement Coverage

| Capability | Module & Implementation | Compliance / Tech Stack |
| :--- | :--- | :--- |
| **Multimodal OCR & Prescription Parsing** | `POST /api/ocr-parse` via TrOCR & LayoutLMv3 | Redacts Aadhaar & PII client-side before parsing |
| **Radiology Segmentation & Hotspot ROI** | `POST /api/segment-image` with DenseNet-121 & Med-SAM | Lung, Bone, Soft Tissue windows, DICOM HUD, Calipers |
| **Predictive Patient Risk Scoring** | `POST /api/predict-risk` assessing vitals + biomarkers | 0–100 risk score, Respiratory, Renal & Sepsis vector tiers |
| **Drug-Drug Interaction (DDI) Engine** | `POST /api/drug-interaction` against CDSCO Schedule H/H1 | Flags Metformin + Contrast CIN risk & Penicillin allergies |
| **Explainable AI (XAI) Rationale** | `POST /api/xai-explain` via BioMistral-7B ensemble | Step-by-step reasoning tree with ICMR & IDSA citations |
| **Role-Based Access Control (RBAC)** | Patient, Doctor, and Admin security isolation | Enforces DPDP Act §7(2) patient self-sovereign boundaries |
| **Ephemeral Doctor Access PIN** | 15-minute expiring cryptographic token (`492-817`) | ABDM federated consent management architecture |
| **Statutory Observability & Audit Trails** | Immutable cryptographically hashed ledger | Logs timestamp, doctor NMC Reg No., patient ABHA ID |

---

## 🎨 Haute-Clinical Design Palette
- **Canvas Base:** `#FDFBF7` (Warm Ivory Off-White) - anti-glare, comforting for clinicians
- **Deep Mineral Teal:** `#214B4C` / `#3A6364` - primary actions & decisive clinical states
- **Sage Green:** `#8A9A86` & `#536251` - stable physiological ranges & contextual validation
- **Highlights:** Soft Mint (`#D1E7DD`), Muted Lavender (`#E2D9F3`), Muted Peach (`#F8D7DA`)
- **Typography:** *Bodoni Moda* (editorial serif headlines) & *Plus Jakarta Sans* (tabular numeric data)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Launch Everything in One Click
On Windows:
```cmd
run.bat
```

On Linux / macOS:
```bash
chmod +x start.sh
./start.sh
```

### 2. Manual Development Mode
#### Backend:
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Start FastAPI server
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Telemetry: [http://localhost:8000/api/health](http://localhost:8000/api/health)

#### Frontend:
```bash
# Install node packages
npm install

# Start Vite dev server
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)

---

## 🔐 Credentials & Demo Walkthrough for Judges

Click any of the **Demo Quick-Load** buttons on the Login screen:
1. **Doctor Persona (`Dr. Ananya Sharma, MD`)**
   - NMC Reg: `DMC-49102-DL`
   - Explore the 3-column diagnostic cockpit, DICOM segmentations, DDI warnings, and approve the clinical plan.
2. **Patient Persona (`Rajesh Kumar`)**
   - ABHA ID: `91-4829-1092-4819`
   - Generate a 15-minute Doctor Access PIN, upload a medical PDF/report, and view the AI Plain-Language summary.
3. **Admin Persona (`Dr. Vikramaditya Roy`)**
   - CMIO & DPDP Compliance Lead
   - Inspect immutable audit ledgers, test model latency, and export statutory logs.

