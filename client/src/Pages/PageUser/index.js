// Icons
import { MdQuiz } from 'react-icons/md';
import { FaEnvelope, FaPhone } from 'react-icons/fa';

// Image
import defaultAvatar from '../../assets/images/default.jpg';

// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// React
import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Utils
import { fetchDataFromApi } from '../../utils/api';

// CSS
import styles from './PageUser.module.scss';
import classNames from 'classnames/bind';

import { MyContext } from '../../App';

const cx = classNames.bind(styles);

const PageUser = () => {
    const context = useContext(MyContext);
    const { userId } = useParams();
    const navigate = useNavigate();

    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        phone: '',
        image: '',
        quizCreated: 0,
    });

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi(`/api/user/getUser/${userId}`).then((res) => {
            setFormFields({
                name: res.name,
                email: res.email,
                phone: res.phone,
                image: res.image || '',
                quizCreated: res.quizCreated || 0,
            });
        });
    }, [userId]);

    const handleChat = () => {
        if (
            context.userData === null ||
            (typeof context.userData === 'object' && Object.keys(context.userData).length === 0)
        ) {
            context.handleClickVariant('You need sign in!', 'warning');
            setTimeout(() => {
                navigate('/signIn');
            }, 1000);
            return;
        }
        navigate(`/dashboard/message/${userId}`);
    };

    return (
        <section className="section myAccountPage">
            <div className="container">
                <Box className={cx('profileCard')}>
                    <div className={cx('avatarBox')}>
                        <img src={formFields.image === '' ? defaultAvatar : formFields.image} alt="Avatar" />
                    </div>

                    <h3 className={cx('userName')}>{formFields.name}</h3>

                    <div className={cx('infoBox')}>
                        <div className={cx('infoItem')}>
                            <FaEnvelope />
                            <span>{formFields.email}</span>
                        </div>

                        <div className={cx('infoItem')}>
                            <FaPhone />
                            <span>{formFields.phone || 'No phone provided'}</span>
                        </div>

                        <div className={cx('infoItem')}>
                            <MdQuiz />
                            <span>Quiz Created: {formFields.quizCreated}</span>
                        </div>
                    </div>

                    <Button className={cx('chatBtn')} variant="contained" onClick={handleChat}>
                        Chat Message
                    </Button>
                </Box>
            </div>
        </section>
    );
};

export default PageUser;
