import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
    try {
        // Model 1.5-flash là model có quota miễn phí cao nhất
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // const prompt = 'Gửi lời chào ngắn gọn bằng tiếng Việt';
        // const result = await model.generateContent(prompt);
        // console.log(result.response.text());
    } catch (error) {
        console.error('Lỗi rồi:', error.message);
    }
}

run();
