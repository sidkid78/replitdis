import { Router, type Request, type Response } from "express";
import { generateImage } from "@workspace/integrations-gemini-ai/image";

const router = Router();

interface GenerateStepImageRequest {
  stepNumber: number;
  stepTitle: string;
  stepDescription: string;
  equipmentMake: string;
  equipmentModel: string;
}

router.post("/generate-step-image", async (req: Request, res: Response) => {
  const { stepNumber, stepTitle, stepDescription, equipmentMake, equipmentModel } =
    req.body as GenerateStepImageRequest;

  if (!stepTitle || !stepDescription) {
    res.status(400).json({ error: "stepTitle and stepDescription are required." });
    return;
  }

  const prompt = `Create a clear, technical illustration for a repair guide step.

Equipment: ${equipmentMake} ${equipmentModel}
Step ${stepNumber}: ${stepTitle}

Instructions being illustrated: ${stepDescription}

Style: Technical diagram / exploded view illustration. Clean, professional, industrial aesthetic. Light grey background. Show hands, tools, and components clearly. Photorealistic technical illustration with clear detail.`;

  try {
    const { b64_json, mimeType } = await generateImage(prompt);
    res.json({ imageBase64: b64_json, mimeType });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Image generation failed.";
    res.status(500).json({ error: message });
  }
});

export default router;
