// Icons
import { FaRegImages } from 'react-icons/fa';
import { MdCloudUpload } from 'react-icons/md';

// Material UI
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

// API
import { postData } from '../../utils/api';

import { MyContext } from '../../App';

// Images
var TempImg1 = 'https://res.cloudinary.com/davhux6lg/image/upload/v1772973922/coin_1_y7zhg0.png';
var TempImg2 = 'https://res.cloudinary.com/davhux6lg/image/upload/v1772973922/coin_2_qju56r.png';
var TempImg3 = 'https://res.cloudinary.com/davhux6lg/image/upload/v1772972712/coin_3_te53h5.png';
var TempImg4 = 'https://res.cloudinary.com/davhux6lg/image/upload/v1772972712/coin_4_f1g6ub.png';
var TempImg5 = 'https://res.cloudinary.com/davhux6lg/image/upload/v1772973922/coin_5_zpjytj.png';

const CreateToken = () => {
    const context = useContext(MyContext);

    const [isLoad, setIsLoad] = useState(false);

    const [selectedImg, setSelectedImg] = useState(null);

    const [formField, setFormField] = useState({
        image: '',
        name: '',
        description: '',
        priceInit: 0,
        priceDiscount: 0,
        token: 0,
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSelectDefault = (img) => {
        setFormField((prev) => ({
            ...prev,
            image: img,
        }));
        setSelectedImg(img);
    };

    const handleReset = () => {
        setFormField((prev) => ({
            ...prev,
            image: null,
        }));
        setSelectedImg(null);
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
    };

    const defaultImgs = [TempImg1, TempImg2, TempImg3, TempImg4, TempImg5];

    // Handle Quiz
    const onChangeInput = (e) => {
        setFormField(() => ({
            ...formField,
            [e.target.name]: e.target.value,
        }));
    };

    const validateSubmit = () => {
        if (formField.image.trim() === '' || formField.name.trim() === '' || formField.description.trim() === '') {
            context.handleClickVariant('Please fill in all information', 'warning');
            return false;
        }

        if (formField.priceInit === 0 || formField.token === 0) {
            context.handleClickVariant('Price Init or Token must greater than 0', 'warning');
            return false;
        }

        return true;
    };

    const createToken = (e) => {
        e.preventDefault();

        if (!validateSubmit()) return;
        setIsLoad(true);

        try {
            postData('/api/token/createToken', formField)
                .then((res) => {
                    context.handleClickVariant('Create token success!', 'success');
                    setIsLoad(false);

                    setFormField({
                        image: '',
                        name: '',
                        description: '',
                        priceInit: 0,
                        priceDiscount: 0,
                        token: 0,
                    });

                    setSelectedImg(null);
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
        <section className="right-content w-100 createQuiz">
            <form onSubmit={createToken} className="form">
                <div className="row">
                    <div className="col-sm-7">
                        <div className="card p-4">
                            <div className="dFlexAli-center">
                                <h5>Package Token Information</h5>
                                <Button className="btn-blue btn-small text-capitalize ms-auto">
                                    <Link to="/token/list">Token List</Link>
                                </Button>
                            </div>

                            <div className="form-group">
                                <h6>Name*</h6>
                                <input value={formField.name} onChange={onChangeInput} name="name" type="text" />
                            </div>

                            <div className="form-group">
                                <h6>Description*</h6>
                                <textarea
                                    onChange={onChangeInput}
                                    value={formField.description}
                                    name="description"
                                    rows={5}
                                    cols={20}
                                ></textarea>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <h6>Price Init (VND)*</h6>
                                        <input
                                            value={formField.priceInit}
                                            onChange={onChangeInput}
                                            name="priceInit"
                                            type="text"
                                            placeholder="20000"
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <h6>Price Discount (VND)</h6>
                                        <input
                                            value={formField.priceDiscount}
                                            onChange={onChangeInput}
                                            name="priceDiscount"
                                            type="text"
                                            placeholder="15000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <h6>Token*</h6>
                                        <input
                                            value={formField.token}
                                            onChange={onChangeInput}
                                            name="token"
                                            type="text"
                                            placeholder="10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoad === true ? true : false}
                                className="mt-3 btn-green w-100 btn-big text-capitalize"
                            >
                                <span className="dFlexAli-center me-2">
                                    <MdCloudUpload className="me-2" /> Create
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
                                    <div className="uploadBox">
                                        <input className="fileInput" type="file" accept="image/*" />
                                        <div className="previewArea">
                                            {formField.image ? (
                                                <img src={formField.image} alt="Selected" className="imageArea" />
                                            ) : (
                                                <div className="info">
                                                    <FaRegImages />
                                                    <h5>Image Upload</h5>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Slider {...settings} className="mt-2">
                                    {defaultImgs.map((img, idx) => (
                                        <div key={idx} className="thumbnail" onClick={() => handleSelectDefault(img)}>
                                            <img
                                                src={img}
                                                alt={`thumb-${idx}`}
                                                className={`thumbnailImage ${selectedImg === img ? 'active' : ''}`}
                                            />
                                        </div>
                                    ))}
                                    <div className="thumbnail" onClick={handleReset}>
                                        <div className="thumbnailReset">Reset</div>
                                    </div>
                                </Slider>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default CreateToken;
