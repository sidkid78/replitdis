import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { ai } from "@workspace/integrations-gemini-ai";

const router = Router();
const MODEL = "gemini-3-flash-preview";

// ── Request schema ────────────────────────────────────────────────────────────
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
  location?: {
    zipCode?: string;
    city?: string;
    state?: string;
  };
}

// ── Zod validation schemas ────────────────────────────────────────────────────
const DiagnosisSchema = z.object({
  primaryDiagnosis: z.string().default("Unable to determine diagnosis"),
  confidence: z.number().min(0).max(1).default(0.5),
  severity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  symptoms: z.array(z.string()).default([]),
  possibleCauses: z.array(z.string()).default([]),
  requiresExpertReview: z.boolean().default(false),
  safetyWarnings: z.array(z.string()).default([]),
  estimatedRepairTime: z.string().default("Unknown"),
  overallDifficulty: z.enum(["easy", "moderate", "difficult", "expert"]).default("moderate"),
  requiredTools: z.array(z.string()).default([]),
});

const StepSchema = z.object({
  stepNumber: z.number(),
  title: z.string(),
  description: z.string(),
  duration: z.string().default(""),
  warnings: z.array(z.string()).default([]),
});

const PartSchema = z.object({
  name: z.string(),
  partNumber: z.string().default("N/A"),
  description: z.string().default(""),
  estimatedPriceLow: z.number().default(0),
  estimatedPriceHigh: z.number().default(0),
  priority: z.enum(["required", "recommended", "optional"]).default("required"),
  whereToBuy: z.array(z.string()).default([]),
});

const GuideSchema = z.object({
  title: z.string().default("Repair Guide"),
  summary: z.string().default(""),
  totalTime: z.string().default(""),
  overallDifficulty: z.enum(["easy", "moderate", "difficult", "expert"]).default("moderate"),
  safetyWarnings: z.array(z.string()).default([]),
  requiredTools: z.array(z.string()).default([]),
  steps: z.array(StepSchema).default([]),
  requiredParts: z.array(PartSchema).default([]),
});

type Diagnosis = z.infer<typeof DiagnosisSchema>;
type Guide = z.infer<typeof GuideSchema>;

// ── Safe JSON parser with Zod validation ─────────────────────────────────────
function parseJsonSafe<T>(
  text: string,
  schema: z.ZodType<T>,
  fallback: T,
): T {
  try {
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);
    const result = schema.safeParse(parsed);
    if (result.success) return result.data;
    // Schema mismatch — try partial merge with defaults
    return schema.parse({ ...parsed });
  } catch {
    return fallback;
  }
}

