// Icons
import { IoMdCloudUpload } from 'react-icons/io';
import { MdGeneratingTokens } from 'react-icons/md';

// Image
import defaultAvatar from '../../assets/images/default.jpg';

// Material UI
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Utils
import { fetchDataFromApi, postData, editData } from '../../utils/api';

// Components
import MyQuizzes from './myQuizzes';

// CSS
import styles from './Profile.module.scss';
import classNames from 'classnames/bind';

import { MyContext } from '../../App';
const cx = classNames.bind(styles);

const Profile = () => {
    const context = useContext(MyContext);
    const { userId } = useParams();
    const navigate = useNavigate();

    const [isLoad, setIsLoad] = useState(false);
    const [value, setValue] = useState('1');
    const [loadImg, setLoadImg] = useState(false);
    const [userToken, setUserToken] = useState(0);

    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        phone: '',
        image: '',
    });

    const [passwordFormFields, setPasswordFormFields] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        window.scrollTo(0, 0);

        if (userId) {
            fetchDataFromApi(`/api/user/getUser/${userId}`).then((res) => {
                setUserToken(res.token);
                setFormFields({
                    name: res.name,
                    email: res.email,
                    phone: res.phone,
                    image: res.image || '',
                });
            });
        } else {
            context.handleClickVariant('You need sign in!', 'warning');
            setTimeout(() => {
                navigate('/signIn');
            }, 1000);
        }
    }, [userId, context, navigate]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const changeInput = (e) => {
        setFormFields((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const changeInputPass = (e) => {
        setPasswordFormFields((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const onChangeImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            context.handleClickVariant('Only JPEG, PNG, and WEBP files are allowed!', 'warning');
            return;
        }

        try {
            setLoadImg(true);
            const formData = new FormData();

            formData.append('imageAvatarUser', file);

            postData('/api/user/uploadImage', formData)
                .then((data) => {
                    setLoadImg(false);
                    setFormFields((prev) => ({
                        ...prev,
                        image: data.secure_url,
                    }));
                    context.handleClickVariant('File uploaded successfully!', 'success');
                })
                .catch((err) => {
                    setLoadImg(false);
                    context.handleClickVariant(err, 'error');
                });
        } catch (err) {
            setLoadImg(false);
            console.error('Error uploading file:', err);
            context.handleClickVariant('File upload failed!', 'error');
        }
    };

    const editUser = (e) => {
        e.preventDefault();
        if (!formFields.name.trim() || !formFields.email.trim() || !formFields.phone.trim()) {
            context.handleClickVariant('Please fill all fields!', 'warning');
            return;
        }

        setIsLoad(true);
        console.log(formFields);

        editData(`/api/user/updateUser/${userId}`, formFields)
            .then((res) => {
                if (res) {
                    setIsLoad(false);
                    context.handleClickVariant('User updated successfully!', 'success');
                }
            })
            .catch((err) => {
                console.error('Error updating user:', err);
                context.handleClickVariant(err.response.data.msg, 'error');
                setIsLoad(false);
            });
    };

    const changePassword = (e) => {
        e.preventDefault();
        try {
            if (
                !passwordFormFields.oldPassword.trim() ||
                !passwordFormFields.newPassword.trim() ||
                !passwordFormFields.confirmPassword.trim()
            ) {
                context.handleClickVariant('Please fill all fields!', 'warning');
                return;
            }

            if (passwordFormFields.newPassword !== passwordFormFields.confirmPassword) {
                context.handleClickVariant('Confirm passwords do not match!', 'warning');
                return;
            }

            setIsLoad(true);
            console.log(passwordFormFields);

            editData(`/api/user/updatePassword/${userId}`, passwordFormFields)
                .then((res) => {
                    context.handleClickVariant('Password changed successfully!', 'success');
                    setIsLoad(false);
                    setPasswordFormFields({
                        oldPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                    });
                })
                .catch((err) => {
                    setIsLoad(false);
                    context.handleClickVariant(err.response.data.msg, 'error');
                });
        } catch (err) {
            context.handleClickVariant(err, 'warning');
            return;
        }
    };

    return (
        <section className="section myAccountPage">
            <div className="container">
                <h2 className={`hd text-capitalize ${cx('titleToken')}`}>
                    Your Token: {userToken} <MdGeneratingTokens />
                </h2>

                <h2 className="hd text-capitalize mb-3">My Profile</h2>
                <Box className="myAccBox card" sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example" variant="fullWidth">
                                <Tab label="Edit Profile" value="1" />
                                <Tab label="Change Password" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <form onSubmit={editUser}>
                                <div className="row">
                                    <div className="col-md-4 dFlexAliJus-center">
                                        <div className="userImage">
                                            {loadImg ? (
                                                <div className="load dFlexAliJus-center">
                                                    <CircularProgress className="loader" color="inherit" />
                                                </div>
                                            ) : (
                                                <>
                                                    <img
                                                        src={formFields.image === '' ? defaultAvatar : formFields.image}
                                                        alt="Avatar"
                                                    />
                                                    <div className="overlay dFlexAliJus-center">
                                                        <IoMdCloudUpload />
                                                        <input type="file" onChange={(e) => onChangeImage(e)} />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <TextField
                                                        name="name"
                                                        value={formFields.name}
                                                        className="w-100"
                                                        label="Name"
                                                        variant="outlined"
                                                        onChange={changeInput}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <TextField
                                                        name="email"
                                                        value={formFields.email}
                                                        className="w-100"
                                                        label="Email"
                                                        variant="outlined"
                                                        onChange={changeInput}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <TextField
                                                        name="phone"
                                                        value={formFields.phone}
                                                        className="w-100"
                                                        label="Phone"
                                                        variant="outlined"
                                                        onChange={changeInput}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <Button type="submit" className="btn-blue btn-lg btn-big">
                                                Save Changes
                                                {isLoad && <CircularProgress className="loader ms-2" color="inherit" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </TabPanel>
                        <TabPanel value="2">
                            <form onSubmit={changePassword}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <TextField
                                                        value={passwordFormFields.oldPassword}
                                                        name="oldPassword"
                                                        className="w-100"
                                                        label="Current password"
                                                        variant="outlined"
                                                        onChange={changeInputPass}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <TextField
                                                        value={passwordFormFields.newPassword}
                                                        name="newPassword"
                                                        className="w-100"
                                                        label="New password"
                                                        variant="outlined"
                                                        onChange={changeInputPass}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <TextField
                                                        value={passwordFormFields.confirmPassword}
                                                        name="confirmPassword"
                                                        className="w-100"
                                                        label="Confirm password"
                                                        variant="outlined"
                                                        onChange={changeInputPass}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group d-flex">
                                            <Button type="submit" className="btn-blue btn-lg btn-big ms-auto">
                                                Save Changes
                                                {isLoad && <CircularProgress className="loader ms-2" color="inherit" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </TabPanel>
                    </TabContext>
                </Box>
            </div>

            <MyQuizzes />
        </section>
    );
};

export default Profile;
