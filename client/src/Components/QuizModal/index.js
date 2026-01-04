// React Icons
import { IoCloseCircleOutline } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import { MdNoteAdd } from 'react-icons/md';
import { FaHandPointRight } from 'react-icons/fa';

// MUI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

// Rating
import Rating from '@mui/material/Rating';

// React
import { Link } from 'react-router-dom';

// Format
import MathText from '../../Format/MathText';

// CSS
import styles from './QuizModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const QuizModal = (props) => {
    const quizData = props?.data;

    return (
        <Dialog className={cx('quizModal')} open={props.isOpen}>
            <Button className="close_" onClick={() => props.closeQuizModal()}>
                <IoCloseCircleOutline />
            </Button>

            <div className="d-flex align-items-center">
                <span>
                    ID Quiz: <b className="ms-2">{quizData?.id}</b>
                </span>

                <span className={cx('fieldQuiz')}>
                    Field: <b className="ms-2">{quizData?.field.name}</b>
                </span>

                <Rating name="read-only" value={4.5} readOnly size="small" precision={0.5} />
            </div>

            <hr />

            <div className="row mt-2">
                <div className="w-100">
                    <h4 className="mb-2 font-weight-bold textOne_line">{quizData?.title}</h4>
                    <p className="mt-2">
                        <b>Description:</b> {quizData?.description}
                    </p>

                    <div className={`d-flex align-items-center mt-4 ${cx('actions')}`}>
                        <Button className="btn-round text-capitalize btn-sml" variant="outlined">
                            <Link to={`/quiz/${quizData?.id}`}>
                                <FaHandPointRight className="me-2" /> Quiz Detail
                            </Link>
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
                        {quizData.quiz?.length === 0 ? (
                            <span>No questions available for this quiz.</span>
                        ) : (
                            quizData.quiz.map((quizItem, index) => (
                                <div key={index} className={`${cx('tabQuizItem')} mt-2`}>
                                    <span>
                                        <MathText text={quizItem.questionText} />
                                    </span>
                                    <ul>
                                        {quizItem.options.map((option, idx) => (
                                            <li className="ms-3" key={idx}>
                                                <MathText text={option} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default QuizModal;
