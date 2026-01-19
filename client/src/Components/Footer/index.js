// Icons
import { GrDocumentUpdate } from 'react-icons/gr';
import { IoCreateSharp } from 'react-icons/io5';
import { RiDiscountPercentLine } from 'react-icons/ri';
import { MdPrivateConnectivity } from 'react-icons/md';

import { FaFacebookF } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa';

// React
import { Link } from 'react-router-dom';

// CSS
import styles from './Footer.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className={`${cx('topInfo')} row`}>
                    <div className="col d-flex align-items-center borderRight">
                        <span>
                            <GrDocumentUpdate />
                        </span>
                        <span className="ms-2">New Quizzes Daily</span>
                    </div>
                    <div className="col d-flex align-items-center borderRight">
                        <span>
                            <IoCreateSharp />
                        </span>
                        <span className="ms-2">Create Unlimited Quizzes</span>
                    </div>
                    <div className="col d-flex align-items-center borderRight">
                        <span>
                            <RiDiscountPercentLine />
                        </span>
                        <span className="ms-2">Special Pricing for Students</span>
                    </div>
                    <div className="col d-flex align-items-center">
                        <span>
                            <MdPrivateConnectivity />
                        </span>
                        <span className="ms-2">Private Testing</span>
                    </div>
                </div>

                <div className={`row mt-5 ${cx('linksWrap')}`}>
                    <div className="col">
                        <h5>Natural Sciences</h5>
                        <ul>
                            <li>
                                <Link to="#">Math</Link>
                            </li>
                            <li>
                                <Link to="#">Physics</Link>
                            </li>
                            <li>
                                <Link to="#">Chemistry</Link>
                            </li>
                            <li>
                                <Link to="#">Biology</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col">
                        <h5>Social Sciences</h5>
                        <ul>
                            <li>
                                <Link to="#">Literature</Link>
                            </li>
                            <li>
                                <Link to="#">History</Link>
                            </li>
                            <li>
                                <Link to="#">Geography</Link>
                            </li>
                            <li>
                                <Link to="#">Psychology</Link>
                            </li>
                            <li>
                                <Link to="#">Civic Education</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col">
                        <h5>Information Technology</h5>
                        <ul>
                            <li>
                                <Link to="#">Computer Science</Link>
                            </li>
                            <li>
                                <Link to="#">Software</Link>
                            </li>
                            <li>
                                <Link to="#">Data</Link>
                            </li>
                            <li>
                                <Link to="#">Artificial Intelligence</Link>
                            </li>
                            <li>
                                <Link to="#">Networking</Link>
                            </li>
                            <li>
                                <Link to="#">Cloud Computing</Link>
                            </li>
                            <li>
                                <Link to="#">Game</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col">
                        <h5>About Us</h5>
                        <ul>
                            <li>
                                <Link to="#">Contact</Link>
                            </li>
                            <li>
                                <Link to="#">Blog</Link>
                            </li>
                            <li>
                                <Link to="#">Policy</Link>
                            </li>
                            <li>
                                <Link to="#">Support</Link>
                            </li>
                            <li>
                                <Link to="#">Packages</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={`${cx('copyright')} mt-3 pt-3 pb-3 d-flex align-items-center`}>
                <p className="mb-0">Copyright 2026 ©. All rights reserved. Powered by Dream.</p>
                <ul className="list list-inline ms-auto mb-0">
                    <li className="list-inline-item">
                        <Link target="_blank" to="https://www.facebook.com/ngochoai.120904">
                            <FaFacebookF />
                        </Link>
                    </li>
                    <li className="list-inline-item">
                        <Link target="_blank" to="https://www.tiktok.com/@nhoai1209">
                            <FaTiktok />
                        </Link>
                    </li>
                    <li className="list-inline-item">
                        <Link target="_blank" to="https://www.youtube.com/@ngochoai1209">
                            <FaYoutube />
                        </Link>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
