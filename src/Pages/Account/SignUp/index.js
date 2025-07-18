// Icons
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineFacebook } from 'react-icons/md';

// Img
import Logo from '../../../assets/images/logo.png';

// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// React
import { useContext, useEffect } from 'react';

// Context
import { MyContext } from '../../../App';
import { Link } from 'react-router-dom';

// CSS
import styles from '../AccountInUp.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const SignUp = () => {
    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsHeaderFooterShow(false);
    }, []);

    return (
        <section className={`section ${cx('signInPage', 'signUp')}`}>
            <div className={cx('shape-bottom')}>
                <svg
                    fill="#fff"
                    id="Layer_1"
                    x="0px"
                    y="0px"
                    viewBox="0 8 1921 819.8"
                    style={{ enableBackground: 'new 8 8 1921 819.8' }}
                >
                    <path
                        className="st0"
                        d="M1921,413.1v486.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"
                    ></path>
                </svg>
            </div>
            <div className="container">
                <div className={`${cx('box')} card p-3 shadow border-0`}>
                    <div className="text-center">
                        <img className={cx('imgLogo')} src={Logo} alt="Logo" />
                    </div>
                    <h2 className="mb-2 text-center">Sign Up</h2>
                    <form>
                        <div className="row">
                            <div className="col-md-6">
                                <div className={cx('form-group')}>
                                    <TextField className="w-100" label="Name" type="text" required variant="standard" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className={cx('form-group')}>
                                    <TextField
                                        className="w-100"
                                        label="Phone"
                                        type="text"
                                        required
                                        variant="standard"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={cx('form-group')}>
                            <TextField
                                className="w-100"
                                id="standard-basic"
                                label="Email"
                                type="email"
                                required
                                variant="standard"
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <TextField
                                className="w-100"
                                id="standard-password-input"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                variant="standard"
                                required
                            />
                        </div>

                        <a href="#" className={cx('border-effect')}>
                            Forgot Password?
                        </a>

                        <div className="dFlexAli-center">
                            <Button className="btn-primary btn-lg btn-big w-100 mt-2">Sign Up</Button>
                            <Button className="btn-white btn-lg btn-big w-100 mt-2 ms-3">
                                <Link onClick={() => context.setIsHeaderFooterShow(true)} to="/">
                                    Cancel
                                </Link>
                            </Button>
                        </div>

                        <p className="mt-2 mb-1">
                            Already have an account?
                            <Link to="/signIn" className={`${cx('border-effect')} ms-2`}>
                                Sign In!
                            </Link>
                        </p>

                        <p className="fw-bold text-center mb-1">Or continue with social account</p>

                        <ul className={`list list-inline mb-0 ${cx('socialSign')}`}>
                            <li className="list-inline-item">
                                <Link to="#">
                                    <FcGoogle />
                                </Link>
                            </li>
                            <li className={`list-inline-item ${cx('iconFb')}`}>
                                <Link to="#">
                                    <MdOutlineFacebook />
                                </Link>
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default SignUp;