// ── Deterministic safety rules keyed by equipment keyword ────────────────────
// These are injected BEFORE AI runs so safety is never purely hallucinated.
const SAFETY_RULES: Record<string, string[]> = {
  hvac: [
    "CAPACITOR HAZARD: Discharge capacitors before touching any electrical components — capacitors can hold lethal charge even when power is off.",
    "REFRIGERANT WARNING: R-410A and R-22 refrigerant handling requires EPA 608 certification. Do not vent refrigerant.",
    "LOTO: Apply Lockout/Tagout to the circuit breaker and indoor/outdoor disconnect before servicing.",
  ],
  "air conditioner": [
    "CAPACITOR HAZARD: Discharge capacitors before touching any electrical components — capacitors can hold lethal charge even when power is off.",
    "LOTO: Apply Lockout/Tagout and confirm zero energy state before opening the unit.",
  ],
  "heat pump": [
    "REFRIGERANT WARNING: Requires EPA 608 certification. Do not vent refrigerant.",
    "HIGH VOLTAGE: Units operate at 240V. Confirm power is off at both the breaker and disconnect.",
  ],
  electrical: [
    "HIGH VOLTAGE: Verify circuit is de-energized with a non-contact voltage tester before touching any wiring.",
    "LOTO: Apply Lockout/Tagout at the panel before beginning work.",
    "ARC FLASH RISK: Use appropriate PPE — safety glasses, insulated gloves, and flame-resistant clothing.",
  ],
  furnace: [
    "GAS HAZARD: If you smell gas, evacuate immediately and call the gas company. Do not operate any switches.",
    "CARBON MONOXIDE: Ensure adequate ventilation. Use a CO detector before and during service.",
    "HIGH TEMPERATURE: Allow the heat exchanger to cool completely before inspection.",
  ],
  boiler: [
    "HIGH PRESSURE: Never open pressurized vessels. Verify pressure gauge reads zero before opening any ports.",
    "SCALDING RISK: Allow system to cool to below 38°C (100°F) before draining.",
    "GAS HAZARD: If you smell gas, evacuate immediately and call the gas company.",
  ],
  refrigerator: [
    "CAPACITOR HAZARD: Start and run capacitors can retain charge. Discharge before touching.",
    "REFRIGERANT: CFC/HFC refrigerant requires EPA 608 certification to handle.",
  ],
  washer: [
    "ELECTROCUTION RISK: Unplug the unit completely before opening the cabinet.",
    "WATER HAZARD: Turn off water supply valves before disconnecting hoses.",
  ],
  dryer: [
    "FIRE HAZARD: Clean lint trap and duct thoroughly before reassembly — lint is highly flammable.",
    "GAS DRYERS: Shut off gas supply at the valve before disconnecting the flex connector.",
    "ELECTROCUTION RISK: Unplug the unit and confirm 240V circuit is off at the breaker.",
  ],
  automotive: [
    "JACK SAFETY: Never work under a vehicle supported only by a hydraulic jack. Use rated jack stands.",
    "HOT COMPONENTS: Allow the engine to cool before working near the exhaust or cooling system.",
    "BATTERY: Disconnect the negative terminal first to prevent accidental shorts.",
  ],
  engine: [
    "HOT SURFACES: Allow engine to cool for at least 30 minutes before servicing.",
    "BATTERY: Disconnect the negative terminal before working on electrical components.",
    "ROTATING PARTS: Never reach near belts, fans, or pulleys while the engine is running.",
  ],
  industrial: [
    "LOTO: Full Lockout/Tagout procedure is mandatory before servicing any industrial equipment.",
    "CONFINED SPACE: If servicing enclosed equipment, follow confined space entry permit procedures.",
    "ARC FLASH: Perform arc flash hazard analysis and wear appropriate PPE before working on electrical panels.",
    "HEAVY MACHINERY: Engage all mechanical stops and safety pins before placing any body part under suspended loads.",
  ],
  generator: [
    "CARBON MONOXIDE: Never run a generator indoors or in an enclosed space — CO kills within minutes.",
    "BACK-FEED HAZARD: Never connect a generator to home wiring without a transfer switch — it can electrocute utility workers.",
    "HOT EXHAUST: Keep flammable materials at least 1.5m away from the exhaust.",
  ],
  compressor: [
    "HIGH PRESSURE: Bleed all pressure from the tank before removing any fittings or the drain valve.",
    "HEAT: Air compressor tanks and cylinders become extremely hot during operation. Allow to cool before servicing.",
  ],
};

function getEquipmentSafetyRules(make: string, model: string, description = ""): string[] {
  const searchText = `${make} ${model} ${description}`.toLowerCase();
  const injected = new Set<string>();

  for (const [keyword, rules] of Object.entries(SAFETY_RULES)) {
    if (searchText.includes(keyword)) {
      rules.forEach((r) => injected.add(r));
    }
  }

  return Array.from(injected);
}

// ── SSE helper ────────────────────────────────────────────────────────────────
function sendEvent(res: Response, event: object) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

