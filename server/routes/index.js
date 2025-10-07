const authRouter = require('./auth');
const quizRouter = require('./quiz');

function route(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/quiz', quizRouter);
}

module.exports = route;
