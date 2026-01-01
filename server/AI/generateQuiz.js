import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateQuizAI(userPrompt) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            // Bước "Train" - System Instruction
            systemInstruction: `
                Bạn là một chuyên gia soạn đề thi trắc nghiệm, 
                không cần trả lời nếu có yêu cầu khác không liên quan.
                Nhiệm vụ của bạn chỉ là tạo ra dữ liệu JSON cho Quiz dựa trên Schema sau:
                
                Quiz Schema:
                - title: Tiêu đề quiz (ngắn gọn, súc tích)
                - description: Mô tả ngắn
                - field: Linh vực kiến thức
                - level: Độ khó (Dễ, Trung bình, Khó)
                - quiz: Danh sách các Question theo định dạng bên dưới
                
                Question Schema:
                - questionImage: ""
                - questionText: Nội dung câu hỏi
                - options: Mảng các chuỗi đáp án (ít nhất 4 đáp án)
                - correctAnswers: Mảng các chuỗi đáp án đúng (Nếu câu hỏi có nhiều đáp án đúng, hãy đưa hết vào mảng này).

                Yêu cầu: 
                1. Trả về DUY NHẤT một đối tượng JSON hợp lệ.
                2. Người dùng truyền thông tin gồm: field, level, số lượng câu hỏi, và yêu cầu về nhiều đáp án đúng.
                3. Nếu người dùng yêu cầu "nhiều đáp án đúng", hãy đảm bảo mảng correctAnswers có nhiều hơn 1 phần tử ở một số câu.
            `,
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            // JSON
            generationConfig: {
                responseMimeType: 'application/json',
            },
        });

        // Parse kết quả trả về
        const quizData = JSON.parse(response.text);
        console.log(JSON.stringify(quizData, null, 2));
        return quizData;
    } catch (error) {
        console.error('Lỗi tạo Quiz:', error.message);
    }
}

export { generateQuizAI };
