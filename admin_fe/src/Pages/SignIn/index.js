// Icons
import {
    MdOutlineMail,
    MdLockOutline,
    MdVisibility,
    MdVisibilityOff,
    MdAdminPanelSettings,
    MdSchool,
} from 'react-icons/md';

// MUI
import { Button, TextField, InputAdornment, IconButton, CircularProgress, Tab, Tabs } from '@mui/material';

// React
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// API
import { postData } from '../../utils/api';

import { MyContext } from '../../App';

// Styles
import classNames from 'classnames/bind';
import styles from './SignIn.module.scss';

const cx = classNames.bind(styles);

const SignIn = () => {
    const context = useContext(MyContext);
    const [role, setRole] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleRoleChange = (event, newValue) => setRole(newValue);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);

        postData('/api/admin/signIn', formData)
            .then((response) => {
                setIsLoading(false);
                if (response && response.token) {
                    localStorage.setItem('adminInfo', JSON.stringify(response.user));
                    localStorage.setItem('tokenAdmin', response.token);
                    window.location.href = '/dashboard';
                }
            })
            .catch((err) => {
                setIsLoading(false);
                context.handleClickVariant(err.response.data.msg, 'error');
            });
    };

    return (
        <div className={cx('loginWrapper')}>
            <div className={cx('loginCard')}>
                <div className={cx('cardLeft')}>
                    <div className={cx('logo')}>
                        <h3 className="text-light">Dream Quiz</h3>
                    </div>
                    <div className={cx('illustration')}>
                        <div className={cx('circle-bg')}>
                            <img src="https://seowebmaker.com/data/upload/media/quiz.jpg" alt="illustration" />
                        </div>
                    </div>
                    <p className={cx('quote')}>"Knowledge is power. Information is liberating."</p>
                </div>

                <div className={cx('cardRight')}>
                    <div className={cx('formHeader')}>
                        <h2>Welcome Back!</h2>
                        <p className="mb-0">Please enter your details to sign in</p>
                    </div>

                    <div className={cx('roleTabs')}>
                        <Tabs value={role} onChange={handleRoleChange} centered>
                            <Tab icon={<MdSchool />} iconPosition="start" label="Manage" />
                            <Tab icon={<MdAdminPanelSettings />} iconPosition="start" label="Admin" />
                        </Tabs>
                    </div>

                    <form className={cx('loginForm')} onSubmit={handleLogin}>
                        <div className={cx('inputGroup')}>
                            <TextField
                                fullWidth
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                label="Email Address"
                                variant="outlined"
                                placeholder="name@example.com"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MdOutlineMail />
                                        </InputAdornment>
                                    ),
                                }}
                                margin="normal"
                            />
                        </div>

                        <div className={cx('inputGroup')}>
                            <TextField
                                fullWidth
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                placeholder="••••••••"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MdLockOutline />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                margin="normal"
                            />
                        </div>

                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <Link to="/forgot-password" className={cx('forgotBtn')}>
                                Forgot Password?
                            </Link>
                        </div>

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            type="submit"
                            className={cx('submitBtn')}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                `Login as ${role === 0 ? 'Manage' : 'Admin'}`
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
