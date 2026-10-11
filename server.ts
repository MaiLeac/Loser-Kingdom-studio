import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

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

// 1. Sarcastic Roast Generation API
app.post('/api/roast', async (req: Request, res: Response) => {
  try {
    const { targetApp, taskName, excuse, failureStreak, loserRank, customContext } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      // High quality fallback roasts in case no API key is available
      const fallbackRoasts = [
        `Lại mở ${targetApp || 'mạng xã hội'} ra ngắm thiên hạ thành công còn mình thì tiếp tục nằm gác chân lên tường à? Nhìn vào gương xem mắt đã thâm như gấu trúc chưa?`,
        `Cứ bảo 'nghỉ 5 phút thôi' rồi lướt thành 5 tiếng. Não bộ mày đang tan chảy ra thành nước rồi kìa đồ sâu lười!`,
        `Deadline dí tới mông rồi mà ngón tay vẫn quẹt quẹt màn hình điêu luyện lắm. Tài năng duy nhất của mày là biến tương lai thành con số 0 tròn trĩnh à?`,
        `Một video nữa thôi ha? Bố mẹ còng lưng nuôi mày ăn học để mày ngồi cống hiến view cho mấy idol tóp tóp nhảy nhót vớ vẩn đấy à?!`,
        `Thất bại không tự sinh ra và không tự mất đi, nó chỉ chuyển hoá từ sự trì hoãn này sang lần bấm ${targetApp || 'app rác'} tiếp theo của mày!`
      ];
      const randomRoast = fallbackRoasts[Math.floor(Math.random() * fallbackRoasts.length)];
      return res.json({ roast: randomRoast, isFallback: true });
    }

    const prompt = `Bạn là "Đại Ma Vương Loser" - AI cai quản Vương Quốc Loser, chuyên trừng phạt và đay nghiến những kẻ nghiện lướt mạng xã hội, lười biếng, trì hoãn công việc.
Thông tin đối tượng:
- Ứng dụng/Hành vi phạm tội: ${targetApp || 'Lướt TikTok / Shorts vô bổ'}
- Công việc đang trốn tránh: ${taskName || 'Chưa chịu làm việc/học tập'}
- Lý do biện hộ (nếu có): ${excuse || 'Không có, chỉ là lười'}
- Chuỗi thất bại: ${failureStreak || 1} lần
- Cấp bậc hiện tại: ${loserRank || 'Tân Binh Lười Biếng'}
- Ghi chú: ${customContext || ''}

Yêu cầu:
1. Đay nghiến thật gắt, châm biếm cay độc, thẳng thắn, bóc trần sự hèn nhát và ảo tưởng.
2. Xưng hô "Mày - Tao" hoặc gọi "Kẻ thất bại".
3. Tuyệt đối KHÔNG văn mẫu đạo lý, KHÔNG khuyên nhủ êm dịu, KHÔNG an ủi. Hãy dùng ngôn từ súc tích đâm thẳng vào tim đen của một kẻ đang đốt tuổi trẻ cho thuật toán đề xuất video ngắn.
4. Độ dài: 2 đến 3 câu cực mạnh mẽ, tiếng Việt sắc lẹm.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const text = response.text?.trim() || 'Nhìn lại bản thân xem đã làm được gì chưa hay vẫn ngồi đó bấm điện thoại? Dậy mà làm việc đi!';
    res.json({ roast: text });
  } catch (err: any) {
    console.error('Roast API Error:', err);
    res.json({
      roast: 'Đến cả server còn chán ngán cái sự lười biếng của mày! Tự vả vào mặt 3 cái rồi quay lại làm việc ngay!',
      error: err.message
    });
  }
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

// 3. Savage Punishment Generator
app.post('/api/generate-punishment', async (req: Request, res: Response) => {
  try {
    const { offense, severity } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      const localPenalties = [
        { title: 'Chống đẩy sám hối', description: 'Thực hiện ngay 25 cái chống đẩy hoặc plank 60 giây không nghỉ.', category: 'physical' },
        { title: 'Tẩy trần Dopamine', description: 'Cất điện thoại vào ngăn tủ kín hoặc phòng khác trong đúng 45 phút.', category: 'isolation' },
        { title: 'Thư sám hối', description: 'Viết ra giấy 10 điều mày sẽ mất nếu tiếp tục sống như một kẻ thất bại vô danh.', category: 'mental' },
        { title: 'Rửa mặt nước băng', description: 'Vào nhà vệ sinh vỗ nước lạnh lên mặt 5 lần để tỉnh cơn ngáo mạng xã hội.', category: 'shock' }
      ];
      const p = localPenalties[Math.floor(Math.random() * localPenalties.length)];
      return res.json({ punishment: p });
    }

    const prompt = `Tạo một hình phạt kỷ luật khắc nghiệt, thực tế và hài hước châm biếm dành cho một người vừa phạm tội: "${offense || 'Lướt TikTok trong giờ làm'}".
Cấp độ nghiêm trọng: ${severity || 'severe'}.
Hình phạt phải làm ngay ngoài đời thực (thể lực, tâm lý dọn dẹp, hoặc cai nghiện thiết bị), KHÔNG làm tổn hại thân thể nguy hiểm.
Trả về định dạng JSON:
{
  "title": "Tên hình phạt kêu, hài hước và áp lực",
  "description": "Hướng dẫn thực hiện cụ thể từng bước bằng tiếng Việt",
  "category": "physical" | "mental" | "isolation" | "public_shame"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ punishment: parsed });
  } catch (err: any) {
    res.json({
      punishment: {
        title: 'Án phạt khẩn cấp: 30 cái squat',
        description: 'Đứng dậy ngay khỏi ghế và squat 30 cái. Đừng ngồi ỳ ra đó nữa!',
        category: 'physical'
      }
    });
  }
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
