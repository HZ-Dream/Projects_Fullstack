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
import { Link, useNavigate } from 'react-router-dom';

// Utils
import { postData } from '../../utils/api';

// Context
import { MyContext } from '../../App';
import OtpBox from '../../Components/OtpBox';

const VerifyOtp = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [isLoad, setIsLoad] = useState(false);
    const [otp, setOtp] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        context.setIsHeaderFooterShow(false);
    }, []);

    const handleOtpChange = (value) => {
        setOtp(value);
    };

    const verifyOtp = (e) => {
        e.preventDefault();
        const obj = {
            otp: otp,
            email: localStorage.getItem('userEmail'),
        };

        postData('/api/user/verifyemail', obj).then((res) => {
            if (res.success === true) {
                context.handleClickVariant('Email verified successfully!', 'success');
                setIsLoad(false);

                localStorage.removeItem('userEmail');
                setTimeout(() => {
                    navigate('/signIn');
                    // window.location.href = '/signIn';
                }, 1000);
            } else {
                context.handleClickVariant(res.msg, 'error');
                setIsLoad(false);
            }
        });
    };

    return (
        <section className="section signInPage otpPage">
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
                    <form onSubmit={verifyOtp}>
                        <div className="text-center">
                            <img className="w-25" src={Logo} alt="Logo" />
                        </div>
                        <h2 className="mb-1 text-center">OTP Verification</h2>

                        <p className="text-center text-light">
                            OTP has been sent to <b>{localStorage.getItem('userEmail')}</b>
                        </p>

                        <OtpBox length={6} onChange={handleOtpChange} />

                        <div className="dFlexAli-center mt-3 mb-3">
                            <Button type="submit" className="btn-blue col btn-lg btn-big">
                                {isLoad === true ? <CircularProgress /> : 'Verify OTP'}
                            </Button>
                        </div>

                        <p className="text-center">
                            <a href="#" className="border-effect cursor">
                                Resend OTP
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default VerifyOtp;
