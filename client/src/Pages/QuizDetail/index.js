// Icons, Button
import { MdQuiz } from 'react-icons/md';
import { RiNumbersFill } from 'react-icons/ri';
import { FaClock } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';
import { MdNoteAdd } from 'react-icons/md';
import { FaReply } from 'react-icons/fa';
import { RiDeleteBack2Fill } from 'react-icons/ri';

// Img
import defaultAvatar from '../../assets/images/default.jpg';

// Material UI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';

// React
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// Components
import RelatedQuizzes from './RelatedQuizzes';

// Format
import MathText from '../../Format/MathText';

// API
import { deleteData, fetchDataFromApi, postData } from '../../utils/api';

// CSS
import styles from './QuizDetail.module.scss';
import classNames from 'classnames/bind';

import { MyContext } from '../../App';
const cx = classNames.bind(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const QuizDetail = () => {
    const context = useContext(MyContext);
    let { quizId } = useParams();
    const navigate = useNavigate();
    const { userData } = useContext(MyContext);

    const [currUserId, setCurrUserId] = useState();
    const [isLoad, setIsLoad] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [activeTabs, setActiveTabs] = useState(0);

    const [quizData, setQuizData] = useState(null);
    const [quizList, setQuizList] = useState(null);
    const [passField, setPassField] = useState('');
    const [takenQuiz, setTakenQuiz] = useState(null);

    const [reviewData, setReviewData] = useState([]);
    const [replyData, setReplyData] = useState([]);

    // State cho form review
    const [rate, setRate] = useState(0);
    const [reviews, setReviews] = useState({
        quizId: quizId,
        review: '',
        userName: '',
        rating: 0,
    });

    const [rateData, setRateData] = useState({
        averageRating: 0,
        totalReviews: 0,
        fiveStarCount: 0,
        fourStarCount: 0,
        threeStarCount: 0,
        twoStarCount: 0,
        oneStarCount: 0,
    });

    const [percenRateData, setPercenRateData] = useState({
        fiveStarPercen: 0,
        fourStarPercen: 0,
        threeStarPercen: 0,
        twoStarPercen: 0,
        oneStarPercen: 0,
    });

    // State cho phần reply
    const [replyText, setReplyText] = useState('');
    const [openReplyForms, setOpenReplyForms] = useState([]);
    const [showReplyInput, setShowReplyInput] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);

        if (context.activeTabs !== null) {
            setActiveTabs(context.activeTabs);
            context.setActiveTabs(null);
        }

        fetchDataFromApi(`/api/quiz/getQuizDetail/${quizId}`)
            .then((res) => {
                setQuizData(res);
                setQuizList(res.quiz);
            })
            .catch((err) => {
                console.error('Error fetching quiz data:', err);
            });

        loadReviews();

        const userId = userData?.userId;

        if (userId) {
            setCurrUserId(userId);

            postData(`/api/takeQuiz/getTakenQuiz/${quizId}`, { userId })
                .then((res) => {
                    setTakenQuiz(res);
                })
                .catch((err) => {
                    console.error('Error fetching taken quiz history:', err);
                    setTakenQuiz([]);
                });
        }

        fetchDataFromApi(`/api/quizReview/getRates/${quizId}`)
            .then((res) => {
                setRateData(res);

                setPercenRateData({
                    fiveStarPercen: formatPercentage(res.fiveStarCount, res.totalReviews),
                    fourStarPercen: formatPercentage(res.fourStarCount, res.totalReviews),
                    threeStarPercen: formatPercentage(res.threeStarCount, res.totalReviews),
                    twoStarPercen: formatPercentage(res.twoStarCount, res.totalReviews),
                    oneStarPercen: formatPercentage(res.oneStarCount, res.totalReviews),
                });
            })
            .catch((err) => {
                console.error('Error fetching rate data:', err);
                setRateData({
                    averageRating: 0,
                    totalReviews: 0,
                    fiveStarCount: 0,
                    fourStarCount: 0,
                    threeStarCount: 0,
                    twoStarCount: 0,
                    oneStarCount: 0,
                });
            });
    }, [quizId, userData?.userId, context]);

    const loadReviews = useCallback(() => {
        fetchDataFromApi(`/api/quizReview/getReviews/${quizId}`)
            .then((res) => {
                setReviewData(res.reviews);
                setReplyData(res.replies);
            })
            .catch((err) => {
                console.error('Error fetching review data:', err);
                setReviewData([]);
            });
    }, [quizId]);

    const loadRateData = useCallback(() => {
        fetchDataFromApi(`/api/quizReview/getRates/${quizId}`)
            .then((res) => {
                setRateData(res);

                setPercenRateData({
                    fiveStarPercen: formatPercentage(res.fiveStarCount, res.totalReviews),
                    fourStarPercen: formatPercentage(res.fourStarCount, res.totalReviews),
                    threeStarPercen: formatPercentage(res.threeStarCount, res.totalReviews),
                    twoStarPercen: formatPercentage(res.twoStarCount, res.totalReviews),
                    oneStarPercen: formatPercentage(res.oneStarCount, res.totalReviews),
                });
            })
            .catch((err) => {
                console.error('Error fetching rate data:', err);
                setRateData({
                    averageRating: 0,
                    totalReviews: 0,
                    fiveStarCount: 0,
                    fourStarCount: 0,
                    threeStarCount: 0,
                    twoStarCount: 0,
                    oneStarCount: 0,
                });
            });
    }, [quizId]);

    const handleChange = (event) => {
        setPassField(event.target.value);
    };

    const formattedDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const formatDuration = (totalSeconds) => {
        if (isNaN(totalSeconds) || totalSeconds < 0) {
            return '00:00';
        }

        const minutes = Math.floor(totalSeconds / 60);

        const seconds = totalSeconds % 60;

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    };

    const formatPercentage = (score, total) => {
        if (total === 0) return '0%';
        const percentage = (score / total) * 100;
        return `${percentage.toFixed(1)}%`;
    };

    const confirmPassword = () => {
        const userId = userData?.userId;

        if (!userId) {
            context.handleClickVariant('You need to log in!', 'error');
            return;
        }

        if (passField.trim() === '' || passField === null) {
            context.handleClickVariant('Please enter the password!', 'error');
            return;
        }

        setIsLoad(true);

        postData(`/api/takeQuiz/checkPassword/${quizId}`, { password: passField })
            .then((res) => {
                setTimeout(() => {
                    setIsLoad(false);
                    navigate(`/takeQuiz/${quizId}`);
                }, 1000);
            })
            .catch((err) => {
                if (err.response && err.response.data && err.response.data.msg) {
                    context.handleClickVariant(err.response.data.msg, 'error');

                    setIsLoad(false);
                } else {
                    context.handleClickVariant('An unexpected error occurred!', 'error');
                }
            });
    };

    const startQuiz = () => {
        const userId = userData?.userId;

        console.log(userId);

        if (userId) {
            setIsLoad(true);
            setTimeout(() => {
                setIsLoad(false);
                navigate(`/takeQuiz/${quizId}`);
            }, 1000);
        } else {
            context.handleClickVariant('You need to log in!', 'error');
            return;
        }
    };

    // Handle review
    const onChangeInput = (e) => {
        setReviews(() => ({
            ...reviews,
            [e.target.name]: e.target.value,
        }));
    };

    const validateSubmit = () => {
        const userId = userData?.userId;

        if (userId) {
            if (reviews.userName.trim() === '' || reviews.review.trim() === '' || rate === 0) {
                context.handleClickVariant('Please fill in all the fields and provide a rating!', 'warning');
                return false;
            }

            reviews.userId = userId;
            reviews.userImage = userData?.userImage || '';

            return true;
        } else {
            context.handleClickVariant('You need to log in to submit a review!', 'error');
            return false;
        }
    };

    const submitReview = (e) => {
        e.preventDefault();

        if (!validateSubmit()) {
            return;
        }

        reviews.rating = rate;

        console.log('Review to submit:', reviews);

        postData('/api/quizReview/submitReview', reviews)
            .then((res) => {
                context.handleClickVariant('Review submitted successfully!', 'success');
                setReviews({
                    ...reviews,
                    review: '',
                    userName: '',
                });
                setRate(0);

                loadReviews();
                loadRateData();
            })
            .catch((err) => {
                console.error('Error submitting review:', err);
                context.handleClickVariant('Failed to submit review. Please try again later.', 'error');
            });
    };

    // Handle reply
    const openReply = (parentId) => {
        setOpenReplyForms((prev) => (prev.includes(parentId) ? prev : [...prev, parentId]));
        setShowReplyInput(true);
        setReplyText('');
    };

    const cancelReply = (parentId) => {
        setOpenReplyForms((prev) => prev.filter((id) => id !== parentId));
        setShowReplyInput(false);
        setReplyText('');
    };

    const submitReply = (e, parentId) => {
        e.preventDefault();

        const userId = userData?.userId;
        if (!userId) {
            context.handleClickVariant('You need to log in to reply!', 'error');
            return;
        }

        if (replyText.trim() === '') {
            context.handleClickVariant('Reply cannot be empty!', 'warning');
            return;
        }

        const payload = {
            reviewId: quizId,
            parentReplyId: parentId,
            userId: userId,
            userName: userData?.name || 'Anonymous',
            userImage: userData?.userImage || '',
            replyText: replyText.trim(),
        };

        postData('/api/reply/submitReply', payload)
            .then(() => {
                context.handleClickVariant('Reply submitted successfully!', 'success');
                setReplyText('');
                cancelReply(parentId);
                loadReviews();
            })
            .catch((err) => {
                console.error('Error submitting reply:', err);
                context.handleClickVariant('Failed to submit reply!', 'error');
            });
    };

    const renderReplies = (parentId) => {
        const replies = replyData.filter((r) => r.parentReplyId === parentId);
        if (replies.length === 0) return null;

        return replies.map((replyItem) => (
            <div key={replyItem._id} className={`mb-3 ms-3`}>
                <div className={`card p-3 ${cx('reviewsCard')} flex-row`}>
                    <div className="image">
                        <div className={cx('rounded-circle')}>
                            <img src={replyItem.userImage === '' ? defaultAvatar : replyItem.userImage} alt="User" />
                        </div>
                        <span className="text-g d-block text-center fw-bold">{replyItem.userName}</span>
                    </div>

                    <div className={`${cx('info')} ps-3`}>
                        <div className="dFlexAli-center w-100">
                            <h6 className="text-light">{formattedDate(replyItem.updatedAt)}</h6>

                            <div className="dFlexAli-center ms-auto">
                                <Button
                                    onClick={() => openReply(replyItem._id)}
                                    className="btn-sm btn-round btn-green btn-hover"
                                >
                                    <FaReply />
                                </Button>

                                {replyItem.userId === currUserId && (
                                    <Button
                                        onClick={() => deleteComment('reply', replyItem._id)}
                                        className="btn-sm btn-round btn-red btn-hover ms-2"
                                    >
                                        <RiDeleteBack2Fill />
                                    </Button>
                                )}
                            </div>
                        </div>

                        <p>{replyItem.replyText}</p>
                    </div>
                </div>

                {/* form reply ngay dưới reply này */}
                {openReplyForms.includes(replyItem._id) && (
                    <form onSubmit={(e) => submitReply(e, replyItem._id)} className="mt-2 ps-4 ms-4">
                        <textarea
                            className="form-control"
                            placeholder="Write your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            required
                        />
                        <div className="mt-2">
                            <Button type="submit" className="btn-green btn-round btn-sm">
                                Submit
                            </Button>
                            <Button
                                type="button"
                                onClick={() => cancelReply(replyItem._id)}
                                className="btn-gray btn-round btn-sm ms-2 text-capitalize"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}

                {renderReplies(replyItem._id)}
            </div>
        ));
    };

    const deleteComment = (type, id) => {
        console.log(type, id);

        if (type === 'review') {
            deleteData('/api/quizReview/deleteReview/', id)
                .then((res) => {
                    context.handleClickVariant('Review deleted successfully!', 'success');

                    loadReviews();
                })
                .catch((err) => {
                    console.error('Error delete review:', err);
                    context.handleClickVariant('Failed to delete review!', 'error');
                });
        } else {
            deleteData('/api/reply/deleteReply/', id)
                .then((res) => {
                    context.handleClickVariant('Reply deleted successfully!', 'success');

                    loadReviews();
                })
                .catch((err) => {
                    console.error('Error delete reply:', err);
                    context.handleClickVariant('Failed to delete reply!', 'error');
                });
        }
    };

    return (
        <>
            <section className={`productDetails ${cx('section')}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 ps-5">
                            <h3 className="hd text-capitalize">{quizData?.title}</h3>
                            <ul className="list list-inline dFlexAli-center">
                                <li className="list-inline-item">
                                    <div className="dFlexAli-center">
                                        <span className="text-light me-1">ID Quiz:</span>
                                        <span>{quizData?._id}</span>
                                    </div>
                                </li>

                                <li className="list-inline-item">
                                    <div className="dFlexAli-center">
                                        <span className="text-light me-1">Field:</span>
                                        <span>{quizData?.field}</span>
                                    </div>
                                </li>
                            </ul>

                            <div className="dFlexAli-center mb-2">
                                <MdQuiz />
                                <span className="mx-2">Number of Questions:</span>
                                <b>{quizList?.length}</b>
                            </div>

                            <div className="dFlexAli-center mb-2">
                                <FaClock />
                                <span className="mx-2">Duration:</span>
                                <b>{quizData?.duration} minutes</b>
                            </div>

                            <div className="dFlexAli-center mb-2">
                                <RiNumbersFill />
                                <span className="mx-2">Number of Attempts:</span>
                                <b>{quizData?.attempts}</b>
                            </div>

                            <div className="dFlexAli-center my-3">
                                <img className={`${cx('imgAvatar')} me-2`} src={defaultAvatar} alt="Avatar" />
                                <span>Dream</span>
                            </div>

                            <div className="dFlexAli-center mt-3 actions">
                                <Button className="btn-gray btn-round text-capitalize btn-sml" variant="outlined">
                                    <FaHeart className="me-2" /> Add Wishlist
                                </Button>

                                <Button className="btn-gray btn-round text-capitalize btn-sml ms-2" variant="outlined">
                                    <MdNoteAdd className="me-2" /> Save for Later
                                </Button>
                            </div>
                        </div>

                        <div className="col-md-4 pe-5">
                            <div className={cx('quizImgBox')}>
                                <img src={quizData?.image} alt="Quiz" />
                            </div>

                            {quizData?.password && quizData.password.trim() !== '' ? (
                                <div className="d-flex justify-content-center mt-3">
                                    <Button
                                        onClick={() => setIsOpenModal(true)}
                                        className="btn-primary btn-round text-capitalize btn-sml px-3"
                                    >
                                        START QUIZ
                                    </Button>
                                </div>
                            ) : (
                                <div className="d-flex justify-content-center mt-3">
                                    <Button
                                        disabled={isLoad === true ? true : false}
                                        onClick={startQuiz}
                                        className="btn-primary btn-round text-capitalize btn-sml px-3"
                                    >
                                        <span className="dFlexAli-center me-2">Start Quiz</span>
                                        {isLoad === true && (
                                            <CircularProgress
                                                className="loader"
                                                color="inherit"
                                                style={{ width: 20, height: 20 }}
                                            />
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>

                        <Dialog
                            open={isOpenModal}
                            onClose={() => setIsOpenModal(false)}
                            slots={{
                                transition: Transition,
                            }}
                            className="locationModal"
                        >
                            <div className={cx('modal')}>
                                <h4 className="mb-0 text-danger">You need to enter a password to take the test!</h4>
                                <hr />
                                <div className="w-100 mb-4 dFlexAli-center">
                                    <input onChange={handleChange} className="w-50 ms-auto" type="text" />
                                </div>
                                <div className={cx('modalBtn')}>
                                    <Button
                                        disabled={isLoad === true ? true : false}
                                        onClick={confirmPassword}
                                        className="btn-primary btn-lg btn-big"
                                    >
                                        <span className="dFlexAli-center me-2">Enter</span>
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

                    <br />

                    <div className={`card mt-5 p-5 ${cx('detailsPageTabs')}`}>
                        <div className={cx('customTabs')}>
                            <ul className="list list-inline">
                                <li className="list-inline-item">
                                    <Button
                                        className={`${activeTabs === 0 ? cx('active') : ''}`}
                                        onClick={() => setActiveTabs(0)}
                                    >
                                        Reviews
                                    </Button>
                                </li>

                                <li className="list-inline-item">
                                    <Button
                                        className={`${activeTabs === 1 ? cx('active') : ''}`}
                                        onClick={() => setActiveTabs(1)}
                                    >
                                        Question Preview
                                    </Button>
                                </li>

                                <li className="list-inline-item">
                                    <Button
                                        className={`${activeTabs === 2 ? cx('active') : ''}`}
                                        onClick={() => setActiveTabs(2)}
                                    >
                                        Test History
                                    </Button>
                                </li>
                            </ul>

                            <br />

                            {activeTabs === 0 && (
                                <div className="tabContent">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <form onSubmit={submitReview} className={cx('reviewForm')}>
                                                <h4>Add a Review</h4>
                                                <div className={cx('form-group')}>
                                                    <textarea
                                                        onChange={onChangeInput}
                                                        value={reviews.review}
                                                        className={cx('form-control')}
                                                        name="review"
                                                        placeholder="Write something..."
                                                    ></textarea>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className={cx('form-group')}>
                                                            <input
                                                                onChange={onChangeInput}
                                                                value={reviews.userName}
                                                                className={cx('form-control')}
                                                                type="text"
                                                                name="userName"
                                                                placeholder="Name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className={cx('form-group')}>
                                                            <Rating
                                                                onChange={(event, newValue) => setRate(newValue)}
                                                                name="rating"
                                                                value={rate}
                                                                size="small"
                                                                precision={0.5}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={cx('form-group')}>
                                                    <Button
                                                        type="submit"
                                                        className="btn-green btn-lg btn-big btn-round"
                                                    >
                                                        Submit Review
                                                    </Button>
                                                </div>
                                            </form>
                                            <br />
                                            <h4 className="text-uppercase">Comments</h4>

                                            {reviewData.length === 0 ? (
                                                <span>No reviews available for this quiz.</span>
                                            ) : (
                                                reviewData.map((reviewItem) => (
                                                    <div key={reviewItem._id} className="mb-3">
                                                        <div className={`card p-3 ${cx('reviewsCard')} flex-row`}>
                                                            <div className="image">
                                                                <div className={cx('rounded-circle')}>
                                                                    <img
                                                                        src={
                                                                            reviewItem.userImage === ''
                                                                                ? defaultAvatar
                                                                                : reviewItem.userImage
                                                                        }
                                                                        alt="User"
                                                                    />
                                                                </div>
                                                                <span className="text-g d-block text-center fw-bold">
                                                                    {reviewItem.userName}
                                                                </span>
                                                            </div>

                                                            <div className={`${cx('info')} ps-3`}>
                                                                <div className="dFlexAli-center w-100">
                                                                    <div className="dFlexAli-center">
                                                                        <h6 className="text-light">
                                                                            {formattedDate(reviewItem.updatedAt)}
                                                                        </h6>
                                                                        <div className="ms-2">
                                                                            <Rating
                                                                                className="half-rating-read"
                                                                                name="read-only"
                                                                                value={reviewItem.rating}
                                                                                readOnly
                                                                                size="small"
                                                                                precision={0.5}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="dFlexAli-center ms-auto">
                                                                        <Button
                                                                            onClick={() => openReply(reviewItem._id)}
                                                                            className="btn-sm btn-round btn-green btn-hover"
                                                                        >
                                                                            <FaReply />
                                                                        </Button>

                                                                        {reviewItem.userId === currUserId && (
                                                                            <Button
                                                                                onClick={() =>
                                                                                    deleteComment(
                                                                                        'review',
                                                                                        reviewItem._id,
                                                                                    )
                                                                                }
                                                                                className="btn-sm btn-round btn-red btn-hover ms-2"
                                                                            >
                                                                                <RiDeleteBack2Fill />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <p>{reviewItem.review}</p>
                                                            </div>
                                                        </div>

                                                        {openReplyForms.includes(reviewItem._id) && (
                                                            <form
                                                                onSubmit={(e) => submitReply(e, reviewItem._id)}
                                                                className="mt-2 ps-4 ms-4"
                                                            >
                                                                <textarea
                                                                    className="form-control"
                                                                    placeholder="Write your reply..."
                                                                    value={replyText}
                                                                    onChange={(e) => setReplyText(e.target.value)}
                                                                    required
                                                                />
                                                                <div className="mt-2">
                                                                    <Button
                                                                        type="submit"
                                                                        className="btn-green btn-round btn-sm"
                                                                    >
                                                                        Submit
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        onClick={() => cancelReply(reviewItem._id)}
                                                                        className="btn-gray btn-round btn-sm ms-2 text-capitalize"
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                </div>
                                                            </form>
                                                        )}

                                                        {renderReplies(reviewItem._id)}
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div className="col-md-4">
                                            <h4 className="mb-3">Reviews</h4>
                                            <div className="d-flex mb-3">
                                                <Rating
                                                    className="me-1"
                                                    name="read-only"
                                                    value={rateData?.averageRating || 0}
                                                    readOnly
                                                    size="small"
                                                    precision={0.1}
                                                />
                                                <h6>{rateData?.averageRating || 0} out of 5</h6>
                                            </div>
                                            <div className={`${cx('progressBarBox')} dFlexAli-center`}>
                                                <span className="me-4">5 star</span>
                                                <div className={cx('progress')}>
                                                    <div
                                                        className={cx('progress-bar')}
                                                        style={{ width: percenRateData?.fiveStarPercen || '0%' }}
                                                    >
                                                        {percenRateData?.fiveStarPercen || '0%'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`${cx('progressBarBox')} dFlexAli-center`}>
                                                <span className="me-4">4 star</span>
                                                <div className={cx('progress')}>
                                                    <div
                                                        className={cx('progress-bar')}
                                                        style={{ width: percenRateData?.fourStarPercen || '0%' }}
                                                    >
                                                        {percenRateData?.fourStarPercen || '0%'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`${cx('progressBarBox')} dFlexAli-center`}>
                                                <span className="me-4">3 star</span>
                                                <div className={cx('progress')}>
                                                    <div
                                                        className={cx('progress-bar')}
                                                        style={{ width: percenRateData?.threeStarPercen || '0%' }}
                                                    >
                                                        {percenRateData?.threeStarPercen || '0%'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`${cx('progressBarBox')} dFlexAli-center`}>
                                                <span className="me-4">2 star</span>
                                                <div className={cx('progress')}>
                                                    <div
                                                        className={cx('progress-bar')}
                                                        style={{ width: percenRateData?.twoStarPercen || '0%' }}
                                                    >
                                                        {percenRateData?.twoStarPercen || '0%'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`${cx('progressBarBox')} dFlexAli-center mb-3`}>
                                                <span className="me-4">1 star</span>
                                                <div className={cx('progress')}>
                                                    <div
                                                        className={cx('progress-bar')}
                                                        style={{ width: percenRateData?.oneStarPercen || '0%' }}
                                                    >
                                                        {percenRateData?.oneStarPercen || '0%'}
                                                    </div>
                                                </div>
                                            </div>
                                            <a href="#" className="font-xs text-muted">
                                                How are ratings calculated?
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTabs === 1 && (
                                <div className="tabQuizList">
                                    {quizList?.length === 0 ? (
                                        <span>No questions available for this quiz.</span>
                                    ) : (
                                        quizList.map((quizItem, index) => (
                                            <div key={index} className={`${cx('tabQuizItem')} mt-2`}>
                                                <MathText text={quizItem.questionText} />
                                                <ul>
                                                    {quizItem.options.map((option, idx) => (
                                                        <li key={idx}>
                                                            <MathText text={option} />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTabs === 2 && (
                                <div className="tabContent">
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Completion Date</th>
                                                    <th>Correct Answer</th>
                                                    <th>Score</th>
                                                    <th>Duration</th>
                                                    <th>Options</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {takenQuiz &&
                                                    takenQuiz.length !== 0 &&
                                                    takenQuiz.map((quiz) => (
                                                        <tr key={quiz.id} className="table-item">
                                                            <td>{formattedDate(quiz.createdAt)}</td>
                                                            <td>{quiz.correct}</td>
                                                            <td>{quiz.score}</td>
                                                            <td>{formatDuration(quiz.duration)}</td>
                                                            <td>
                                                                <Link to={`/historyQuiz/${quiz._id}`}>
                                                                    <Button className="btn-primary btn-round btn-small text-capitalize">
                                                                        Details
                                                                    </Button>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <br />
                    {/* <RelatedQuizzes /> */}
                </div>
            </section>
        </>
    );
};

export default QuizDetail;
