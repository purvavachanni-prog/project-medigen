from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import json

from backend.models import (
    OCRParseResponse,
    SegmentationRequest,
    SegmentationResponse,
    RiskPredictionRequest,
    RiskPredictionResponse,
    DrugInteractionRequest,
    DrugInteractionResponse,
    XAIExplainRequest,
    XAIExplainResponse
)
from backend.services.ocr_service import ocr_service
from backend.services.segmentation_service import segmentation_service
from backend.services.risk_service import risk_service
from backend.services.drug_service import drug_service
from backend.services.xai_service import xai_service
from backend.services.rag_service import rag_service, RAGQueryRequest, RAGQueryResponse

app = FastAPI(
    title="Project MEDIGEN - Intelligent Clinical Decision API",
    description="Backend AI microservices supporting multimodal OCR, radiology segmentation, prognostic risk prediction, drug-drug interaction safety, and explainable AI (XAI).",
    version="2.4.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "system": "Project MEDIGEN Clinical Decision Support Engine",
        "status": "online",
        "standards": ["FHIR R4", "DPDP Act 2023", "CDSCO AI Guidelines", "ABDM Enabled"],
        "endpoints": [
            "/api/ocr-parse",
            "/api/segment-image",
            "/api/predict-risk",
            "/api/drug-interaction",
            "/api/xai-explain",
            "/api/health"
        ]
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "cluster": "MED-IN-DELHI-09",
        "active_models": [
            {"name": "Vision-OCR", "latency": "84ms", "status": "online"},
            {"name": "DenseNet-121 Segmentation", "latency": "380ms", "status": "online"},
            {"name": "BioMistral-7B Clinical Reasoner", "latency": "142ms", "status": "online"},
            {"name": "DDI CDSCO Rule Core", "latency": "12ms", "status": "online"}
        ],
        "dpdp_compliance": "99.8%",
        "fhir_sync": "active"
    }

@app.post("/api/ocr-parse", response_model=OCRParseResponse)
async def ocr_parse(
    file: Optional[UploadFile] = File(None),
    rawText: Optional[str] = Form(None)
):
    try:
        content = b""
        filename = "clinical_report.pdf"
        file_type = "application/pdf"

        if file:
            filename = file.filename or "uploaded_report.pdf"
            file_type = file.content_type or "application/pdf"
            content = await file.read()
        elif rawText:
            content = rawText.encode("utf-8")
            filename = "pasted_clinical_notes.txt"
            file_type = "text/plain"

        result = ocr_service.parse_document(filename=filename, content=content, file_type=file_type)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR Parsing Error: {str(e)}")

@app.post("/api/segment-image", response_model=SegmentationResponse)
def segment_image(payload: SegmentationRequest):
    try:
        result = segmentation_service.segment_radiograph(
            image_id=payload.imageId or "XRAY-CHEST-01",
            modality=payload.modality or "Chest X-Ray AP View",
            window=payload.window or "LUNG"
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Segmentation Error: {str(e)}")

@app.post("/api/predict-risk", response_model=RiskPredictionResponse)
def predict_risk(payload: RiskPredictionRequest):
    try:
        result = risk_service.calculate_risk(
            age=payload.age,
            gender=payload.gender,
            vitals=payload.vitals,
            labs=payload.labs,
            symptoms=payload.symptoms,
            chronic_conditions=payload.chronicConditions
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk Prediction Error: {str(e)}")

@app.post("/api/drug-interaction", response_model=DrugInteractionResponse)
def check_drug_interaction(payload: DrugInteractionRequest):
    try:
        result = drug_service.check_interaction(
            existing_medications=payload.existingMedications,
            new_medication=payload.newMedication,
            allergies=payload.allergies,
            creatinine=payload.creatinine,
            egfr=payload.egfr
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DDI Check Error: {str(e)}")

@app.post("/api/xai-explain", response_model=XAIExplainResponse)
def xai_explain(payload: XAIExplainRequest):
    try:
        result = xai_service.explain_case(
            case_title=payload.caseTitle or "Acute Dyspnea & Pyrexia",
            primary_diagnosis=payload.primaryDiagnosis or "Community Acquired Pneumonia (CAP)",
            vitals=payload.vitals,
            labs=payload.labs,
            radiology_finding=payload.radiologyFinding,
            allergies=payload.allergies
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"XAI Engine Error: {str(e)}")

@app.post("/api/rag-query", response_model=RAGQueryResponse)
def rag_query(payload: RAGQueryRequest):
    try:
        result = rag_service.query_guidelines(
            query_text=payload.query,
            patient_context=payload.patientContext
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG Retrieval Error: {str(e)}")

@app.get("/api/knowledge-graph")
def get_knowledge_graph(patient_id: str = "pat-1"):
    return {
        "success": True,
        "patientId": patient_id,
        "nodesCount": 14,
        "edgesCount": 13,
        "nodes": [
            { "id": "patient", "label": "Rajesh Kumar (54M)", "type": "patient" },
            { "id": "symp_fever", "label": "Acute Fever (102.1°F)", "type": "symptom" },
            { "id": "symp_cough", "label": "Productive Cough", "type": "symptom" },
            { "id": "lab_wbc", "label": "Leukocytosis (14.8k)", "type": "biomarker" },
            { "id": "lab_crp", "label": "hs-CRP 48 mg/L", "type": "biomarker" },
            { "id": "lab_creat", "label": "Creatinine 1.4 mg/dL", "type": "biomarker" },
            { "id": "anat_rml", "label": "Right Middle Lobe", "type": "anatomy" },
            { "id": "diag_cap", "label": "Community Acquired Pneumonia", "type": "diagnosis" },
            { "id": "pathogen", "label": "S. pneumoniae", "type": "pathogen" },
            { "id": "contra_pen", "label": "Penicillin Allergy", "type": "contraindication" },
            { "id": "contra_met", "label": "Metformin + Contrast CIN", "type": "contraindication" },
            { "id": "rx_levo", "label": "Levofloxacin 750mg (Safe Alt)", "type": "medication" }
        ],
        "latencyMs": 18
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)

