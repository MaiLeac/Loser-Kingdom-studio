import { SAFE_PUNISHMENTS } from './src/utils/safePunishments';
import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { generateReview, ROAST_SYSTEM_INSTRUCTION } from './roastService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI instance safely
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Discipline decisions are deterministic; Gemini can only write bounded copy.
app.post('/api/roast', async (req: Request, res: Response) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Nội dung không hợp lệ. Chưa áp dụng hình phạt.' });
  }
  const ai = getGenAIClient();
  const result = await generateReview(req.body, ai ? async context => {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      contents: context,
      config: {
        systemInstruction: ROAST_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseJsonSchema: {type: 'object', properties: {roast: {type: 'string'}}, required: ['roast']},
      },
    });
    return response.text;
  } : undefined);
  res.json(result);
});

// 2. Anti-cheat Task Proof Verifier
app.post('/api/verify-proof', async (req: Request, res: Response) => {
  try {
    const { taskTitle, proofType, proofContent } = req.body;
    const ai = getGenAIClient();

    if (!proofContent || proofContent.trim().length < 5) {
      return res.json({
        approved: false,
        score: 0,
        feedback: 'Bằng chứng rác rưởi! Chưa gõ được chữ nào ra hồn mà đòi qua ải?',
        penaltyReason: 'Gửi bằng chứng rỗng để gian lận'
      });
    }

    if (!ai) {
      const isAcceptable = proofContent.trim().length > 30;
      return res.json({
        approved: isAcceptable,
        score: isAcceptable ? 85 : 30,
        feedback: isAcceptable
          ? 'Tạm chấp nhận nỗ lực này. Nhưng đừng tưởng thế là xong!'
          : 'Bằng chứng quá sơ sài, rõ ràng là copy paste vớ vẩn để đối phó!',
        penaltyReason: isAcceptable ? null : 'Nội dung quá ngắn và mang tính chống đối'
      });
    }

    const prompt = `Bạn là Trưởng Hội Đồng Chống Gian Lận của Vương Quốc Loser.
Nhiệm vụ: Thẩm định xem bằng chứng nộp lên của người dùng cho nhiệm vụ "${taskTitle}" có thực sự phản ánh lao động trí óc/công việc thật hay chỉ là gõ bừa, spam ký tự, chống đối.

Loại bằng chứng: ${proofType}
Nội dung bằng chứng:
"""
${proofContent.slice(0, 2000)}
"""

Hãy chấm điểm công tâm và trả về DUY NHẤT một chuỗi JSON có định dạng:
{
  "approved": boolean (true nếu hợp lệ nghiêm túc, false nếu spam/qua loa),
  "score": number (0 đến 100),
  "feedback": "Nhận xét ngắn gọn, sắc bén bằng tiếng Việt",
  "penaltyReason": "Lý do phạt nếu fail (null nếu approved)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    try {
      const result = JSON.parse(response.text || '{}');
      res.json(result);
    } catch {
      res.json({
        approved: true,
        score: 75,
        feedback: 'Tạm tha bổng. Lần sau còn làm màu thì ăn trừng phạt ngay!',
        penaltyReason: null
      });
    }
  } catch (err: any) {
    console.error('Verify Proof API Error:', err);
    res.json({
      approved: false,
      score: 20,
      feedback: 'Lỗi thẩm định! Kẻ lười biếng bị phạt theo quy chế mặc định.',
      penaltyReason: 'Hệ thống nghi vấn gian lận'
    });
  }
});

// Only reviewed instructions can become a real-world challenge.
app.post('/api/generate-punishment', (_req: Request, res: Response) => {
  res.json({punishment: SAFE_PUNISHMENTS[Math.floor(Math.random() * SAFE_PUNISHMENTS.length)]});
});

// Setup Vite or Static File Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Vương Quốc Loser Server] listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
