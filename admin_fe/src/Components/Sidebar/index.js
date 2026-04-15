// Icons
import { FaAngleRight } from 'react-icons/fa6';
import { MdDashboard } from 'react-icons/md';
import { MdCategory } from 'react-icons/md';
import { MdQuiz } from 'react-icons/md';
import { MdGeneratingTokens } from 'react-icons/md';
import { MdMessage } from 'react-icons/md';
import { FaBell } from 'react-icons/fa';
import { IoIosSettings } from 'react-icons/io';
import { BiLogOut } from 'react-icons/bi';
import { RiAccountCircleFill } from 'react-icons/ri';
import { RiSurveyFill } from 'react-icons/ri';
import { FaMoneyCheckDollar } from 'react-icons/fa6';
import { TbMessageReportFilled } from 'react-icons/tb';

// Material UI
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';

// Components
import { MyContext } from '../../App';

const Sidebar = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [actClass, setActClass] = useState('');
    const [isLoad, setIsLoad] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminId, setAdminId] = useState('');

    useEffect(() => {
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));

        if (adminInfo) {
            setAdminId(adminInfo._id);
        }

        if (adminInfo.isAdmin === true) {
            setIsAdmin(true);
        }
    }, []);

    const setAct = (index) => {
        if (index === actClass) {
            setActClass(0);
        } else {
            setActClass(index);
        }
    };

    const handleLogout = () => {
        setIsLoad(true);
        localStorage.removeItem('adminInfo');
        localStorage.removeItem('tokenAdmin');

        setTimeout(() => {
            setIsLoad(false);
            navigate('/');
        }, [2000]);
    };

    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>
                        <Link to="/dashboard">
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
                    {isAdmin === true ? (
                        <li>
                            <Button
                                className={`w-100 ${actClass === 'field' ? 'act' : ''}`}
                                onClick={() => setAct('field')}
                            >
                                <span className="icon">
                                    <MdCategory />
                                </span>
                                <span className="name">Fields</span>
                                <span className="arrow">
                                    <FaAngleRight />
                                </span>
                            </Button>
                            <div className={`submenuWrapper ${actClass === 'field' ? 'open' : ''}`}>
                                <ul className="submenu">
                                    <Link to="/field/list">
                                        <li>Field List</li>
                                    </Link>

                                    <Link to="/field/create">
                                        <li>Field Create</li>
                                    </Link>
                                </ul>
                            </div>
                        </li>
                    ) : (
                        ''
                    )}
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
                                <Link to="/quiz/list">
                                    <li>Quiz List</li>
                                </Link>

                                <Link to="/quiz/approve">
                                    <li>Quiz Approve</li>
                                </Link>
                            </ul>
                        </div>
                    </li>
                    {isAdmin === true ? (
                        <li>
                            <Button
                                className={`w-100 ${actClass === 'token' ? 'act' : ''}`}
                                onClick={() => setAct('token')}
                            >
                                <span className="icon">
                                    <MdGeneratingTokens />
                                </span>
                                <span className="name">Tokens</span>
                                <span className="arrow">
                                    <FaAngleRight />
                                </span>
                            </Button>
                            <div className={`submenuWrapper ${actClass === 'token' ? 'open' : ''}`}>
                                <ul className="submenu">
                                    <Link to="/token/list">
                                        <li>Token List</li>
                                    </Link>

                                    <Link to="/token/create">
                                        <li>Token Create</li>
                                    </Link>
                                </ul>
                            </div>
                        </li>
                    ) : (
                        ''
                    )}
                    {isAdmin === true ? (
                        <li>
                            <Button
                                className={`w-100 ${actClass === 'bill' ? 'act' : ''}`}
                                onClick={() => setAct('bill')}
                            >
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
                                    <Link to="/bill/list">
                                        <li>Bill List</li>
                                    </Link>
                                </ul>
                            </div>
                        </li>
                    ) : (
                        ''
                    )}
                    {isAdmin === true ? (
                        <li>
                            <Button
                                className={`w-100 ${actClass === 'account' ? 'act' : ''}`}
                                onClick={() => setAct('account')}
                            >
                                <span className="icon">
                                    <RiAccountCircleFill />
                                </span>
                                <span className="name">Accounts</span>
                                <span className="arrow">
                                    <FaAngleRight />
                                </span>
                            </Button>
                            <div className={`submenuWrapper ${actClass === 'account' ? 'open' : ''}`}>
                                <ul className="submenu">
                                    <Link to="/account/list">
                                        <li>Account List</li>
                                    </Link>

                                    <Link to="/account/create">
                                        <li>Account Create</li>
                                    </Link>
                                </ul>
                            </div>
                        </li>
                    ) : (
                        ''
                    )}
                    <li>
                        <Button
                            className={`w-100 ${actClass === 'survey' ? 'act' : ''}`}
                            onClick={() => setAct('survey')}
                        >
                            <span className="icon">
                                <RiSurveyFill />
                            </span>
                            <span className="name">Surveys</span>
                            <span className="arrow">
                                <FaAngleRight />
                            </span>
                        </Button>
                        <div className={`submenuWrapper ${actClass === 'survey' ? 'open' : ''}`}>
                            <ul className="submenu">
                                <Link to="/survey/uploadText">
                                    <li>Upload Text by AI</li>
                                </Link>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Link to="/report">
                            <Button
                                className={`w-100 ${actClass === 'report' ? 'act' : ''}`}
                                onClick={() => setAct('report')}
                            >
                                <span className="icon">
                                    <TbMessageReportFilled />
                                </span>
                                <span className="name">Report</span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/message">
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
                                onClick={() => setAct(6)}
                            >
                                <span className="icon">
                                    <FaBell />
                                </span>
                                <span className="name">Notifications</span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Button
                            className={`w-100 ${actClass === 'setting' ? 'act' : ''}`}
                            onClick={() => setAct('setting')}
                        >
                            <span className="icon">
                                <IoIosSettings />
                            </span>
                            <span className="name">Settings</span>
                            <span className="arrow">
                                <FaAngleRight />
                            </span>
                        </Button>
                        <div className={`submenuWrapper ${actClass === 'setting' ? 'open' : ''}`}>
                            <ul className="submenu">
                                <Link to={`/setting/profile/${adminId}`}>
                                    <li>Change Profile</li>
                                </Link>

                                <Link to={`/setting/password/${adminId}`}>
                                    <li>Change Password</li>
                                </Link>
                            </ul>
                        </div>
                    </li>
                </ul>

                <br />

                <div className="logoutWrapper">
                    <div className="logoutBox">
                        <Button
                            disabled={isLoad === true ? true : false}
                            onClick={handleLogout}
                            className="dFlexAli-center fw-bold"
                            variant="contained"
                        >
                            {isLoad === true && (
                                <CircularProgress
                                    className="loader"
                                    color="inherit"
                                    style={{ width: 20, height: 20 }}
                                />
                            )}
                            <span className="dFlexAli-center ms-2">
                                <BiLogOut className="me-2" />
                                Logout
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
