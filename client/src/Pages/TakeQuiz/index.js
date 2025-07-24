// Icons, Button
import { IoCloseCircleOutline } from 'react-icons/io5';
import Button from '@mui/material/Button';

// Material UI
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

// React
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Context
import { MyContext } from '../../App';

// CSS
import styles from './TakeQuiz.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const TakeQuiz = () => {
    const context = useContext(MyContext);
    const [isOpenModal, setIsOpenModal] = useState(false);

    useEffect(() => {
        context.setIsHeaderFooterShow(false);
    }, []);

    return (
        <section className={`section ${cx('takeQuiz')}`}>
            <div className="row">
                <h4 className="text-center">Internet of Things - IOT (HUBT 2025)</h4>
                <div className="col-md-9">
                    <div className="card p-3 ms-4">
                        <div className={`${cx('quizItem')} mb-3`}>
                            <div className="dFlexAli-center">
                                <span className="quizNumber">1</span>
                                <p className="fz17 mb-0">Con gà có mấy cái chân?</p>
                            </div>
                            <ul className="list list-inline ms-auto mb-0 pl40">
                                <li>
                                    <input type="radio" name="answerQuizOne" />
                                    <span>1</span>
                                </li>
                                <li>
                                    <input type="radio" name="answerQuizOne" />
                                    <span>2</span>
                                </li>
                                <li>
                                    <input type="radio" name="answerQuizOne" />
                                    <span>3</span>
                                </li>
                                <li>
                                    <input type="radio" name="answerQuizOne" />
                                    <span>4</span>
                                </li>
                            </ul>
                        </div>
                        <div className={`${cx('quizItem')} mb-3`}>
                            <div className="dFlexAli-center">
                                <span className="quizNumber">2</span>
                                <p className="fz17 mb-0">SGP có vô địch không?</p>
                            </div>
                            <ul className="list list-inline ms-auto mb-0 pl40">
                                <li>
                                    <input type="radio" name="answerQuizTwo" />
                                    <span>Có</span>
                                </li>
                                <li>
                                    <input type="radio" name="answerQuizTwo" />
                                    <span>Không</span>
                                </li>
                            </ul>
                        </div>
                        <div className={`${cx('quizItem')} mb-3`}>
                            <div className="dFlexAli-center">
                                <span className="quizNumber active">3</span>
                                <p className="fz17 mb-0">Cây đèn giao thông có màu nào?</p>
                            </div>
                            <ul className="list list-inline ms-auto mb-0 pl40">
                                <li>
                                    <input type="checkbox" name="answerQuizThree" />
                                    <span>Đen</span>
                                </li>
                                <li>
                                    <input type="checkbox" name="answerQuizThree" />
                                    <span>Vàng</span>
                                </li>
                                <li>
                                    <input type="checkbox" name="answerQuizThree" />
                                    <span>Đỏ</span>
                                </li>
                                <li>
                                    <input type="checkbox" name="answerQuizThree" />
                                    <span>Xanh</span>
                                </li>
                            </ul>
                        </div>
                        <div className={`${cx('quizItem')} mb-3`}>
                            <div className="dFlexAli-center">
                                <span className="quizNumber">1</span>
                                <p className="fz17 mb-0">Con gà có mấy cái chân?</p>
                            </div>
                            <ul className="list list-inline ms-auto mb-0 pl40">
                                <li>
                                    <input type="radio" name="answerQuizOne" />
                                    <span>1</span>
                                </li>
                                <li>
                                    <input type="radio" name="answerQuizOne" />
                                    <span>2</span>
                                </li>
                                <li>
                                    <input type="radio" name="answerQuizOne" />
                                    <span>3</span>
                                </li>
                                <li>
                                    <input type="radio" name="answerQuizOne" />
                                    <span>4</span>
                                </li>
                            </ul>
                        </div>
                        <div className={`${cx('quizItem')} mb-3`}>
                            <div className="dFlexAli-center">
                                <span className="quizNumber">2</span>
                                <p className="fz17 mb-0">SGP có vô địch không?</p>
                            </div>
                            <ul className="list list-inline ms-auto mb-0 pl40">
                                <li>
                                    <input type="radio" name="answerQuizTwo" />
                                    <span>Có</span>
                                </li>
                                <li>
                                    <input type="radio" name="answerQuizTwo" />
                                    <span>Không</span>
                                </li>
                            </ul>
                        </div>
                        <div className={`${cx('quizItem')} mb-3`}>
                            <div className="dFlexAli-center">
                                <span className="quizNumber active">3</span>
                                <p className="fz17 mb-0">Cây đèn giao thông có màu nào?</p>
                            </div>
                            <ul className="list list-inline ms-auto mb-0 pl40">
                                <li>
                                    <input type="checkbox" name="answerQuizThree" />
                                    <span>Đen</span>
                                </li>
                                <li>
                                    <input type="checkbox" name="answerQuizThree" />
                                    <span>Vàng</span>
                                </li>
                                <li>
                                    <input type="checkbox" name="answerQuizThree" />
                                    <span>Đỏ</span>
                                </li>
                                <li>
                                    <input type="checkbox" name="answerQuizThree" />
                                    <span>Xanh</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className={`card p-3 me-4 ${cx('infoProcess')}`}>
                        <div className="dFlexAli-center mb-3">
                            <span>Time Left</span>
                            <span className="ms-auto text-red fw-bold">18:25</span>
                        </div>

                        <div className="dFlexAli-center mb-3">
                            <span>Questions Answered</span>
                            <span className="ms-auto text-red fw-bold">18</span>
                        </div>

                        <div className="dFlexAli-center mb-3">
                            <span>Questions Marked</span>
                            <span className="ms-auto text-red fw-bold">8</span>
                        </div>

                        <div className="dFlexAli-center mb-3">
                            <span>Questions Left</span>
                            <span className="ms-auto text-red fw-bold">5</span>
                        </div>

                        <hr />

                        <div className={`${cx('listQuiz')} mt-2`}>
                            <div className={cx('listItem', 'correct')}>1</div>
                            <div className={cx('listItem', 'incorrect')}>2</div>
                            <div className={cx('listItem', 'mark')}>3</div>
                            <div className={cx('listItem', 'check')}>4</div>
                            <div className={cx('listItem')}>5</div>
                            <div className={cx('listItem')}>6</div>
                            <div className={cx('listItem')}>7</div>
                            <div className={cx('listItem')}>8</div>
                            <div className={cx('listItem')}>9</div>
                            <div className={cx('listItem')}>10</div>
                        </div>

                        <Button onClick={() => setIsOpenModal(true)} className="btn-red btn-lg btn-big mt-4 fw-bold">
                            Finish Quiz
                        </Button>

                        <Dialog
                            open={isOpenModal}
                            onClose={() => setIsOpenModal(false)}
                            slots={{
                                transition: Transition,
                            }}
                            className="locationModal"
                        >
                            <div className={cx('modal')}>
                                <h4 className="mb-0 text-danger">Are you sure you completed the quiz?</h4>
                                <hr />
                                <p className="fz17">
                                    You currently have <b className="text-red">4 marked questions</b> and
                                    <b className="text-red"> 2 unanswered questions</b>
                                </p>
                                <div className={cx('modalBtn')}>
                                    <Button className="btn-primary btn-lg btn-big">
                                        <Link to="/quiz/1" onClick={() => context.setIsHeaderFooterShow(true)}>
                                            Finish
                                        </Link>
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
