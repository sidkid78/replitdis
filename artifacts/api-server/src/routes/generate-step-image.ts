import { Router, type Request, type Response } from "express";
import { ai } from "@workspace/integrations-gemini-ai";

const router = Router();

const IMAGE_MODEL = "gemini-3.1-flash-image-preview";

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

Style: Technical diagram / exploded view illustration. Clean, professional, industrial blueprint aesthetic with labels. White or light grey background. Show hands, tools, and components clearly. No text overlays needed. Photorealistic technical illustration.`;

  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: ["IMAGE"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find(
      (p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData?.mimeType?.startsWith("image/"),
    ) as { inlineData: { mimeType: string; data: string } } | undefined;

    if (!imagePart?.inlineData) {
      res.status(500).json({ error: "No image returned from model." });
      return;
    }

    res.json({
      imageBase64: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Image generation failed.";
    res.status(500).json({ error: message });
  }
});

export default router;
