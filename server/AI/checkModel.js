import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function checkModels() {
    try {
        // Liệt kê tất cả các model khả dụng
        const list = await ai.models.list();
        console.log('--- Các model bạn có thể dùng: ---');
        for await (const model of list) {
            console.log(model.name);
        }
    } catch (e) {
        console.error('Không thể lấy danh sách model:', e);
    }
}

checkModels();
