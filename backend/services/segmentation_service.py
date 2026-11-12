import time
from typing import List
from backend.models import SegmentationResponse, BoundingBox, HeatmapPoint

class SegmentationService:
    def segment_radiograph(self, image_id: str = "XRAY-CHEST-01", modality: str = "Chest X-Ray AP View", window: str = "LUNG") -> SegmentationResponse:
        start_time = time.time()
        
        # DenseNet-121 + Med-SAM simulation returning precise pulmonary segmentations
        if "bone" in window.lower():
            boxes = [
                BoundingBox(
                    id="ROI-BONE-01",
                    label="Right 5th-6th Rib Architecture",
                    confidence=91.4,
                    top=34.0,
                    left=40.0,
                    width=24.0,
                    height=18.0,
                    description="No cortical disruption, osteolytic lesions, or acute fracture lines identified."
                )
            ]
            heatmap = [
                HeatmapPoint(x=45.0, y=38.0, intensity=0.65, radius=30.0),
                HeatmapPoint(x=52.0, y=42.0, intensity=0.55, radius=25.0)
            ]
            finding = "Thoracic bony cage intact. Costovertebral junctions preserved."
        elif "soft" in window.lower():
            boxes = [
                BoundingBox(
                    id="ROI-SOFT-01",
                    label="Mediastinal Silhouette & Trachea",
                    confidence=95.0,
                    top=28.0,
                    left=42.0,
                    width=22.0,
                    height=35.0,
                    description="Trachea central. Cardiothoracic ratio within normal physiological limits (0.46)."
                )
            ]
            heatmap = [
                HeatmapPoint(x=48.0, y=46.0, intensity=0.72, radius=40.0)
            ]
            finding = "Normal cardiac silhouette; no signs of pericardial effusion or mediastinal widening."
        else:
            # Default: LUNG window with primary consolidate
            boxes = [
                BoundingBox(
                    id="ROI-01",
                    label="R Mid-Zone Infiltrate",
                    confidence=94.2,
                    top=42.0,
                    left=48.0,
                    width=32.0,
                    height=26.0,
                    description="Patchy alveolar airspace consolidation in right middle pulmonary zone with subtle air bronchograms."
                ),
                BoundingBox(
                    id="ROI-02",
                    label="Perihilar Bronchovascular Marking",
                    confidence=86.7,
                    top=36.0,
                    left=38.0,
                    width=20.0,
                    height=22.0,
                    description="Mild bilateral peribronchial thickening without distinct nodularity."
                )
            ]
            heatmap = [
                HeatmapPoint(x=58.0, y=52.0, intensity=0.94, radius=45.0),
                HeatmapPoint(x=62.0, y=55.0, intensity=0.88, radius=35.0),
                HeatmapPoint(x=46.0, y=44.0, intensity=0.62, radius=28.0)
            ]
            finding = "Right mid-zone alveolar consolidation consistent with acute Community Acquired Pneumonia (CAP)."

        latency = int((time.time() - start_time) * 1000) + 115

        return SegmentationResponse(
            success=True,
            modality=modality,
            window=window.upper(),
            primaryFinding=finding,
            concordance=99.1,
            boundingBoxes=boxes,
            heatmap=heatmap,
            radiologistImpression="Patchy ground glass opacity noted predominantly in the right middle lobe with subtle bronchial wall thickening. No pleural effusion. Heart size within normal limits.",
            latencyMs=latency
        )

segmentation_service = SegmentationService()

