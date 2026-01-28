// Icons
import { FaAngleRight } from 'react-icons/fa6';
import { MdDashboard } from 'react-icons/md';
import { MdCategory } from 'react-icons/md';
import { MdQuiz } from 'react-icons/md';
import { MdMessage } from 'react-icons/md';
import { FaBell } from 'react-icons/fa';
import { IoIosSettings } from 'react-icons/io';
import { BiLogOut } from 'react-icons/bi';
import { RiAccountCircleFill } from 'react-icons/ri';

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
    const [actClass, setActClass] = useState();
    const [isLoad, setIsLoad] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));

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
                            <Button className={`w-100 ${actClass === 1 ? 'act' : ''}`} onClick={() => setAct(1)}>
                                <span className="icon">
                                    <MdDashboard />
                                </span>
                                <span className="name">Dashboard</span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Button className={`w-100 ${actClass === 2 ? 'act' : ''}`} onClick={() => setAct(2)}>
                            <span className="icon">
                                <MdCategory />
                            </span>
                            <span className="name">Fields</span>
                            <span className="arrow">
                                <FaAngleRight />
                            </span>
                        </Button>
                        <div className={`submenuWrapper ${actClass === 2 ? 'open' : ''}`}>
                            <ul className="submenu">
                                <li>
                                    <Link to="/field/list">Field List</Link>
                                </li>
                                <li>
                                    <Link to="/field/create">Field Create</Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Button className={`w-100 ${actClass === 3 ? 'act' : ''}`} onClick={() => setAct(3)}>
                            <span className="icon">
                                <MdQuiz />
                            </span>
                            <span className="name">Quizzes</span>
                            <span className="arrow">
                                <FaAngleRight />
                            </span>
                        </Button>
                        <div className={`submenuWrapper ${actClass === 3 ? 'open' : ''}`}>
                            <ul className="submenu">
                                <li>
                                    <Link to="/quiz/list">Quiz List</Link>
                                </li>
                                <li>
                                    <Link to="/quiz/approve">Quiz Approve</Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    {isAdmin === true ? (
                        <li>
                            <Link to="/account">
                                <Button className={`w-100 ${actClass === 4 ? 'act' : ''}`} onClick={() => setAct(4)}>
                                    <span className="icon">
                                        <RiAccountCircleFill />
                                    </span>
                                    <span className="name">Accounts</span>
                                </Button>
                            </Link>
                        </li>
                    ) : (
                        ''
                    )}
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${actClass === 5 ? 'act' : ''}`} onClick={() => setAct(5)}>
                                <span className="icon">
                                    <MdMessage />
                                </span>
                                <span className="name">Messages</span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${actClass === 6 ? 'act' : ''}`} onClick={() => setAct(6)}>
                                <span className="icon">
                                    <FaBell />
                                </span>
                                <span className="name">Notifications</span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${actClass === 7 ? 'act' : ''}`} onClick={() => setAct(7)}>
                                <span className="icon">
                                    <IoIosSettings />
                                </span>
                                <span className="name">Settings</span>
                            </Button>
                        </Link>
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
