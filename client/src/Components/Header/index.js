// Icons
import { MdDashboard } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { LuLogOut } from 'react-icons/lu';
import { FiUser } from 'react-icons/fi';
import { FaRegBell } from 'react-icons/fa';
import { IoSunnyOutline } from 'react-icons/io5';
import { FaMoon } from 'react-icons/fa';
import Button from '@mui/material/Button';

// Img
import Logo from '../../assets/images/logo.png';

// React
import { useContext, useState } from 'react';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';

// Components
import SearchBox from './SearchBox';
import Navigation from './Navigations';

// CSS
import styles from './Header.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Header = () => {
    const context = useContext(MyContext);

    const [active, setActive] = useState(false);

    const handleClick = () => {
        if (active) {
            setActive(false);
        } else {
            setActive(true);
        }
    };

    const handleClose = () => {
        setActive(false);
    };

    const handleLogout = () => {
        setActive(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        context.setUserData(null);
        context.setTokenData(null);
        context.setIsUserLogin(false);
    };

    return (
        <div className={cx('headerWrapper-container')}>
            <div className={cx('headerWrapper')}>
                <div className={`${cx('top-strip')} bg-blue`}>
                    <div className="container">
                        <p className="mb-0 mt-0 text-center">
                            Always 1% better than yesterday, Always 365% better than last year
                        </p>
                    </div>
                </div>
            </div>

            <header className="header">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className={cx('logoWrapper')}>
                            <Link to={'/'}>
                                <img src={Logo} alt="Logo" />
                            </Link>
                        </div>

                        <SearchBox />

                        <div className={`${cx('part3')} d-flex align-items-center`}>
                            {context.isUserLogin === true ? (
                                <>
                                    <Button
                                        className={`${cx('circle')} d-flex align-items-center me-2`}
                                        onClick={() => context.setDarkMode(!context.darkMode)}
                                    >
                                        {context.darkMode === false ? <IoSunnyOutline /> : <FaMoon />}
                                    </Button>
                                    <Button className={`${cx('circle')} d-flex align-items-center`}>
                                        <FaRegBell />
                                    </Button>
                                    <div className={`${cx('user-menu-container')} ${active ? cx('active') : ''}`}>
                                        <Button onClick={handleClick} className={`${cx('circle')} ms-2`}>
                                            <FiUser />
                                        </Button>

                                        <div className={cx('user-menu')}>
                                            <Link to={`/profile/${context.userData.userId}`} onClick={handleClose}>
                                                <FaUser />
                                                <span>Profile</span>
                                            </Link>

                                            <Link to="/dashboard" onClick={handleClose}>
                                                <MdDashboard />
                                                <span>Dashboard</span>
                                            </Link>

                                            <hr />

                                            <Link to="/" onClick={handleLogout}>
                                                <LuLogOut />
                                                <span>Logout</span>
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Button className="btn-primary btn-lg btn-big w-100">
                                    <Link to="/signIn">Login</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <Navigation />
        </div>
    );
};

export default Header;
