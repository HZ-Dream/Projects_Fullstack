const userRouter = require('./user');
const quizRouter = require('./quiz');
const takeQuizRouter = require('./takeQuiz');
const quizReviewRouter = require('./quizReview');
const replyRouter = require('./reply');
const fieldRouter = require('./field');
const geminiRouter = require('./gemini');
const searchRouter = require('./search');
const adminRouter = require('./admin');
const surveyAIRouter = require('./surveyAI');

function route(app) {
    app.use('/api/gemini', geminiRouter);
    app.use('/api/search', searchRouter);
    app.use('/api/surveyAI', surveyAIRouter);

    app.use('/api/admin', adminRouter);

    app.use('/api/user', userRouter);

    app.use('/api/quiz', quizRouter);
    app.use('/api/takeQuiz', takeQuizRouter);
    app.use('/api/quizReview', quizReviewRouter);

    app.use('/api/reply', replyRouter);
    app.use('/api/field', fieldRouter);
}

module.exports = route;
