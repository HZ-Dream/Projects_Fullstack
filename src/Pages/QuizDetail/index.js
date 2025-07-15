// Icons, Button
import { MdQuiz } from 'react-icons/md';
import { RiNumbersFill } from 'react-icons/ri';
import { FaClock } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';
import { MdNoteAdd } from 'react-icons/md';

import Button from '@mui/material/Button';

// Img
import AvatarImg from '../../assets/images/avatar.jpg';

// Material UI
import Rating from '@mui/material/Rating';

// React
import { useState } from 'react';

// Components
import QuizZoom from '../../Components/QuizZoom';
import RelatedQuizzes from './RelatedQuizzes';

// CSS
import styles from './QuizDetail.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const QuizDetail = () => {
    const [activeTabs, setActiveTabs] = useState(0);

    return (
        <>
            <section className={`productDetails ${cx('section')}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 ps-5">
                            <h3 className="hd text-capitalize">Internet of Things - IOT (HUBT 2025)</h3>
                            <ul className="list list-inline dFlexAli-center">
                                <li className="list-inline-item">
                                    <div className="dFlexAli-center">
                                        <span className="text-light me-1">ID Quiz</span>
                                        <span>ZU49VOR</span>
                                    </div>
                                </li>

                                <li className="list-inline-item">
                                    <div className="dFlexAli-center">
                                        <span className="text-light me-1">Field:</span>
                                        <span>Information Technology</span>
                                    </div>
                                </li>
                            </ul>

                            <div className="dFlexAli-center mb-2">
                                <MdQuiz />
                                <span className="mx-2">Number of Questions:</span>
                                <b>23</b>
                            </div>

                            <div className="dFlexAli-center mb-2">
                                <FaClock />
                                <span className="mx-2">Duration:</span>
                                <b>20 minutes</b>
                            </div>

                            <div className="dFlexAli-center mb-2">
                                <RiNumbersFill />
                                <span className="mx-2">Number of Attempts:</span>
                                <b>245</b>
                            </div>

                            <div className="dFlexAli-center my-3">
                                <img className={`${cx('imgAvatar')} me-2`} src={AvatarImg} alt="Avatar" />
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
                            <QuizZoom />
                            <div className="d-flex justify-content-center mt-3">
                                <Button className="btn-primary btn-round text-capitalize btn-sml px-3">
                                    START QUIZ
                                </Button>
                            </div>
                        </div>
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
                                            <form className={cx('reviewForm')}>
                                                <h4>Add a Comment</h4>
                                                <div className={cx('form-group')}>
                                                    <textarea
                                                        className={cx('form-control')}
                                                        name="review"
                                                        placeholder="Write something..."
                                                    ></textarea>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className={cx('form-group')}>
                                                            <input
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
                                                                name="rating"
                                                                value={0}
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
                                            <br />

                                            <div className={`card p-4 ${cx('reviewsCard')} flex-row`}>
                                                <div className="image">
                                                    <div className={cx('rounded-circle')}>
                                                        <img
                                                            src="https://wp.alithemes.com/html/nest/demo/assets/imgs/blog/author-2.png"
                                                            alt="User"
                                                        />
                                                    </div>

                                                    <span className="text-g d-block text-center fw-bold">Sienna</span>
                                                </div>

                                                <div className={`${cx('info')} ps-5`}>
                                                    <div className="dFlexAli-center w-100">
                                                        <h5 className="text-light">12/07/2025</h5>
                                                        <div className="ms-auto">
                                                            <Rating
                                                                className="half-rating-read"
                                                                name="read-only"
                                                                value={3.5}
                                                                readOnly
                                                                size="small"
                                                                precision={0.5}
                                                            />
                                                        </div>
                                                    </div>

                                                    <p>
                                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                                        Delectus, suscipit exercitationem accusantium obcaecati quos
                                                        voluptate nesciunt facilis itaque modi commodi dignissimos sequi
                                                        repudiandae minus ab deleniti totam officia id incidunt?
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <h4 className="mb-3">Reviews</h4>
                                            <div className="d-flex mb-3">
                                                <Rating
                                                    className="me-1"
                                                    name="read-only"
                                                    value={4.5}
                                                    readOnly
                                                    size="small"
                                                    precision={0.5}
                                                />
                                                <h6>4.5 out of 5</h6>
                                            </div>
                                            <div className={`${cx('progressBarBox')} dFlexAli-center`}>
                                                <span className="me-3">5 star</span>
                                                <div className={cx('progress')}>
                                                    <div className={cx('progress-bar')} style={{ width: '78%' }}>
                                                        78%
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`${cx('progressBarBox')} dFlexAli-center`}>
                                                <span className="me-3">4 star</span>
                                                <div className={cx('progress')}>
                                                    <div className={cx('progress-bar')} style={{ width: '85%' }}>
                                                        85%
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`${cx('progressBarBox')} dFlexAli-center`}>
                                                <span className="me-3">3 star</span>
                                                <div className={cx('progress')}>
                                                    <div className={cx('progress-bar')} style={{ width: '70%' }}>
                                                        70%
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`${cx('progressBarBox')} dFlexAli-center`}>
                                                <span className="me-3">2 star</span>
                                                <div className={cx('progress')}>
                                                    <div className={cx('progress-bar')} style={{ width: '40%' }}>
                                                        40%
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`${cx('progressBarBox')} dFlexAli-center mb-3`}>
                                                <span className="me-3">1 star</span>
                                                <div className={cx('progress')}>
                                                    <div className={cx('progress-bar')} style={{ width: '18%' }}>
                                                        18%
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
                                    <div className={`${cx('tabQuizItem')} mt-2`}>
                                        <span>Câu 1: Con rùa có mấy cái chân</span>
                                        <ul>
                                            <li>1</li>
                                            <li>2</li>
                                            <li>3</li>
                                            <li>4</li>
                                        </ul>
                                    </div>
                                    <div className={`${cx('tabQuizItem')} mt-2`}>
                                        <span>Câu 2: Con rùa có mấy cái chân</span>
                                        <ul>
                                            <li>1</li>
                                            <li>2</li>
                                            <li>3</li>
                                            <li>4</li>
                                        </ul>
                                    </div>
                                    <div className={`${cx('tabQuizItem')} mt-2`}>
                                        <span>Câu 3: Con rùa có mấy cái chân</span>
                                        <ul>
                                            <li>1</li>
                                            <li>2</li>
                                            <li>3</li>
                                            <li>4</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {activeTabs === 2 && (
                                <div className="tabContent">
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Completion Date</th>
                                                    <th>Correct Answers</th>
                                                    <th>Options</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="table-item">
                                                    <td>15/7/2025</td>
                                                    <td>20</td>
                                                    <td>Review Quiz Details</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <br />
                    <RelatedQuizzes />
                </div>
            </section>
        </>
    );
};

export default QuizDetail;
