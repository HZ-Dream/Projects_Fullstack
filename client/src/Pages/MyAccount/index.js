// Icons
import { IoMdCloudUpload } from 'react-icons/io';

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

// Utils
import { fetchDataFromApi, postData, editData } from '../../utils/api';

import { MyContext } from '../../App';

const MyAccount = () => {
    const context = useContext(MyContext);
    const [userId, setUserId] = useState('');
    const [previews, setPreviews] = useState([]);
    const [files, setFiles] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [imgFiles, setImgFiles] = useState([]);
    const [value, setValue] = useState('1');
    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        phone: '',
        image: [],
    });

    const [passwordFormFields, setPasswordFormFields] = useState({
        password: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const formData = new FormData();
    const [loadImg, setLoadImg] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);

        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            setUserId(user.userId);

            fetchDataFromApi(`/api/user/${user.userId}`).then((res) => {
                setFormFields({
                    name: res.name,
                    email: res.email,
                    phone: res.phone,
                    image: res.image || [],
                });
                setPreviews(res.images || []);
            });
        } else {
            context.handleClickVariant('You need sign in!', 'warning');
            setTimeout(() => {
                window.location.href = '/signIn';
            }, 1000);
        }
    }, []);

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

    const onChangeFile = async (e, url) => {
        try {
            setLoadImg(true);
            const formData = new FormData();
            const files = e.target.files;
            const imgArr = [];

            if (files.length > 1) {
                context.handleClickVariant('Only One image!', 'warning');
                return;
            }

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                    imgArr.push(file);
                    formData.append('images', file);
                } else {
                    context.handleClickVariant('Only JPEG, PNG, and WEBP files are allowed!', 'warning');
                    return;
                }
            }

            setImgFiles(files);
            setFiles(imgArr);

            const data = await postData(url, formData);

            if (data && data.length > 0) {
                const appendedArray = [...previews, ...data];
                setFormFields((prev) => ({
                    ...prev,
                    image: appendedArray,
                }));
                setPreviews(appendedArray);
                setLoadImg(false);
                context.handleClickVariant('File uploaded successfully!', 'success');
            }
        } catch (err) {
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

        if (formFields.image.length === 0) {
            const defaultAvatar = ['defaultAvatar'];
            setFormFields((prev) => ({
                ...prev,
                image: defaultAvatar,
            }));
        }

        setIsLoad(true);
        console.log(formFields);

        editData(`/api/user/${userId}`, formFields)
            .then((res) => {
                if (res) {
                    setIsLoad(false);
                    context.handleClickVariant('User updated successfully!', 'success');
                }
            })
            .catch((err) => {
                console.error('Error updating user:', err);
                context.handleClickVariant('Failed to update user!', 'error');
            });
    };

    const changePassword = (e) => {
        e.preventDefault();
        try {
            if (
                !passwordFormFields.password.trim() ||
                !passwordFormFields.newPassword.trim() ||
                !passwordFormFields.confirmNewPassword.trim()
            ) {
                context.handleClickVariant('Please fill all fields!', 'warning');
                return;
            }

            if (passwordFormFields.newPassword !== passwordFormFields.confirmNewPassword) {
                context.handleClickVariant('Confirm passwords do not match!', 'warning');
                return;
            }

            setIsLoad(true);
            console.log(passwordFormFields);

            editData(`/api/user/password/${userId}`, passwordFormFields)
                .then((res) => {
                    context.handleClickVariant('Password changed successfully!', 'success');
                    setIsLoad(false);
                    setPasswordFormFields({
                        password: '',
                        newPassword: '',
                        confirmNewPassword: '',
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
                <h2 className="hd text-capitalize mb-3">My Account</h2>

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
                                    <div className="col-md-4">
                                        <div className="userImage">
                                            {loadImg ? (
                                                <div className="load dFlexAliJus-center">
                                                    <CircularProgress className="loader" color="inherit" />
                                                </div>
                                            ) : formFields.image &&
                                              (formFields.image[0] === 'defaultAvatar' ||
                                                  formFields.image.length === 0) ? (
                                                <>
                                                    <img src={defaultAvatar} alt="Avatar" />
                                                    <div className="overlay dFlexAliJus-center">
                                                        <IoMdCloudUpload />
                                                        <input
                                                            type="file"
                                                            multiple
                                                            onChange={(e) => onChangeFile(e, `/api/user/upload`)}
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <img src={formFields.image[0]} alt="Avatar" />
                                                    <div className="overlay dFlexAliJus-center">
                                                        <IoMdCloudUpload />
                                                        <input
                                                            type="file"
                                                            multiple
                                                            onChange={(e) =>
                                                                onChangeFile(e, `/api/user/${userId}/upload`)
                                                            }
                                                        />
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
                                                        disabled
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
                                                        value={passwordFormFields.password}
                                                        name="password"
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
                                                        value={passwordFormFields.confirmNewPassword}
                                                        name="confirmNewPassword"
                                                        className="w-100"
                                                        label="Confirm new password"
                                                        variant="outlined"
                                                        onChange={changeInputPass}
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
                    </TabContext>
                </Box>
            </div>
        </section>
    );
};

export default MyAccount;
