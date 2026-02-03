// Icons
import { FaRegImages } from 'react-icons/fa';
import { TbCancel } from 'react-icons/tb';
import { IoTrashBin } from 'react-icons/io5';
import { FaCheckCircle } from 'react-icons/fa';

// Material UI
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useState, useContext, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// API
import { fetchDataFromApi, editData, postData } from '../../utils/api';

import { MyContext } from '../../App';

const ChangeProfile = () => {
    const context = useContext(MyContext);
    let { adminId } = useParams();
    const [isLoad, setIsLoad] = useState(false);
    const [isLoadImg, setIsLoadImg] = useState(false);

    const [formField, setFormField] = useState({
        name: '',
        email: '',
        phone: '',
        image: '',
    });

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi(`/api/admin/getInfo/${adminId}`)
            .then((res) => {
                setFormField({
                    name: res.name,
                    email: res.email,
                    phone: res.phone,
                    image: res.image,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // onChange
    const onChangeInput = (e) => {
        setFormField(() => ({
            ...formField,
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
            setIsLoadImg(true);
            const formData = new FormData();

            formData.append('imageAvatarAdmin', file);

            postData('/api/admin/uploadImage', formData)
                .then((data) => {
                    setIsLoadImg(false);
                    setFormField((prev) => ({
                        ...prev,
                        image: data.secure_url,
                    }));
                    context.handleClickVariant('File uploaded successfully!', 'success');
                })
                .catch((err) => {
                    setIsLoadImg(false);
                    context.handleClickVariant(err, 'error');
                });
        } catch (err) {
            setIsLoadImg(false);
            console.error('Error uploading file:', err);
            context.handleClickVariant('File upload failed!', 'error');
        }
    };

    const changeProfile = (e) => {
        e.preventDefault();

        setIsLoad(true);

        try {
            console.log(formField);
            editData(`/api/admin/changeProfile/${adminId}`, formField)
                .then((res) => {
                    setIsLoad(false);
                    localStorage.setItem('adminInfo', JSON.stringify(res.admin));
                    context.setAdminInfo(res.admin);
                    context.handleClickVariant('Update your profile is successful!', 'success');
                })
                .catch((err) => {
                    setIsLoad(false);
                    context.handleClickVariant(err.response.data.msg, 'error');
                });
        } catch (err) {
            setIsLoad(false);
            console.error('Error change profile:', err);
            context.handleClickVariant('Change profile failed!', 'error');
        }
    };

    return (
        <section className="right-content w-100 createQuiz">
            <form onSubmit={changeProfile} className="form">
                <div className="row">
                    <div className="col-sm-7">
                        <div className="card p-4">
                            <div className="dFlexAli-center mb-4">
                                <h5 className="mb-0">Personal Information</h5>
                            </div>

                            <div className="form-group">
                                <h6>Name*</h6>
                                <input value={formField.name} name="name" type="text" onChange={onChangeInput} />
                            </div>

                            <div className="form-group">
                                <h6>Email*</h6>
                                <input value={formField.email} name="email" type="text" onChange={onChangeInput} />
                            </div>

                            <div className="form-group">
                                <h6>Phone*</h6>
                                <input value={formField.phone} name="phone" type="text" onChange={onChangeInput} />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoad === true ? true : false}
                                className="mt-3 btn-green w-100 btn-big text-capitalize"
                            >
                                <span className="dFlexAli-center me-2">
                                    <FaCheckCircle className="me-2" /> Change
                                </span>
                                {isLoad === true && (
                                    <CircularProgress
                                        className="loader"
                                        color="inherit"
                                        style={{ width: 20, height: 20 }}
                                    />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="col-sm-5">
                        <div className="card p-4">
                            <div className="form-group">
                                <h6>Image</h6>
                                <div className="imgUploadBox dFlexAliJus-center">
                                    <label className="uploadBox">
                                        {isLoadImg ? (
                                            <div className="load dFlexAliJus-center">
                                                <CircularProgress className="loader" color="inherit" />
                                            </div>
                                        ) : (
                                            <>
                                                <input
                                                    name="image"
                                                    className="fileInput"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => onChangeImage(e)}
                                                />
                                                <div className="dFlexAliJus-center previewArea">
                                                    {formField.image ? (
                                                        <img
                                                            src={formField.image}
                                                            alt="Selected"
                                                            className="imageArea w-50"
                                                        />
                                                    ) : (
                                                        <div className="info">
                                                            <FaRegImages />
                                                            <h5>Image Upload</h5>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default ChangeProfile;
