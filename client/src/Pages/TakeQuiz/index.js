// Icons, Button
import { IoCloseCircleOutline, IoBookmarkOutline, IoBookmark } from 'react-icons/io5';
import Button from '@mui/material/Button';

// Material UI
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import CircularProgress from '@mui/material/CircularProgress';

// React
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// Context
import { MyContext } from '../../App';

// CSS
import styles from './TakeQuiz.module.scss';
import classNames from 'classnames/bind';

// API
import { fetchDataFromApi, postData } from '../../utils/api';

const cx = classNames.bind(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const TakeQuiz = () => {
    const context = useContext(MyContext);
    let { quizId } = useParams();
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
            .catch((err) => {
                console.error('Error fetching quiz data:', err);
            });
    }, [quizId]);

    useEffect(() => {
        if (timeLeft === null) return;
        if (timeLeft === 0) {
            finishQuiz();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    const handleAnswerChange = (questionId, option, isCheckbox) => {
        setUserAnswers((prevAnswers) => {
            const newAnswers = JSON.parse(JSON.stringify(prevAnswers));
            const questionIndex = newAnswers.findIndex((ans) => ans.questionId === questionId);

            if (questionIndex === -1) {
                console.error('Question not found in userAnswers state!');
                return prevAnswers;
            }

            const currentSelectedOptions = newAnswers[questionIndex].selectedOptions;

            if (isCheckbox) {
                const isAlreadySelected = currentSelectedOptions.includes(option);

                if (isAlreadySelected) {
                    newAnswers[questionIndex].selectedOptions = currentSelectedOptions.filter(
                        (item) => item !== option,
                    );
                } else {
                    newAnswers[questionIndex].selectedOptions.push(option);
                }
            } else {
                newAnswers[questionIndex].selectedOptions = [option];
            }

            return newAnswers;
        });
    };

    const toggleMarkQuestion = (questionId) => {
        setMarkedQuestions((prev) =>
            prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
        );
    };

    const { answeredCount, unansweredCount } = useMemo(() => {
        const answered = userAnswers.filter((ans) => ans.selectedOptions.length > 0).length;
        return {
            answeredCount: answered,
            unansweredCount: (quizData?.quiz?.length || 0) - answered,
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
            const res = await postData('/api/takeQuiz/submitQuiz', payload);
            context.setActiveTabs(2);
            navigate(`/quiz/${quizId}`);
        } catch (err) {
            const errorMessage = err.response?.data?.msg || 'An error occurred while submitting.';
            context.handleClickVariant(errorMessage, 'error');
        } finally {
            setIsLoad(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <section className={`section ${cx('takeQuiz')}`}>
            {isLoad && (
                <div className="loading_overlay">
                    <CircularProgress />
                </div>
            )}
            <div className="row">
                <h4 className="text-center">{quizData?.title}</h4>
                <div className="col-md-9">
                    <div className="card p-3 ms-4">
                        {quizData?.quiz.map((question, index) => {
                            const isCheckbox = question.correctAnswers.length > 1;
                            const userAnswer = userAnswers.find((a) => a.questionId === question._id);
                            const isMarked = markedQuestions.includes(question._id);

                            return (
                                <div key={question._id} className={`${cx('quizItem')} mb-4`}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <span className="quizNumber">{index + 1}</span>
                                            <p className="fz17 mb-0">{question.questionText}</p>
                                        </div>
                                        <Button
                                            onClick={() => toggleMarkQuestion(question._id)}
                                            title="Mark for review"
                                        >
                                            {isMarked ? (
                                                <IoBookmark size={24} color="orange" />
                                            ) : (
                                                <IoBookmarkOutline size={24} />
                                            )}
                                        </Button>
                                    </div>
                                    <ul className="list list-inline ms-auto mb-0 pl40 mt-2">
                                        {question.options.map((option, optIndex) => (
                                            <li key={optIndex}>
                                                <input
                                                    className="me-2"
                                                    type={isCheckbox ? 'checkbox' : 'radio'}
                                                    name={`answerQuiz_${question._id}`}
                                                    id={`answer_${question._id}_${optIndex}`}
                                                    value={option}
                                                    checked={userAnswer?.selectedOptions.includes(option)}
                                                    onChange={() =>
                                                        handleAnswerChange(question._id, option, isCheckbox)
                                                    }
                                                />
                                                <label htmlFor={`answer_${question._id}_${optIndex}`}>{option}</label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="col-md-3">
                    <div className={`card p-3 me-4 ${cx('infoProcess')}`}>
                        <div className="dFlexAli-center mb-3">
                            <span>Time Left</span>
                            <span className="ms-auto text-red fw-bold">{formatTime(timeLeft)}</span>
                        </div>
                        <div className="dFlexAli-center mb-3">
                            <span>Questions Answered</span>
                            <span className="ms-auto text-red fw-bold">{answeredCount}</span>
                        </div>
                        <div className="dFlexAli-center mb-3">
                            <span>Questions Marked</span>
                            <span className="ms-auto text-red fw-bold">{markedQuestions.length}</span>
                        </div>
                        <div className="dFlexAli-center mb-3">
                            <span>Questions Left</span>
                            <span className="ms-auto text-red fw-bold">{unansweredCount}</span>
                        </div>
                        <hr />
                        <div className={`${cx('listQuiz')} mt-2`}>
                            {quizData?.quiz.map((q, index) => {
                                const isAnswered =
                                    userAnswers.find((a) => a.questionId === q._id)?.selectedOptions.length > 0;
                                const isMarked = markedQuestions.includes(q._id);
                                return (
                                    <div
                                        key={q._id}
                                        className={cx('listItem', {
                                            check: isAnswered,
                                            mark: isMarked,
                                        })}
                                    >
                                        <span>{index + 1}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <Button
                            onClick={() => setIsOpenModal(true)}
                            className="btn-red btn-lg btn-big mt-4 fw-bold text-capitalize"
                        >
                            Finish Quiz
                        </Button>

                        <Dialog
                            open={isOpenModal}
                            onClose={() => setIsOpenModal(false)}
                            slots={{ transition: Transition }}
                            className="locationModal"
                        >
                            <div className={cx('modal')}>
                                <h4 className="mb-0 text-danger">Are you sure you want to finish the quiz?</h4>
                                <hr />
                                <p className="fz17">
                                    You currently have{' '}
                                    <b className="text-red">{markedQuestions.length} marked questions</b> and
                                    <b className="text-red"> {unansweredCount} unanswered questions</b>.
                                </p>
                                <div className={cx('modalBtn')}>
                                    <Button
                                        disabled={isLoad === true ? true : false}
                                        onClick={finishQuiz}
                                        className="btn-primary btn-lg btn-big"
                                    >
                                        <span className="dFlexAli-center me-2">Finish</span>
                                        {isLoad === true && (
                                            <CircularProgress
                                                className="loader"
                                                color="inherit"
                                                style={{ width: 20, height: 20 }}
                                            />
                                        )}
                                    </Button>
                                    <Button
                                        className="btn-white btn-lg btn-big ms-3"
                                        onClick={() => setIsOpenModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TakeQuiz;
