// Icons
import { CiCircleRemove } from 'react-icons/ci';
import { FaRegImages } from 'react-icons/fa';
import { MdCloudUpload } from 'react-icons/md';

// Material UI
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

// React
import { useState } from 'react';

const CreateQuiz = () => {
    const [categoryVal, setCategoryVal] = useState('');
    const [brandVal, setBrandVal] = useState('');

    const handleChangeCategory = (e) => {
        setCategoryVal(e.target.value);
    };

    const handleChangeBrand = (e) => {
        setBrandVal(e.target.value);
    };

    return (
        <section className="right-content w-100">
            <form className="form">
                <div className="row">
                    <div className="col-sm-7">
                        <div className="card p-4">
                            <h5 className="mb-4">Basic Information</h5>

                            <div className="form-group">
                                <h6>Title</h6>
                                <input type="text" />
                            </div>

                            <div className="form-group">
                                <h6>Description</h6>
                                <textarea rows={5} cols={20}></textarea>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <h6>Category</h6>
                                        <Select
                                            className="w-100"
                                            value={categoryVal}
                                            onChange={handleChangeCategory}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'Dress'}>Dress</MenuItem>
                                            <MenuItem value={'Shirt'}>Shirt</MenuItem>
                                            <MenuItem value={'Jean'}>Jean</MenuItem>
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <h6>Brand</h6>
                                        <Select
                                            className="w-100"
                                            value={brandVal}
                                            onChange={handleChangeBrand}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'Gucci'}>Gucci</MenuItem>
                                            <MenuItem value={'Hermes'}>Hermes</MenuItem>
                                            <MenuItem value={'Chanel'}>Chanel</MenuItem>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <h6>Initial Price</h6>
                                        <input type="text" />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <h6>Discount Price</h6>
                                        <input type="text" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-5">
                        <div className="card p-4">
                            <h5 className="mb-4">Additional information</h5>

                            <div className="form-group">
                                <h6>Color</h6>
                                <input type="text" />
                            </div>

                            <div className="form-group">
                                <h6>Size</h6>
                                <input type="text" />
                            </div>

                            <div className="form-group">
                                <h6>Tag</h6>
                                <input type="text" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card p-4">
                    <div className="imagesUploadSec">
                        <h5 className="mb-4">Media And Published</h5>

                        <div className="imgUploadBox dFlexAli-center">
                            <div className="uploadBox">
                                <div className="remove">
                                    <CiCircleRemove />
                                </div>
                                <div className="box">
                                    <img
                                        className="w-100"
                                        alt="Image"
                                        loading="lazy"
                                        src="https://mironcoder-hotash.netlify.app/images/product/single/01.webp"
                                    />
                                </div>
                            </div>

                            <div className="uploadBox">
                                <div className="remove">
                                    <CiCircleRemove />
                                </div>
                                <div className="box">
                                    <img
                                        className="w-100"
                                        alt="Image"
                                        loading="lazy"
                                        src="https://mironcoder-hotash.netlify.app/images/product/single/02.webp"
                                    />
                                </div>
                            </div>

                            <div className="uploadBox">
                                <input className="fileInput" type="file" />
                                <div className="info">
                                    <FaRegImages />
                                    <h5>Image Upload</h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button className="mt-5 btn-blue w-100 btn-big">
                        <MdCloudUpload className="me-2" /> Publish and View
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default CreateQuiz;
