const authRouter = require('./auth');
const quizRouter = require('./quiz');
const takeQuizRouter = require('./takeQuiz');
const quizReviewRouter = require('./quizReview');
const replyRouter = require('./reply');

function route(app) {
    app.use('/api/auth', authRouter);

    app.use('/api/quiz', quizRouter);
    app.use('/api/takeQuiz', takeQuizRouter);
    app.use('/api/quizReview', quizReviewRouter);

    app.use('/api/reply', replyRouter);
}

module.exports = route;
