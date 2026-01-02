const { generateQuizAI } = require('../AI/generateQuiz.js');

class GeminiController {
    // [POST] /api/gemini/generate
    async generate(req, res) {
        try {
            const { fieldName, levelName, numberOfQuestions, multipleCorrect } = req.body;

            const quizData = await generateQuizAI(fieldName, levelName, numberOfQuestions, multipleCorrect);

            return res.status(200).json(quizData);
        } catch (error) {
            console.error('Gemini Controller Error:', error);
            return res.status(500).json({
                msg: 'AI đang bận hoặc hết hạn mức, vui lòng thử lại sau!',
                error: error.message,
            });
        }
    }
}

module.exports = new GeminiController();