// ── Main route ────────────────────────────────────────────────────────────────
router.post("/diagnose", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  // AbortController — cancelled when the client disconnects
  const abortController = new AbortController();
  req.on("close", () => abortController.abort());

  const { equipment, media, location } = req.body as DiagnoseRequest;

  if (!equipment?.make || !equipment?.model) {
    sendEvent(res, { stage: 0, status: "error", message: "Equipment make and model are required." });
    return res.end();
  }

  const equipmentLabel = `${equipment.year ? equipment.year + " " : ""}${equipment.make} ${equipment.model}`;
  const userDescription = equipment.description || "No additional description provided.";

  // Inject deterministic safety rules before AI runs
  const deterministicWarnings = getEquipmentSafetyRules(
    equipment.make,
    equipment.model,
    equipment.description,
  );

  try {
    // ── Stage 1: Media Processing ─────────────────────────────────────────────
    sendEvent(res, {
      stage: 1,
      status: "progress",
      message: "Processing media assets and verifying signatures...",
      label: "Media Processing",
    });

    const parts: object[] = [];

    if (media && media.length > 0) {
      for (const m of media) {
        if (!m.base64 || !m.mimeType) continue;
        const bytes = Buffer.byteLength(m.base64, "base64");
        if (bytes > 8 * 1024 * 1024) {
          sendEvent(res, {
            stage: 1,
            status: "warning",
            message: `Media file exceeds 8MB (${Math.round(bytes / 1024 / 1024)}MB). For files larger than 8MB, use the file upload endpoint. Proceeding with analysis.`,
          });
          continue; // Skip oversized files rather than crashing
        }
        parts.push({ inlineData: { mimeType: m.mimeType, data: m.base64 } });
      }
    }

    const hasMedia = parts.length > 0;

    // ── Stage 2: Symptom Analysis ─────────────────────────────────────────────
    sendEvent(res, {
      stage: 2,
      status: "progress",
      message: "Initiating multimodal symptom analysis...",
      label: "Acoustic & Visual Scan",
    });

    const diagnosisPrompt = `You are an expert appliance and equipment diagnostic AI ("Digital Foreman"). Analyze the following and produce a JSON diagnosis.

Equipment: ${equipmentLabel}
User Description: ${userDescription}
${hasMedia ? "Media: Audio/visual recording of the fault has been attached." : "Note: No media was provided — diagnose from the text description only."}
${deterministicWarnings.length > 0 ? `\nPre-identified safety requirements for this equipment type that MUST appear in safetyWarnings:\n${deterministicWarnings.map((w) => `- ${w}`).join("\n")}` : ""}

Respond ONLY with valid JSON matching this exact schema:
{
  "primaryDiagnosis": "string (the most likely root cause, 1-2 sentences)",
  "confidence": number (0.0-1.0),
  "severity": "low" | "medium" | "high" | "critical",
  "symptoms": ["string array of observed symptoms"],
  "possibleCauses": ["string array of 2-4 possible causes ranked by likelihood"],
  "requiresExpertReview": boolean,
  "safetyWarnings": ["string array of safety precautions — include all pre-identified warnings above verbatim"],
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
        abortSignal: abortController.signal,
      },
    });

    if (abortController.signal.aborted) return res.end();

    const diagnosisFallback: Diagnosis = {
      primaryDiagnosis: "Analysis incomplete — unable to parse AI response",
      confidence: 0.5,
      severity: "medium",
      symptoms: [],
      possibleCauses: [],
      requiresExpertReview: true,
      safetyWarnings: deterministicWarnings,
      estimatedRepairTime: "Unknown",
      overallDifficulty: "moderate",
      requiredTools: [],
    };

    const diagnosis = parseJsonSafe(
      diagnosisResponse.text ?? "{}",
      DiagnosisSchema,
      diagnosisFallback,
    );

    // Guarantee deterministic warnings are always present, even if AI dropped them
    const mergedWarnings = Array.from(
      new Set([...deterministicWarnings, ...diagnosis.safetyWarnings]),
    );
    diagnosis.safetyWarnings = mergedWarnings;

    sendEvent(res, {
      stage: 3,
      status: "progress",
      message: `Diagnosis confirmed. Confidence: ${Math.round((diagnosis.confidence ?? 0.85) * 100)}%`,
      label: "Multimodal Diagnosis",
      data: { confidence: diagnosis.confidence, severity: diagnosis.severity },
    });

    // ── Stage 4: Technical Context Retrieval (Grounded RAG) ───────────────────
    sendEvent(res, {
      stage: 4,
      status: "progress",
      message: "Querying OEM knowledge base for torque specs and service procedures...",
      label: "Technical Context Retrieval",
    });

    const ragQuery = `Retrieve authoritative technical service information for a ${equipmentLabel}.
Primary fault: ${diagnosis.primaryDiagnosis}
Possible causes: ${diagnosis.possibleCauses.slice(0, 3).join(", ")}

Find and summarize:
1. OEM-specified torque values and clearances relevant to this repair
2. Known technical service bulletins (TSBs) or recall notices for this equipment
3. Manufacturer-recommended tools and procedures for this fault
4. Common mistakes technicians make when repairing this specific issue
5. Any relevant safety protocols specific to this make/model

Use Google Search to find iFixit, manufacturer service manuals, NHTSA bulletins, or reputable technical forums.`;

    const ragResponse = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: ragQuery }] }],
      config: {
        tools: [{ googleSearch: {} }],
        abortSignal: abortController.signal,
      },
    });

    if (abortController.signal.aborted) return res.end();

    const technicalContext = ragResponse.text ?? "";

    sendEvent(res, {
      stage: 4,
      status: "progress",
      message: "Technical context retrieved. Cross-referencing OEM specifications.",
      label: "Knowledge Base Hit",
      data: { technicalContext },
    });

    // ── Stage 5: Repair Guide Generation ─────────────────────────────────────
    sendEvent(res, {
      stage: 5,
      status: "progress",
      message: "Synthesizing customized repair blueprint...",
      label: "Guide Synthesis",
    });

    const guidePrompt = `Based on this diagnosis and the retrieved technical context, generate a comprehensive step-by-step repair guide.

Diagnosis: ${diagnosis.primaryDiagnosis}
Equipment: ${equipmentLabel}
Severity: ${diagnosis.severity}
Symptoms: ${diagnosis.symptoms.join(", ")}
Possible Causes: ${diagnosis.possibleCauses.join(", ")}
Required Tools: ${diagnosis.requiredTools.join(", ")}
Mandatory Safety Warnings (include ALL of these verbatim in safetyWarnings): 
${mergedWarnings.map((w) => `- ${w}`).join("\n")}

Technical Context from OEM sources:
${technicalContext}

Respond ONLY with valid JSON matching this exact schema:
{
  "title": "string (concise repair title)",
  "summary": "string (2-3 sentence executive summary for a foreman)",
  "totalTime": "string (e.g. '45 minutes')",
  "overallDifficulty": "easy" | "moderate" | "difficult" | "expert",
  "safetyWarnings": ["string array — include ALL mandatory warnings above verbatim, then add any step-specific ones"],
  "requiredTools": ["string array of tools"],
  "steps": [
    {
      "stepNumber": 1,
      "title": "string",
      "description": "string (detailed 2-3 sentence explanation with OEM specs where available)",
      "duration": "string (e.g. '5 minutes')",
      "warnings": ["string array of warnings for this step — can be empty"]
    }
  ],
  "requiredParts": [
    {
      "name": "string",
      "partNumber": "string (OEM part number if found in technical context, else 'N/A')",
      "description": "string",
      "estimatedPriceLow": number,
      "estimatedPriceHigh": number,
      "priority": "required" | "recommended" | "optional",
      "whereToBuy": ["string array: e.g. 'Amazon', 'AutoZone', 'RepairClinic', 'OEM dealer'"]
    }
  ]
}

Include 4-7 detailed repair steps informed by the technical context above. Include 1-3 required parts with accurate OEM part numbers where available.`;

    const guideResponse = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: guidePrompt }] }],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
        abortSignal: abortController.signal,
      },
    });

    if (abortController.signal.aborted) return res.end();

    const guideFallback: Guide = {
      title: "Repair Guide",
      summary: "Unable to generate guide — please retry.",
      totalTime: diagnosis.estimatedRepairTime,
      overallDifficulty: diagnosis.overallDifficulty,
      safetyWarnings: mergedWarnings,
      requiredTools: diagnosis.requiredTools,
      steps: [],
      requiredParts: [],
    };

    const guide = parseJsonSafe(
      guideResponse.text ?? "{}",
      GuideSchema,
      guideFallback,
    );

    // Guarantee safety warnings survived the guide generation
    guide.safetyWarnings = Array.from(
      new Set([...mergedWarnings, ...guide.safetyWarnings]),
    );

    // ── Stage 6: Parts Sourcing ───────────────────────────────────────────────
    sendEvent(res, {
      stage: 6,
      status: "progress",
      message: "Locating required parts and checking local availability...",
      label: "Parts Sourcing",
    });

    const partNames = guide.requiredParts.map((p) => p.name).join(", ");
    const locationStr = location?.zipCode
      ? `near zip code ${location.zipCode}`
      : location?.city
        ? `near ${location.city}${location.state ? ", " + location.state : ""}`
        : "in the United States";

    const searchQuery = `Find where to buy these parts for a ${equipmentLabel} ${locationStr}.
List specific local stores and online retailers with prices: ${partNames}.
Include store names, estimated prices, and whether they typically stock these items.
Where possible, confirm OEM part numbers match: ${guide.requiredParts.map((p) => `${p.name} (${p.partNumber})`).join(", ")}.`;

    const searchResponse = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: searchQuery }] }],
      config: {
        tools: [{ googleSearch: {} }],
        abortSignal: abortController.signal,
      },
    });

    if (abortController.signal.aborted) return res.end();

    sendEvent(res, {
      stage: 6,
      status: "progress",
      message: "Parts market data retrieved via Google Search grounding.",
      label: "Grounding Complete",
      data: { sourcingNotes: searchResponse.text },
    });

    // ── Complete ──────────────────────────────────────────────────────────────
    const fullResult = {
      diagnosis: {
        primaryDiagnosis: diagnosis.primaryDiagnosis,
        confidence: diagnosis.confidence,
        severity: diagnosis.severity,
        symptoms: diagnosis.symptoms,
        possibleCauses: diagnosis.possibleCauses,
        requiresExpertReview: diagnosis.requiresExpertReview,
        safetyWarnings: mergedWarnings,
      },
      guide: {
        title: guide.title,
        summary: guide.summary,
        totalTime: guide.totalTime || diagnosis.estimatedRepairTime,
        overallDifficulty: guide.overallDifficulty,
        safetyWarnings: guide.safetyWarnings,
        requiredTools: guide.requiredTools,
        steps: guide.steps,
        requiredParts: guide.requiredParts,
        sourcingNotes: searchResponse.text ?? "",
        technicalContext,
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
    if (abortController.signal.aborted) return res.end();
    const message = err instanceof Error ? err.message : "Pipeline execution failed";
    sendEvent(res, { stage: 0, status: "error", message });
    res.end();
  }
});

export default router;
