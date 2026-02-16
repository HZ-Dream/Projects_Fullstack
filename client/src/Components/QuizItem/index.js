// Icons, Button
import { RiNumbersFill } from 'react-icons/ri';
import { MdQuiz } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa';
import { LuScanEye } from 'react-icons/lu';
import { FaUserEdit } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa';
import Button from '@mui/material/Button';

// Img
import AvatarImg from '../../assets/images/avatar.jpg';

// Rating
import Rating from '@mui/material/Rating';

// React
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

// Components
import QuizModal from '../QuizModal';

// API
import { postData } from '../../utils/api';

// CSS
import styles from './QuizItem.module.scss';
import classNames from 'classnames/bind';

import { MyContext } from '../../App';

const cx = classNames.bind(styles);

const QuizItem = (props) => {
    const context = useContext(MyContext);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [quizData, setQuizData] = useState(props.data);

    const viewQuizDetails = (id) => {
        setIsOpenModal(true);
    };

    const closeQuizModal = () => {
        setIsOpenModal(false);
    };

    const formattedDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

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

                if (props.onRemoveFromWishlist) {
                    props.onRemoveFromWishlist(quizData._id);
                }
            })
            .catch((err) => {
                context.handleClickVariant('Failed to add quiz to wishlist', 'error');
            });
    };

    return (
        <div className={`item ${cx('productItem', props.className, props.itemView)}`}>
            <Link to={`/quiz/${quizData?.id}`}>
                <div className={cx('imgWrapper')}>
                    <img className="w-100" src={quizData?.image} alt={quizData?.title} />
                </div>

                <div className={cx('info')}>
                    <h4 className={cx('nameQuiz')}>{quizData?.title}</h4>
                    <span title="dd/MM/yyyy" className="d-flex align-items-center">
                        <FaClock />
                        <span className="ms-1">{formattedDate(quizData?.updatedAt)}</span>
                    </span>
                    <div title="rate" className="d-flex align-items-center">
                        <Rating
                            className="mt-2 mb-2"
                            name="read-only"
                            value={quizData?.rate}
                            readOnly
                            size="small"
                            precision={0.1}
                        />
                        <span className="ms-2 d-flex align-items-center">
                            <div className="me-1">{quizData?.totalRate}</div>
                            <RiNumbersFill />
                        </span>
                    </div>

                    <div className="d-flex">
                        <span title="Number of Quiz" className={`${cx('numberOfQuiz')} d-flex align-items-center`}>
                            <MdQuiz />
                            <span className="text ms-1">{quizData?.quiz?.length}</span>
                        </span>
                        <span title="Attempts" className={`${cx('numberOfUser')} ms-3 d-flex align-items-center`}>
                            <FaUserEdit />
                            <span className="text ms-1">{quizData?.attempts}</span>
                        </span>
                    </div>

                    <div className="d-flex align-items-center">
                        <img className={cx('imgAvatar')} src={quizData?.userId?.image} alt="Avatar" />
                        <span className="textOne_line">{quizData?.userId?.name}</span>
                    </div>
                </div>
            </Link>

            <div className={cx('actions')}>
                <Button onClick={handleHeartClick}>
                    <FaHeart style={changeHeartColor()} />
                </Button>
                <Button onClick={() => viewQuizDetails(1)}>
                    <LuScanEye />
                </Button>
            </div>
            {isOpenModal && <QuizModal data={quizData} isOpen={isOpenModal} closeQuizModal={closeQuizModal} />}
        </div>
    );
};

export default QuizItem;
