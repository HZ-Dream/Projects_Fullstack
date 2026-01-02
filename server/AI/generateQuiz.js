const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv/config');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateQuizAI(fieldName, levelName, numberOfQuestions, multipleCorrect) {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
        });

        // Cấu hình sinh dữ liệu JSON
        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
        };

        const systemInstruction = `
            Bạn là một chuyên gia soạn đề thi trắc nghiệm. 
            Nhiệm vụ: Trả về JSON cho Quiz lĩnh vực ${fieldName}, độ khó ${levelName}.
            Cấu trúc JSON:
            {
              "title": "string", // Ngắn gọn, súc tích
              "description": "string", // Mô tả ngắn về quiz
              "field": "${fieldName}", // Lĩnh vực của quiz
              "level": "${levelName}", // Độ khó của quiz
              "quiz": [
                {
                  "questionText": "string",
                  "options": ["string", "string", "string", "string"], // ít nhất 2 tùy chọn và tối đa 6 tùy chọn
                  "correctAnswers": ["string"]
                }
              ]
            }
            Lưu ý: Nếu multipleCorrect là 'true', hãy tạo một số câu có nhiều đáp án đúng.
        `;

        const userPrompt = `Tạo ${numberOfQuestions} câu hỏi. Yêu cầu nhiều đáp án đúng: ${multipleCorrect}`;

        const result = await model.generateContent(systemInstruction + '\n\n' + userPrompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from markdown code block if present
        let jsonString = text;
        if (text.startsWith('```json') && text.endsWith('```')) {
            jsonString = text.slice(7, -3).trim();
        }

        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Lỗi tại generateQuizAI:', error.message);
        throw error;
    }
}

module.exports = { generateQuizAI };
