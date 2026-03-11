// Icons
import { FaAngleRight } from 'react-icons/fa6';
import { MdDashboard } from 'react-icons/md';
import { FaMoneyCheckDollar } from 'react-icons/fa6';
import { MdMessage } from 'react-icons/md';
import { FaBell } from 'react-icons/fa';
import { IoIosSettings } from 'react-icons/io';
import { BiLogOut } from 'react-icons/bi';
import { MdQuiz } from 'react-icons/md';

// Material UI
import Button from '@mui/material/Button';

// React
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';

// Components
import { MyContext } from '../../../App';

const Sidebar = () => {
    const context = useContext(MyContext);
    const [actClass, setActClass] = useState('');

    const setAct = (index) => {
        if (index === actClass) {
            setActClass(0);
        } else {
            setActClass(index);
        }
    };

    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>
                        <Link to={`/dashboard/${context.userData?.userId}`}>
                            <Button
                                className={`w-100 ${actClass === 'dashboard' ? 'act' : ''}`}
                                onClick={() => setAct('dashboard')}
                            >
                                <span className="icon">
                                    <MdDashboard />
                                </span>
                                <span className="name">Dashboard</span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Button className={`w-100 ${actClass === 'quiz' ? 'act' : ''}`} onClick={() => setAct('quiz')}>
                            <span className="icon">
                                <MdQuiz />
                            </span>
                            <span className="name">Quizzes</span>
                            <span className="arrow">
                                <FaAngleRight />
                            </span>
                        </Button>
                        <div className={`submenuWrapper ${actClass === 'quiz' ? 'open' : ''}`}>
                            <ul className="submenu">
                                <li>
                                    <Link to={`/dashboard/quizList/${context.userData?.userId}`}>Quiz List</Link>
                                </li>
                                <li>
                                    <Link to="/dashboard/quizCreate">Create Quiz</Link>
                                </li>
                                <li>
                                    <Link to="/dashboard/quizGenerate">Generate Quiz</Link>
                                </li>
                                <li>
                                    <Link to="/dashboard/uploadText">Upload Text</Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Button className={`w-100 ${actClass === 'bill' ? 'act' : ''}`} onClick={() => setAct('bill')}>
                            <span className="icon">
                                <FaMoneyCheckDollar />
                            </span>
                            <span className="name">Bills</span>
                            <span className="arrow">
                                <FaAngleRight />
                            </span>
                        </Button>
                        <div className={`submenuWrapper ${actClass === 'bill' ? 'open' : ''}`}>
                            <ul className="submenu">
                                <li>
                                    <Link to={`/dashboard/billList/${context.userData?.userId}`}>Bill List</Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Link to="/">
                            <Button
                                className={`w-100 ${actClass === 'message' ? 'act' : ''}`}
                                onClick={() => setAct('message')}
                            >
                                <span className="icon">
                                    <MdMessage />
                                </span>
                                <span className="name">Messages</span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button
                                className={`w-100 ${actClass === 'notification' ? 'act' : ''}`}
                                onClick={() => setAct('notification')}
                            >
                                <span className="icon">
                                    <FaBell />
                                </span>
                                <span className="name">Notifications</span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/profile/${context.userData?.userId}`}>
                            <Button
                                className={`w-100 ${actClass === 'profile' ? 'act' : ''}`}
                                onClick={() => setAct('profile')}
                            >
                                <span className="icon">
                                    <IoIosSettings />
                                </span>
                                <span className="name">Profile</span>
                            </Button>
                        </Link>
                    </li>
                </ul>

                <br />

                <div className="logoutWrapper">
                    <div className="logoutBox">
                        <Button className="dFlexAli-center fw-bold" variant="contained">
                            <Link to="/">
                                <BiLogOut className="me-2" />
                                <span>Home</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
