const authRouter = require('./auth');
const quizRouter = require('./quiz');
const takeQuizRouter = require('./takeQuiz');

function route(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/quiz', quizRouter);
    app.use('/api/takeQuiz', takeQuizRouter);
}

module.exports = route;
