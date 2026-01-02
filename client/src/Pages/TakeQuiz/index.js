// React
import React, { useState, useContext, useEffect, useMemo } from 'react';

// Router
import { useParams, useNavigate } from 'react-router-dom';

// MUI & Icons
import { Button, Dialog, Slide, CircularProgress, Divider, Tooltip, LinearProgress } from '@mui/material';
import {
    IoTimeOutline,
    IoBookmarkOutline,
    IoBookmark,
    IoCheckmarkCircle,
    IoSendOutline,
    IoAlertCircleOutline,
} from 'react-icons/io5';

// API
import { fetchDataFromApi, postData } from '../../utils/api';

// Format
import MathText from '../../Format/MathText';

// Context
import { MyContext } from '../../App';

// Styles
import classNames from 'classnames/bind';
import styles from './TakeQuiz.module.scss';

const cx = classNames.bind(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const TakeQuiz = () => {
    const context = useContext(MyContext);
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [isLoad, setIsLoad] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(null);
    const [markedQuestions, setMarkedQuestions] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi(`/api/quiz/getQuizDetail/${quizId}`)
            .then((res) => {
                setQuizData(res);
                const initialAnswers = res.quiz.map((q) => ({
                    questionId: q._id,
                    selectedOptions: [],
                }));
                setUserAnswers(initialAnswers);
                setTimeLeft(res.duration * 60);
            })
            .catch((err) => console.error('Error:', err));
    }, [quizId]);

    useEffect(() => {
        if (timeLeft === null) return;
        if (timeLeft === 0) {
            finishQuiz();
            return;
        }
        const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    const handleAnswerChange = (questionId, option, isCheckbox) => {
        setUserAnswers((prevAnswers) =>
            prevAnswers.map((ans) => {
                if (ans.questionId === questionId) {
                    let newSelectedOptions;

                    if (isCheckbox) {
                        const isAlreadySelected = ans.selectedOptions.includes(option);
                        if (isAlreadySelected) {
                            newSelectedOptions = ans.selectedOptions.filter((item) => item !== option);
                        } else {
                            newSelectedOptions = [...ans.selectedOptions, option];
                        }
                    } else {
                        newSelectedOptions = [option];
                    }
                    return { ...ans, selectedOptions: newSelectedOptions };
                }
                return ans;
            }),
        );
    };

    const toggleMarkQuestion = (questionId) => {
        setMarkedQuestions((prev) =>
            prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
        );
    };

    const { answeredCount, unansweredCount, progress } = useMemo(() => {
        const answered = userAnswers.filter((ans) => ans.selectedOptions.length > 0).length;
        const total = quizData?.quiz?.length || 1;
        return {
            answeredCount: answered,
            unansweredCount: (quizData?.quiz?.length || 0) - answered,
            progress: (answered / total) * 100,
        };
    }, [userAnswers, quizData]);

    const finishQuiz = async () => {
        setIsLoad(true);
        setIsOpenModal(false);
        const timeTakenInSeconds = quizData.duration * 60 - timeLeft;
        const payload = {
            quizId: quizId,
            userId: context.userData.userId,
            userAnswers: userAnswers,
            duration: timeTakenInSeconds,
        };

        try {
            await postData('/api/takeQuiz/submitQuiz', payload);
            context.setActiveTabs(2);
            navigate(`/quiz/${quizId}`);
        } catch (err) {
            context.handleClickVariant('Submission failed', 'error');
        } finally {
            setIsLoad(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!quizData)
        return (
            <div className={cx('loader')}>
                <CircularProgress />
            </div>
        );

    return (
        <section className={cx('takeQuizWrapper')}>
            <div className="container">
                <div className={cx('quizHeader')}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h4 className="fw-bold mb-0">{quizData.title}</h4>
                        <div className={cx('timerBadge', { warning: timeLeft < 60 })}>
                            <IoTimeOutline />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                    <LinearProgress variant="determinate" value={progress} className={cx('progressBar')} />
                </div>

                <div className="row mt-4">
                    <div className="col-lg-8">
                        {quizData.quiz.map((question, index) => {
                            const isCheckbox = question.correctAnswers.length > 1;
                            const userAnswer = userAnswers.find((a) => a.questionId === question._id);
                            const isMarked = markedQuestions.includes(question._id);

                            return (
                                <div key={question._id} className={cx('questionCard')}>
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <span className={cx('qBadge')}>Question {index + 1}</span>
                                            {/* {isCheckbox && <small className="ms-2 text-muted">(Multiple Choice)</small>} */}
                                        </div>
                                        <Tooltip title="Mark for review">
                                            <Button
                                                onClick={() => toggleMarkQuestion(question._id)}
                                                className={cx('markBtn', { active: isMarked })}
                                            >
                                                {isMarked ? <IoBookmark size={22} /> : <IoBookmarkOutline size={22} />}
                                            </Button>
                                        </Tooltip>
                                    </div>

                                    <h5 className="my-4 fw-semibold">
                                        <MathText text={question.questionText} />
                                    </h5>

                                    {question.questionImage && (
                                        <div className={cx('questionImageWrapper', 'mb-4')}>
                                            <img src={question.questionImage} alt="Question" />
                                        </div>
                                    )}

                                    <div className={cx('optionsGrid')}>
                                        {question.options.map((option, optIndex) => {
                                            const isSelected = userAnswer?.selectedOptions.includes(option);

                                            return (
                                                <label
                                                    key={optIndex}
                                                    className={cx('optionBox', {
                                                        selected: isSelected,
                                                        multiChoice: isCheckbox,
                                                        singleChoice: !isCheckbox,
                                                    })}
                                                    htmlFor={`q_${question._id}_${optIndex}`}
                                                >
                                                    <input
                                                        id={`q_${question._id}_${optIndex}`}
                                                        type={isCheckbox ? 'checkbox' : 'radio'}
                                                        name={
                                                            isCheckbox
                                                                ? `q_${question._id}_${optIndex}`
                                                                : `q_${question._id}`
                                                        }
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            handleAnswerChange(question._id, option, isCheckbox)
                                                        }
                                                        style={{ display: 'none' }}
                                                    />
                                                    <span className={cx('customCheck')}></span>
                                                    <span className={cx('optionContent')}>
                                                        <MathText text={option} />
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="col-lg-4">
                        <div className={cx('sidebarSticky')}>
                            <div className={cx('statusCard')}>
                                <h6 className="fw-bold mb-3">Quiz Summary</h6>
                                <div className={cx('statRow')}>
                                    <span>Answered:</span>
                                    <strong className="text-primary">{answeredCount}</strong>
                                </div>
                                <div className={cx('statRow')}>
                                    <span>Marked:</span>
                                    <strong className="text-warning">{markedQuestions.length}</strong>
                                </div>
                                <div className={cx('statRow')}>
                                    <span>Remaining:</span>
                                    <strong>{unansweredCount}</strong>
                                </div>

                                <Divider className="my-3" />

                                <div className={cx('questionNav')}>
                                    {quizData.quiz.map((q, idx) => {
                                        const isAnswered =
                                            userAnswers.find((a) => a.questionId === q._id)?.selectedOptions.length > 0;
                                        const isMarked = markedQuestions.includes(q._id);
                                        return (
                                            <div
                                                key={idx}
                                                className={cx('navBox', {
                                                    answered: isAnswered,
                                                    marked: isMarked,
                                                })}
                                            >
                                                {idx + 1}
                                            </div>
                                        );
                                    })}
                                </div>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    color="error"
                                    startIcon={<IoSendOutline />}
                                    className="mt-4"
                                    onClick={() => setIsOpenModal(true)}
                                    sx={{ borderRadius: '10px', fontWeight: 'bold' }}
                                >
                                    Submit Quiz
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isOpenModal} onClose={() => setIsOpenModal(false)} TransitionComponent={Transition}>
                <div className={cx('submitModal')}>
                    <IoAlertCircleOutline size={60} className="text-warning mb-3" />
                    <h3>Are you sure?</h3>
                    <p className="text-muted">
                        You have <b>{unansweredCount}</b> questions left. <br />
                        Once submitted, you cannot change your answers.
                    </p>
                    <div className="d-flex gap-3 mt-4 w-100">
                        <Button fullWidth variant="outlined" onClick={() => setIsOpenModal(false)}>
                            Cancel
                        </Button>
                        <Button fullWidth variant="contained" color="error" onClick={finishQuiz} disabled={isLoad}>
                            {isLoad ? <CircularProgress size={24} color="inherit" /> : 'Yes, Submit'}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </section>
    );
};

export default TakeQuiz;
