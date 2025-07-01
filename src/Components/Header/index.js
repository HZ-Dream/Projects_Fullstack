// Icons, Button
import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { FaRegBell } from 'react-icons/fa';
import Button from '@mui/material/Button';

// Img
import Logo from '../../assets/images/logo.png';

// Components
import SearchBox from './SearchBox';
import Navigation from './Navigations';

// CSS
import styles from './Header.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Header = () => {
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
                            <Button className={`${cx('circle')} d-flex align-items-center`}>
                                <FaRegBell />
                            </Button>
                            <Button className={`${cx('circle')} ms-2`}>
                                <FiUser />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <Navigation />
        </div>
    );
};

export default Header;
