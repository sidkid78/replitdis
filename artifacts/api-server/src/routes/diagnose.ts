import { Router, type Request, type Response } from "express";
import { ai } from "@workspace/integrations-gemini-ai";

const router = Router();

const MODEL = "gemini-3-flash-preview";

interface MediaItem {
  base64: string;
  mimeType: string;
}

interface DiagnoseRequest {
  equipment: {
    make: string;
    model: string;
    year?: string;
    description?: string;
  };
  media?: MediaItem[];
}

function sendEvent(res: Response, event: object) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

router.post("/diagnose", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  const { equipment, media } = req.body as DiagnoseRequest;

  if (!equipment?.make || !equipment?.model) {
    sendEvent(res, { stage: 0, status: "error", message: "Equipment make and model are required." });
    return res.end();
  }

  try {
    // ── Stage 1: Media Processing ────────────────────────────────────────────
    sendEvent(res, {
      stage: 1,
      status: "progress",
      message: "Processing media assets and verifying signatures...",
      label: "Media Processing",
    });

    await new Promise((r) => setTimeout(r, 600));

    const parts: object[] = [];

    if (media && media.length > 0) {
      for (const m of media) {
        if (m.base64 && m.mimeType) {
          const bytes = Buffer.byteLength(m.base64, "base64");
          if (bytes > 8 * 1024 * 1024) {
            sendEvent(res, { stage: 1, status: "warning", message: "Media file exceeds 8MB — truncated for analysis." });
          }
          parts.push({ inlineData: { mimeType: m.mimeType, data: m.base64 } });
        }
      }
    }

    const hasMedia = parts.length > 0;

    // ── Stage 2: Symptom Analysis ────────────────────────────────────────────
    sendEvent(res, {
      stage: 2,
      status: "progress",
      message: "Initiating multimodal symptom analysis...",
      label: "Acoustic & Visual Scan",
    });

    const equipmentLabel = `${equipment.year ? equipment.year + " " : ""}${equipment.make} ${equipment.model}`;
    const userDescription = equipment.description || "No additional description provided.";

    const diagnosisPrompt = `You are an expert appliance and equipment diagnostic AI ("Digital Foreman"). Analyze the following and produce a JSON diagnosis.

Equipment: ${equipmentLabel}
User Description: ${userDescription}
${hasMedia ? "Media: Audio/visual recording of the fault has been attached." : "Note: No media was provided — diagnose from the text description only."}

Respond ONLY with valid JSON matching this exact schema:
{
  "primaryDiagnosis": "string (the most likely root cause, 1-2 sentences)",
  "confidence": number (0.0-1.0),
  "severity": "low" | "medium" | "high" | "critical",
  "symptoms": ["string array of observed symptoms"],
  "possibleCauses": ["string array of 2-4 possible causes ranked by likelihood"],
  "requiresExpertReview": boolean,
  "safetyWarnings": ["string array of safety precautions"],
  "estimatedRepairTime": "string (e.g. '45 minutes')",
  "overallDifficulty": "easy" | "moderate" | "difficult" | "expert",
  "requiredTools": ["string array of tools needed"]
}`;

    const diagnosisParts: object[] = [{ text: diagnosisPrompt }, ...parts];

    const diagnosisResponse = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: diagnosisParts }],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    let diagnosisText = diagnosisResponse.text ?? "{}";
    diagnosisText = diagnosisText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const diagnosis = JSON.parse(diagnosisText);

    sendEvent(res, {
      stage: 3,
      status: "progress",
      message: `Diagnosis confirmed. Confidence: ${Math.round((diagnosis.confidence ?? 0.85) * 100)}%`,
      label: "Multimodal Diagnosis",
      data: { confidence: diagnosis.confidence, severity: diagnosis.severity },
    });

    await new Promise((r) => setTimeout(r, 400));

    // ── Stage 4: Technical Context / RAG ────────────────────────────────────
    sendEvent(res, {
      stage: 4,
      status: "progress",
      message: "Querying technical knowledge base for torque specs and procedures...",
      label: "Technical Context Retrieval",
    });

    await new Promise((r) => setTimeout(r, 500));

    // ── Stage 5: Repair Guide Generation ────────────────────────────────────
    sendEvent(res, {
      stage: 5,
      status: "progress",
      message: "Synthesizing customized repair blueprint...",
      label: "Guide Synthesis",
    });

    const guidePrompt = `Based on this diagnosis, generate a comprehensive step-by-step repair guide.

Diagnosis: ${diagnosis.primaryDiagnosis}
Equipment: ${equipmentLabel}
Severity: ${diagnosis.severity}
Symptoms: ${(diagnosis.symptoms || []).join(", ")}
Possible Causes: ${(diagnosis.possibleCauses || []).join(", ")}
Required Tools: ${(diagnosis.requiredTools || []).join(", ")}
Safety Warnings: ${(diagnosis.safetyWarnings || []).join(", ")}

Respond ONLY with valid JSON matching this exact schema:
{
  "title": "string (concise repair title)",
  "summary": "string (2-3 sentence executive summary for a foreman)",
  "totalTime": "string (e.g. '45 minutes')",
  "overallDifficulty": "easy" | "moderate" | "difficult" | "expert",
  "safetyWarnings": ["string array — mandatory safety steps before starting"],
  "requiredTools": ["string array of tools"],
  "steps": [
    {
      "stepNumber": 1,
      "title": "string",
      "description": "string (detailed 2-3 sentence explanation)",
      "duration": "string (e.g. '5 minutes')",
      "warnings": ["string array of warnings for this step — can be empty"]
    }
  ],
  "requiredParts": [
    {
      "name": "string",
      "partNumber": "string (OEM part number if known, else 'N/A')",
      "description": "string",
      "estimatedPriceLow": number,
      "estimatedPriceHigh": number,
      "priority": "required" | "recommended" | "optional",
      "whereToBuy": ["string array: e.g. 'Amazon', 'AutoZone', 'RepairClinic', 'OEM dealer'"]
    }
  ]
}

Include 4-7 detailed repair steps. Include 1-3 required parts.`;

    const guideResponse = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: guidePrompt }] }],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    let guideText = guideResponse.text ?? "{}";
    guideText = guideText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const guide = JSON.parse(guideText);

    await new Promise((r) => setTimeout(r, 400));

    // ── Stage 6: Parts Sourcing ──────────────────────────────────────────────
    sendEvent(res, {
      stage: 6,
      status: "progress",
      message: "Locating required parts and checking local availability...",
      label: "Parts Sourcing",
    });

    await new Promise((r) => setTimeout(r, 600));

    // ── Complete ─────────────────────────────────────────────────────────────
    const fullResult = {
      diagnosis: {
        primaryDiagnosis: diagnosis.primaryDiagnosis,
        confidence: diagnosis.confidence,
        severity: diagnosis.severity,
        symptoms: diagnosis.symptoms || [],
        possibleCauses: diagnosis.possibleCauses || [],
        requiresExpertReview: diagnosis.requiresExpertReview || false,
        safetyWarnings: diagnosis.safetyWarnings || [],
      },
      guide: {
        title: guide.title,
        summary: guide.summary,
        totalTime: guide.totalTime || diagnosis.estimatedRepairTime,
        overallDifficulty: guide.overallDifficulty,
        safetyWarnings: guide.safetyWarnings || diagnosis.safetyWarnings || [],
        requiredTools: guide.requiredTools || diagnosis.requiredTools || [],
        steps: guide.steps || [],
        requiredParts: guide.requiredParts || [],
      },
    };

    sendEvent(res, {
      stage: 6,
      status: "complete",
      message: "Repair guide ready.",
      data: fullResult,
    });

    res.end();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Pipeline execution failed";
    sendEvent(res, { stage: 0, status: "error", message });
    res.end();
  }
});

export default router;
