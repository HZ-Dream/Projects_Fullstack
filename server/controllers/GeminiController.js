const { generateQuizAI } = require('../AI/generateQuiz.js');
const { spawn } = require('child_process');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const multer = require('multer');

// Config Multer
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const tempDir = path.join(__dirname, '../../temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            cb(null, tempDir);
        },
        filename: (req, file, cb) => {
            cb(null, `upload_${Date.now()}_${Math.random().toString(36).substring(7)}.docx`);
        },
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file .doc/.docx'));
        }
    },
});

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

    // [POST] /api/gemini/convertText
    async convertText(req, res) {
        upload.single('wordFile')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ msg: err.message || 'Lỗi upload file' });
            }

            if (!req.file) {
                return res.status(400).json({ msg: 'Không tìm thấy file' });
            }

            const tempFilePath = req.file.path;

            try {
                // Đường dẫn script Python
                const pythonScriptPath = path.join(__dirname, '../../handlePython/convertWordToQuiz.py');

                // Chạy Python script
                const pythonProcess = spawn('python', [pythonScriptPath, tempFilePath], {
                    env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
                    windowsHide: true,
                });

                let stdoutData = '';
                let stderrData = '';

                pythonProcess.stdout.on('data', (data) => {
                    stdoutData += data.toString();
                });

                pythonProcess.stderr.on('data', (data) => {
                    stderrData += data.toString();
                });

                // Chờ Python kết thúc
                const exitCode = await new Promise((resolve) => {
                    pythonProcess.on('close', (code) => resolve(code));
                });

                // Xóa file tạm ngay lập tức (dù thành công hay lỗi)
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }

                if (exitCode === 0) {
                    try {
                        // Lấy phần JSON từ stdout (Gemini trả JSON sạch nhờ response_mime_type)
                        const jsonMatch = stdoutData.trim().match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            const quizData = JSON.parse(jsonMatch[0]);
                            return res.status(200).json(quizData);
                        } else {
                            return res.status(500).json({ msg: 'Không tìm thấy JSON từ AI', raw: stdoutData });
                        }
                    } catch (parseErr) {
                        console.error('Parse JSON error:', parseErr, stdoutData);
                        return res.status(500).json({ msg: 'Lỗi parse dữ liệu từ AI' });
                    }
                } else {
                    console.error('Python error:', stderrData);
                    return res.status(500).json({ msg: 'Lỗi xử lý file Word bởi Python', error: stderrData });
                }
            } catch (error) {
                console.error('Server error:', error);
                if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
                return res.status(500).json({ msg: 'Lỗi server, vui lòng thử lại' });
            }
        });
    }
}

module.exports = new GeminiController();
