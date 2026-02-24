// api/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { prompt, systemInstruction } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt in request body" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const inputText = systemInstruction
      ? `${systemInstruction}\n\n${prompt}`
      : prompt;

    const result = await model.generateContent(inputText);
    const response = await result.response;
    const text = response.text();

    // Safer parsing
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { output: text };
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Gemini Error:", error.message, error.stack);
    return res.status(500).json({
      error: "AI connection error",
      details: error.message,
    });
  }
}

