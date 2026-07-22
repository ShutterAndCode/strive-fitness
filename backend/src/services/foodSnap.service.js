import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/env.js";
import ApiError from "../utils/ApiError.js";

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

const PROMPT = `You are a nutrition analysis assistant. Analyze the food shown in this image and respond with ONLY a valid JSON object (no markdown, no extra text) in exactly this shape:
{
  "foodName": string,
  "estimatedCalories": number,
  "protein": number,
  "carbohydrates": number,
  "fats": number,
  "confidence": number
}
All numeric nutrition values should be your best estimate in grams (except calories). "confidence" is a number between 0 and 1 representing how confident you are in this identification. If the image does not clearly show food, set "foodName" to "unrecognized" and all numeric fields to 0.`;

export const analyzeFoodImage = async (fileBuffer, mimeType) => {
  const model = genAI.getGenerativeModel({
    model: "models/gemini-flash-latest",
  }); //working model tested on retail-analysis-prof

  let result;
  try {
    result = await model.generateContent([
      PROMPT,
      {
        inlineData: {
          data: fileBuffer.toString("base64"),
          mimeType,
        },
      },
    ]);
  } catch (error) {
    throw new ApiError(502, `Failed to analyze image using AI services`);
  }

  const responseText = result.response.text();

  let parsed;
  try {
    const cleaned = responseText.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (error) {
    throw new ApiError(502, "AI returned an unreadable response");
  }

  if (parsed.foodName === "unrecognized") {
    throw new ApiError(
      422, //422 Unprocessable Entity
      "Could not identify the food in the provided image",
    );
  }

  return {
    foodName: parsed.foodName,
    estimatedCalories: parsed.estimatedCalories,
    protein: parsed.protein,
    carbohydrates: parsed.carbohydrates,
    fats: parsed.fats,
    confidence: parsed.confidence,
  };
};
