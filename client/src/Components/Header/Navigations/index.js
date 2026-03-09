// Icons, Button
import { IoIosMenu } from 'react-icons/io';
import { FaAngleDown } from 'react-icons/fa6';
import { FaAngleRight } from 'react-icons/fa6';
import Button from '@mui/material/Button';

// React
import { Link } from 'react-router-dom';
import { useState } from 'react';

// CSS
import styles from './Navigations.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Navigation = () => {
    const [isOpenSidebarNav, setIsOpenSidebarNav] = useState(false);

    return (
        <nav>
            <div className="container">
                <div className="d-flex d-flex justify-content-between align-items-center">
                    <div className={cx('navPart1')}>
                        <div className={cx('catWrapper')}>
                            <Button
                                className={`${cx('allCatTab')} align-items-center`}
                                onClick={() => setIsOpenSidebarNav(!isOpenSidebarNav)}
                            >
                                <span className={cx('icon1')}>
                                    <IoIosMenu />
                                </span>

                                <span className={`${cx('text')} ms-2 me-2`}>all fields of study</span>
                                <span className={cx('icon2')}>
                                    <FaAngleDown />
                                </span>
                            </Button>

                            <div className={`${cx('sidebarNav')} ${isOpenSidebarNav ? `${cx('open')}` : ''}`}>
                                <ul>
                                    <li>
                                        <Link to="/">
                                            <Button>
                                                Natural Sciences <FaAngleRight className="ms-auto" />
                                            </Button>
                                        </Link>
                                        <div className={cx('submenu')}>
                                            <Link to="/">
                                                <Button>Biology</Button>
                                            </Link>
                                            <Link to="/">
                                                <Button>Chemistry</Button>
                                            </Link>
                                            <Link to="/">
                                                <Button>Physics</Button>
                                            </Link>
                                            <Link to="/">
                                                <Button>Science</Button>
                                            </Link>
                                        </div>
                                    </li>
                                    <li>
                                        <Link to="/">
                                            <Button>
                                                Social Sciences <FaAngleRight className="ms-auto" />
                                            </Button>
                                        </Link>
                                        <div className={cx('submenu')}>
                                            <Link to="/">
                                                <Button>Politics</Button>
                                            </Link>
                                            <Link to="/">
                                                <Button>Psychology</Button>
                                            </Link>
                                            <Link to="/">
                                                <Button>Civic Education</Button>
                                            </Link>
                                            <Link to="/">
                                                <Button>History</Button>
                                            </Link>
                                            <Link to="/">
                                                <Button>Geography</Button>
                                            </Link>
                                        </div>
                                    </li>
                                    <li>
                                        <Link to="/">
                                            <Button>Maths</Button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/">
                                            <Button>Literature</Button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/">
                                            <Button>English</Button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/">
                                            <Button>IT</Button>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className={`${cx('navPart2')} d-flex align-items-center`}>
                        <ul className="list list-inline ms-auto">
                            <li className="list-inline-item mx-3">
                                <Link to="/">
                                    <Button>Home</Button>
                                </Link>
                            </li>
                            <li className="list-inline-item mx-3">
                                <Link to="/quiz">
                                    <Button>Quiz</Button>
                                </Link>
                            </li>
                            <li className="list-inline-item mx-3">
                                <Link to="/token">
                                    <Button>Token</Button>
                                </Link>
                            </li>
                            <li className="list-inline-item mx-3">
                                <Link to="/">
                                    <Button>Blog</Button>
                                </Link>
                            </li>
                            <li className="list-inline-item mx-3">
                                <Link to="/">
                                    <Button>Contact</Button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
