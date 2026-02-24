// api/generate.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Chỉ cho phép phương thức POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 2. Lấy API Key từ biến môi trường của Server 
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const { prompt, modelName } = req.body;

    const model = genAI.getGenerativeModel({ 
      model: modelName || "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 3. Trả dữ liệu về cho Frontend
    return res.status(200).json(JSON.parse(text));
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
