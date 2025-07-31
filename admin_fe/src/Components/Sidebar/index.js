// Icons
import { FaAngleRight } from 'react-icons/fa6';
import { MdDashboard } from 'react-icons/md';
import { FaProductHunt } from 'react-icons/fa6';
import { FaCartArrowDown } from 'react-icons/fa';
import { MdMessage } from 'react-icons/md';
import { FaBell } from 'react-icons/fa';
import { IoIosSettings } from 'react-icons/io';
import { BiLogOut } from 'react-icons/bi';

// Material UI
import Button from '@mui/material/Button';

// React
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';

// Components
import { MyContext } from '../../App';

const Sidebar = () => {
    const context = useContext(MyContext);
    const [actClass, setActClass] = useState();

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
                        <Link to="/">
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
                                <FaProductHunt />
                            </span>
                            <span className="name">Products</span>
                            <span className="arrow">
                                <FaAngleRight />
                            </span>
                        </Button>
                        <div className={`submenuWrapper ${actClass === 2 ? 'open' : ''}`}>
                            <ul className="submenu">
                                <li>
                                    <Link to="/">Product List</Link>
                                </li>
                                <li>
                                    <Link to="/">Product View</Link>
                                </li>
                                <li>
                                    <Link to="/">Product Upload</Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Button className={`w-100 ${actClass === 3 ? 'act' : ''}`} onClick={() => setAct(3)}>
                            <span className="icon">
                                <FaCartArrowDown />
                            </span>
                            <span className="name">Orders</span>
                            <span className="arrow">
                                <FaAngleRight />
                            </span>
                        </Button>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${actClass === 4 ? 'act' : ''}`} onClick={() => setAct(4)}>
                                <span className="icon">
                                    <MdMessage />
                                </span>
                                <span className="name">Messages</span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${actClass === 5 ? 'act' : ''}`} onClick={() => setAct(5)}>
                                <span className="icon">
                                    <FaBell />
                                </span>
                                <span className="name">Notifications</span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${actClass === 6 ? 'act' : ''}`} onClick={() => setAct(6)}>
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
                        <Button className="dFlexAli-center fw-bold" variant="contained">
                            <BiLogOut className="me-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
