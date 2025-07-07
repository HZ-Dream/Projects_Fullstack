import { IoCloseCircleOutline } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import { MdNoteAdd } from 'react-icons/md';
import { FaHandPointRight } from 'react-icons/fa';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';

// Rating
import Rating from '@mui/material/Rating';

// React
import { useRef } from 'react';

// CSS
import styles from './QuizModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const QuizModal = (props) => {
    return (
        <Dialog className={cx('quizModal')} open={true}>
            <Button className="close_" onClick={() => props.closeQuizModal()}>
                <IoCloseCircleOutline />
            </Button>

            <div className="d-flex align-items-center">
                <span>
                    ID Quiz: <b className="ms-2">ZU49VOR</b>
                </span>

                <span className={cx('fieldQuiz')}>
                    Field: <b className="ms-2">Information Technology</b>
                </span>

                <Rating name="read-only" value={4.5} readOnly size="small" precision={0.5} />
            </div>

            <hr />

            <div className="row mt-2">
                <div className="w-100">
                    <h4 className="mb-2 font-weight-bold textOne_line">Internet of Things - IOT (HUBT 2025)</h4>
                    <p className="mt-2">
                        <b>Description:</b> Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada
                        tincidunt. Class aptent taciti sociosqu ad litora torquent
                    </p>

                    <div className={`d-flex align-items-center mt-4 ${cx('actions')}`}>
                        <Button className="btn-round text-capitalize btn-sml" variant="outlined">
                            <FaHandPointRight className="me-2" /> Start Quiz
                        </Button>

                        <Button className="btn-round text-capitalize btn-sml ms-2 me-2" variant="outlined">
                            <FaHeart className="me-2" /> Add Wishlist
                        </Button>

                        <Button className="btn-round text-capitalize btn-sml" variant="outlined">
                            <MdNoteAdd className="me-2" /> Save for Later
                        </Button>
                    </div>

                    <hr />

                    <div className="quizList mt-2">
                        <h4 className="text-center pb-2">Question Preview</h4>
                        <div className={`${cx('quizItem')} mt-2`}>
                            <span>Câu 1: Con rùa có mấy cái chân</span>
                            <ul>
                                <li>1</li>
                                <li>2</li>
                                <li>3</li>
                                <li>4</li>
                            </ul>
                        </div>

                        <div className={`${cx('quizItem')} mt-2`}>
                            <span>Câu 1: Con rùa có mấy cái chân</span>
                            <ul>
                                <li>1</li>
                                <li>2</li>
                                <li>3</li>
                                <li>4</li>
                            </ul>
                        </div>

                        <div className={`${cx('quizItem')} mt-2`}>
                            <span>Câu 1: Con rùa có mấy cái chân</span>
                            <ul>
                                <li>1</li>
                                <li>2</li>
                                <li>3</li>
                                <li>4</li>
                            </ul>
                        </div>

                        <div className={`${cx('quizItem')} mt-2`}>
                            <span>Câu 1: Con rùa có mấy cái chân</span>
                            <ul>
                                <li>1</li>
                                <li>2</li>
                                <li>3</li>
                                <li>4</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default QuizModal;
