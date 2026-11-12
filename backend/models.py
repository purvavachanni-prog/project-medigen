from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class LabItem(BaseModel):
    parameter: str
    value: str
    unit: str
    ref: str
    status: str  # Normal, Low, High, Borderline, Markedly High
    category: str

class OCRParseResponse(BaseModel):
    success: bool
    fileName: str
    fileType: str
    confidence: float
    rawText: str
    labs: List[LabItem]
    clinicalImpression: str
    prescriptions: List[Dict[str, Any]]
    anonymizationNotice: str
    latencyMs: int

class SegmentationRequest(BaseModel):
    imageId: Optional[str] = "XRAY-CHEST-01"
    modality: Optional[str] = "Chest X-Ray AP View"
    window: Optional[str] = "LUNG" # LUNG, BONE, SOFT

class BoundingBox(BaseModel):
    id: str
    label: str
    confidence: float
    top: float  # Percentage
    left: float # Percentage
    width: float # Percentage
    height: float # Percentage
    description: str

class HeatmapPoint(BaseModel):
    x: float
    y: float
    intensity: float
    radius: float

class SegmentationResponse(BaseModel):
    success: bool
    modality: str
    window: str
    primaryFinding: str
    concordance: float
    boundingBoxes: List[BoundingBox]
    heatmap: List[HeatmapPoint]
    radiologistImpression: str
    latencyMs: int

class RiskPredictionRequest(BaseModel):
    age: int
    gender: str
    vitals: Dict[str, str]
    labs: Optional[List[Dict[str, Any]]] = None
    symptoms: Optional[List[str]] = None
    chronicConditions: Optional[List[str]] = None

class RiskVector(BaseModel):
    category: str
    score: int
    severity: str
    details: str

class RiskPredictionResponse(BaseModel):
    success: bool
    overallScore: int # 0-100
    riskTier: str # Low, Moderate, High, Critical Tier 3
    mortalityTrajectory: str
    vectors: List[RiskVector]
    recommendedAction: str
    latencyMs: int

class DrugInteractionRequest(BaseModel):
    existingMedications: List[str]
    newMedication: str
    allergies: Optional[List[str]] = None
    creatinine: Optional[float] = 1.0
    egfr: Optional[float] = 85.0

class DrugAlert(BaseModel):
    id: str
    title: str
    severity: str # Level 1 Critical, Moderate, Mild
    medicines: str
    description: str
    recommendation: str
    cdscoClass: str # Schedule H, H1, G, X

class DrugInteractionResponse(BaseModel):
    success: bool
    hasInteractions: bool
    alerts: List[DrugAlert]
    clearanceStatus: str
    recommendedSubstitutes: List[str]
    latencyMs: int

class XAIExplainRequest(BaseModel):
    caseTitle: Optional[str] = "Acute Dyspnea & Pyrexia"
    primaryDiagnosis: Optional[str] = "Community Acquired Pneumonia (CAP)"
    vitals: Optional[Dict[str, str]] = None
    labs: Optional[List[Dict[str, Any]]] = None
    radiologyFinding: Optional[str] = None
    allergies: Optional[List[str]] = None

class XAINode(BaseModel):
    step: int
    title: str
    detail: str
    evidenceWeight: str
    guidelineCitation: Optional[str] = None

class XAIExplainResponse(BaseModel):
    success: bool
    primaryDiagnosis: str
    concordanceRate: float
    chainOfThought: List[XAINode]
    differentialRankings: List[Dict[str, Any]]
    regulatoryNotice: str
    latencyMs: int

