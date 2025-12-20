import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, CircularProgress, Chip, Divider, Tooltip } from '@mui/material';
import {
    IoTimeOutline,
    IoCheckmarkCircleOutline,
    IoCloseCircleOutline,
    IoAlertCircleOutline,
    IoArrowBack,
} from 'react-icons/io5';
import classNames from 'classnames/bind';
import styles from './TakeQuiz.module.scss';
import { fetchDataFromApi } from '../../utils/api';

const cx = classNames.bind(styles);

const HistoryQuiz = () => {
    const { quizId } = useParams();
    const [quizData, setQuizData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi(`/api/takeQuiz/historyTakenQuiz/${quizId}`)
            .then((res) => {
                setQuizData(res);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Error:', err);
                setIsLoading(false);
            });
    }, [quizId]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading)
        return (
            <div className={cx('loadingCenter')}>
                <CircularProgress />
            </div>
        );

    return (
        <section className={cx('historyWrapper')}>
            <div className="container">
                <div className="dFlexAliJus-center mb-4 w-100">
                    <h2 className="mb-0 fw-bold">Quiz Results</h2>
                </div>

                <div className="row">
                    <div className="col-lg-8">
                        {quizData?.quiz.map((q, index) => {
                            const isMultiple = q.correctAnswers.length > 1;
                            const isCorrect =
                                JSON.stringify(q.yourAnswers.sort()) === JSON.stringify(q.correctAnswers.sort());

                            return (
                                <div
                                    key={index}
                                    className={cx('questionCard', {
                                        correct: isCorrect,
                                        wrong: !isCorrect && q.yourAnswers.length > 0,
                                    })}
                                >
                                    <div className={cx('cardHeader')}>
                                        <span className={cx('qNumber')}>Question {index + 1}</span>
                                        {q.yourAnswers.length === 0 ? (
                                            <Chip label="Skipped" size="small" variant="outlined" />
                                        ) : isCorrect ? (
                                            <Chip
                                                icon={<IoCheckmarkCircleOutline />}
                                                label="Correct"
                                                color="success"
                                                size="small"
                                            />
                                        ) : (
                                            <Chip
                                                icon={<IoCloseCircleOutline />}
                                                label="Incorrect"
                                                color="error"
                                                size="small"
                                            />
                                        )}
                                    </div>

                                    <h5 className="mt-3 mb-4">{q.questionText}</h5>

                                    <div className={cx('optionsList')}>
                                        {q.options.map((option, optIndex) => {
                                            const isUserPicked = q.yourAnswers.includes(option);
                                            const isRightAns = q.correctAnswers.includes(option);

                                            let optionState = '';
                                            if (isRightAns) optionState = 'correctOption';
                                            else if (isUserPicked && !isRightAns) optionState = 'wrongOption';

                                            return (
                                                <div key={optIndex} className={cx('optionItem', optionState)}>
                                                    <div className={cx('radioCheck')}>
                                                        <input
                                                            type={isMultiple ? 'checkbox' : 'radio'}
                                                            checked={isUserPicked}
                                                            disabled
                                                            readOnly
                                                        />
                                                    </div>
                                                    <div className={cx('optionText')}>
                                                        {option}
                                                        {isRightAns && (
                                                            <span className={cx('ansLabel')}>Correct Answer</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="col-lg-4">
                        <div className={cx('summarySidebar')}>
                            <div className={cx('scoreBox')}>
                                <p className="mb-1">Final Score</p>
                                <h3 className="text-white">{quizData.score}</h3>
                            </div>

                            <div className={cx('statsGrid')}>
                                <div className={cx('statItem')}>
                                    <IoTimeOutline className="text-primary" />
                                    <div>
                                        <span>Time Spent</span>
                                        <strong>{formatTime(quizData.duration)}</strong>
                                    </div>
                                </div>
                                <div className={cx('statItem')}>
                                    <IoCheckmarkCircleOutline className="text-success" />
                                    <div>
                                        <span>Correct</span>
                                        <strong>{quizData.correct}</strong>
                                    </div>
                                </div>
                                <div className={cx('statItem')}>
                                    <IoCloseCircleOutline className="text-danger" />
                                    <div>
                                        <span>Incorrect</span>
                                        <strong>{quizData.incorrect}</strong>
                                    </div>
                                </div>
                                <div className={cx('statItem')}>
                                    <IoAlertCircleOutline className="text-secondary" />
                                    <div>
                                        <span>Skipped</span>
                                        <strong>{quizData.skip}</strong>
                                    </div>
                                </div>
                            </div>

                            <Divider className="my-3" />

                            <p className="fw-bold mb-2">Question Overview</p>
                            <div className={cx('questionGrid')}>
                                {quizData.quiz.map((q, idx) => {
                                    const isCorrect =
                                        JSON.stringify(q.yourAnswers.sort()) ===
                                        JSON.stringify(q.correctAnswers.sort());
                                    const status =
                                        q.yourAnswers.length === 0 ? 'skip' : isCorrect ? 'correct' : 'wrong';
                                    return (
                                        <Tooltip title={`Question ${idx + 1}: ${status}`} key={idx}>
                                            <div className={cx('gridBox', status)}>{idx + 1}</div>
                                        </Tooltip>
                                    );
                                })}
                            </div>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                className="mt-4"
                                component={Link}
                                to={`/quiz/${quizData.quizId}`}
                                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 'bold' }}
                            >
                                Retake This Quiz
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HistoryQuiz;
