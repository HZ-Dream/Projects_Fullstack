import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { IoBagOutline } from 'react-icons/io5';
import Button from '@mui/material/Button';

import Logo from '../../assets/images/logo.png';
import CountryDropdown from '../CountryDropdown';
import SearchBox from './SearchBox';
import Navigation from './Navigations';
import { useContext } from 'react';
import { MyContext } from '../../App';

const Header = () => {
    const context = useContext(MyContext);

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
                                        <Button className="circle">
                                            <FiUser />
                                        </Button>
                                        <div className="ms-auto cartTab d-flex align-items-center">
                                            <span className="price ms-3 me-3">$12.9</span>
                                            <div className="position-relative">
                                                <Button className="circle">
                                                    <Link to="/cart">
                                                        <IoBagOutline />
                                                    </Link>
                                                </Button>
                                                <span className="count d-flex align-items-center justify-content-center">
                                                    1
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
