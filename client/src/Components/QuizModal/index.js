// React Icons
import { IoCloseCircleOutline } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import { FaHandPointRight } from 'react-icons/fa';

// MUI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

// Rating
import Rating from '@mui/material/Rating';

// React
import { useContext } from 'react';
import { Link } from 'react-router-dom';

// Format
import MathText from '../../Format/MathText';

// API
import { postData } from '../../utils/api';

// CSS
import styles from './QuizModal.module.scss';
import classNames from 'classnames/bind';

import { MyContext } from '../../App';

const cx = classNames.bind(styles);

const QuizModal = (props) => {
    const context = useContext(MyContext);
    const quizData = props?.data;

    const changeHeartColor = () => {
        if (context.userData?.wishlist?.includes(quizData.id) || quizData.isInWishlist) {
            return { color: 'red' };
        }
        return { color: 'gray' };
    };

    const handleHeartClick = (e) => {
        e.preventDefault();

        if (!context.userData || !context.userData.userId) {
            context.handleClickVariant('Please sign in to add to wishlist', 'warning');
            return;
        }

        const data = {
            userId: context.userData.userId,
            quizId: quizData.id,
        };

        postData('/api/user/addToWishlist', data)
            .then((res) => {
                context.updateWishlist(res.wishlist);
            })
            .catch((err) => {
                context.handleClickVariant('Failed to add quiz to wishlist', 'error');
            });
    };

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

                <Rating name="read-only" value={quizData?.rate} readOnly size="small" precision={0.1} />
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

                        <Button
                            onClick={handleHeartClick}
                            className="btn-round text-capitalize btn-sml ms-2 me-2"
                            variant="outlined"
                        >
                            <FaHeart className="me-2" style={changeHeartColor()} />
                            <span style={changeHeartColor()}>Add Wishlist</span>
                        </Button>
                    </div>

                    <hr />

                    <div className="quizList mt-2">
                        <h4 className="text-center pb-2">Question Preview</h4>
                        {quizData?.status === '1' ? (
                            <span>This is a private quiz, you cannot preview it.</span>
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
