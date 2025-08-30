// Icons
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineFacebook } from 'react-icons/md';

// Img
import Logo from '../../assets/images/logo.png';

// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Utils
import { postData } from '../../utils/api';

// Context
import { MyContext } from '../../App';

const SignUp = () => {
    const context = useContext(MyContext);
    const [isLoad, setIsLoad] = useState(false);
    const [formfields, setFormFields] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        isAdmin: false,
    });

    useEffect(() => {
        context.setIsHeaderFooterShow(false);
    }, []);

    const onChangeInput = (e) => {
        setFormFields(() => ({
            ...formfields,
            [e.target.name]: e.target.value,
        }));
    };

    const signUp = (e) => {
        e.preventDefault();
        try {
            if (
                formfields.name.trim() === '' ||
                formfields.phone.trim() === '' ||
                formfields.email.trim() === '' ||
                formfields.password.trim() === ''
            ) {
                context.handleClickVariant('Please fill all fields in form!', 'warning');
                return;
            }

            setIsLoad(true);

            postData('/api/user/signup', formfields)
                .then((res) => {
                    setIsLoad(false);
                    context.handleClickVariant('Sign Up account success!', 'success');

                    setTimeout(() => {
                        window.location.href = '/signIn';
                    }, 1000);
                })
                .catch((err) => {
                    setIsLoad(false);
                    if (err.response.data.msg) {
                        context.handleClickVariant(err.response.data.msg, 'error');
                    } else {
                        context.handleClickVariant('Server error', 'error');
                    }
                });
        } catch (err) {
            context.handleClickVariant(err, 'warning');
            return;
        }
    };

    return (
        <section className="section signInPage signUp">
            <div className="shape-bottom">
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
                <div className="box card p-3 shadow border-0">
                    <div className="text-center">
                        <img className="w-25" src={Logo} alt="Logo" />
                    </div>
                    <h2 className="mb-2 text-center">Sign Up</h2>
                    <form onSubmit={signUp}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <TextField
                                        onChange={onChangeInput}
                                        name="name"
                                        className="w-100"
                                        label="Name"
                                        type="text"
                                        required
                                        variant="standard"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <TextField
                                        onChange={onChangeInput}
                                        name="phone"
                                        className="w-100"
                                        label="Phone"
                                        type="text"
                                        required
                                        variant="standard"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <TextField
                                onChange={onChangeInput}
                                name="email"
                                className="w-100"
                                id="standard-basic"
                                label="Email"
                                type="email"
                                required
                                variant="standard"
                            />
                        </div>
                        <div className="form-group">
                            <TextField
                                onChange={onChangeInput}
                                name="password"
                                className="w-100"
                                id="standard-password-input"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                variant="standard"
                                required
                            />
                        </div>

                        <a href="#" className="border-effect">
                            Forgot Password?
                        </a>

                        <div className="dFlexAli-center">
                            <Button
                                disabled={isLoad === true ? true : false}
                                type="submit"
                                className="btn-blue btn-lg btn-big w-100 mt-2"
                            >
                                <span className="me-2">Sign Up</span>
                                {isLoad === true && (
                                    <CircularProgress
                                        className="loader"
                                        color="inherit"
                                        style={{ width: 20, height: 20 }}
                                    />
                                )}
                            </Button>
                            <Button className="btn-white btn-lg btn-big w-100 mt-2 ms-3">
                                <Link onClick={() => context.setIsHeaderFooterShow(true)} to="/">
                                    Cancel
                                </Link>
                            </Button>
                        </div>

                        <p className="mt-2 mb-1">
                            Already have an account?
                            <Link to="/signIn" className="border-effect ms-2">
                                Sign In!
                            </Link>
                        </p>

                        <p className="fw-bold text-center">Or continue with social account</p>

                        <ul className="list list-inline mb-0 socialSign">
                            <li className="list-inline-item">
                                <Link to="#">
                                    <FcGoogle />
                                </Link>
                            </li>
                            <li className="list-inline-item iconFb">
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
