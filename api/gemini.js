// api/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    // Key này lấy từ Environment Variables trên Vercel (An toàn 100%)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const { prompt, systemInstruction } = req.body;

    // Bạn có thể dùng gemini-2.0-flash cho tốc độ cực nhanh
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    // Nếu có systemInstruction (lời khuyên hệ thống), bạn có thể thêm vào đây
    const result = await model.generateContent(systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt);
    const response = await result.response;
    
    return res.status(200).json(JSON.parse(response.text()));
  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ error: "Lỗi kết nối AI" });
  }
}
