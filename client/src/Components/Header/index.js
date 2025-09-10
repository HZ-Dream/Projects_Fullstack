// Icons
import { FiUser } from 'react-icons/fi';
import { IoBagOutline } from 'react-icons/io5';
import { MdDashboard } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { LuLogOut } from 'react-icons/lu';
import { BsFillBagCheckFill } from 'react-icons/bs';

// Material UI
import Button from '@mui/material/Button';

// React
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

// Images
import Logo from '../../assets/images/logo.png';

// Components
import CountryDropdown from '../CountryDropdown';
import SearchBox from './SearchBox';
import Navigation from './Navigations';

// Context
import { MyContext } from '../../App';

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
        <div className="headerWrapper-container">
            <div className="headerWrapper">
                <div className="top-strip bg-blue">
                    <div className="container">
                        <p className="mb-0 mt-0 text-center">
                            Due to the demand for shopping is increasing, orders may be processed with a slight delay
                        </p>
                    </div>
                </div>
            </div>

            <header className="header">
                <div className="container">
                    <div className="row">
                        <div className="logoWrapper d-flex align-items-center col-sm-2">
                            <Link to={'/'}>
                                <img src={Logo} alt="Logo" />
                            </Link>
                        </div>

                        <div className="col-sm-10 d-flex align-items-center part2">
                            {context.countryList.length !== 0 && <CountryDropdown />}

                            <SearchBox />

                            <div className="d-flex align-items-center part3 ms-auto">
                                {context.isUserLogin === true ? (
                                    <>
                                        <div className={`user-menu-container ${active ? 'active' : ''}`}>
                                            <Button onClick={handleClick} className="circle">
                                                <FiUser />
                                            </Button>

                                            <div className="user-menu">
                                                <Link to="/myAccount" onClick={handleClose}>
                                                    <FaUser />
                                                    <span>Profile</span>
                                                </Link>

                                                <Link to="/dashboard" onClick={handleClose}>
                                                    <MdDashboard />
                                                    <span>Dashboard</span>
                                                </Link>

                                                <Link to="/order" onClick={handleClose}>
                                                    <BsFillBagCheckFill />
                                                    <span>Order</span>
                                                </Link>

                                                <hr />

                                                <Link to="/" onClick={handleLogout}>
                                                    <LuLogOut />
                                                    <span>Logout</span>
                                                </Link>
                                            </div>
                                        </div>

                                        <span className="ms-3 me-3">
                                            <b>Hi!</b> {context.userData.name}
                                        </span>
                                        <div className="ms-auto cartTab d-flex align-items-center">
                                            <div className="position-relative">
                                                <Button className="circle">
                                                    <Link to="/cart">
                                                        <IoBagOutline />
                                                    </Link>
                                                </Button>
                                                <span className="count d-flex align-items-center justify-content-center">
                                                    {context.myCart.length > 0 ? context.myCart.length : 0}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Button className="btn-blue btn-lg btn-big w-100">
                                            <Link to="/signIn">Login</Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <Navigation catData={context.catData} />
        </div>
    );
};

export default Header;
