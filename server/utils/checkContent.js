const removeAccents = require('remove-accents');

// Format
const normalize = (text = '') => {
    return removeAccents(text.toLowerCase());
};

// Check Text
const checkText = (text, keys) => {
    const content = normalize(text);
    let found = [];

    keys.forEach((k) => {
        const keyword = normalize(k.name);

        const regex = new RegExp(`\\b${keyword}\\b`, 'i');

        if (regex.test(content)) {
            found.push(k.name);
        }
    });

    return found;
};

// Check All Quiz
const checkQuizContent = (quiz, keys) => {
    let violations = [];

    // title + description
    violations.push(...checkText(quiz.title, keys));
    violations.push(...checkText(quiz.description, keys));

    // questions
    quiz.quiz.forEach((q) => {
        violations.push(...checkText(q.questionText, keys));

        q.options.forEach((opt) => {
            violations.push(...checkText(opt, keys));
        });

        q.correctAnswers.forEach((ans) => {
            violations.push(...checkText(ans, keys));
        });
    });

    return [...new Set(violations)];
};

module.exports = {
    checkQuizContent,
};
