// Icons
import { CiCircleRemove } from 'react-icons/ci';
import { FaRegImages } from 'react-icons/fa';
import { MdCloudUpload } from 'react-icons/md';

// Material UI
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Other
import { postData } from '../../utils/api';

// Context
import { MyContext } from '../../App';

const CategoryAdd = () => {
    const context = useContext(MyContext);
    const subCatRef = useRef();
    // Set load
    const [load, isLoad] = useState(false);
    const [previews, setPreviews] = useState([]);
    const [files, setFiles] = useState([]);
    const [imgFiles, setImgFiles] = useState([]);
    const [formFields, setFormFields] = useState({
        name: '',
        subCat: [],
        images: [],
        color: '',
    });

    const formData = new FormData();

    useEffect(() => {
        if (!imgFiles) return;

        let tmp = [];
        for (let i = 0; i < imgFiles.length; i++) {
            tmp.push(URL.createObjectURL(imgFiles[i]));
        }

        const objectUrls = tmp;
        setPreviews(objectUrls);

        for (let i = 0; i < objectUrls.length; i++) {
            return () => {
                URL.revokeObjectURL(objectUrls[i]);
            };
        }
    }, [imgFiles]);

    const changeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value,
        }));
    };

    const changeSubCat = (e) => {
        const value = e.target.value;
        const convertArr = value.split(',').map((item) => item.trim());
        setFormFields((prev) => ({
            ...prev,
            subCat: convertArr,
        }));
    };

    const onChangeFile = async (e, url) => {
        try {
            const imgArr = [];
            const files = e.target.files;

            for (var i = 0; i < files.length; i++) {
                const file = files[i];
                if ((file && file.type === 'image/jpeg') || file.type === 'image/png') {
                    setImgFiles(e.target.files);
                    imgArr.push(file);
                    formData.append('images', file);
                    setFiles(imgArr);
                } else {
                    context.handleClickVariant('Only JPEG and PNG files are allowed!', 'warning');
                    return;
                }
            }

            console.log('Files to upload:', imgArr);

            postData(url, formData).then((data) => {
                if (data?.images) {
                    setFormFields((prev) => ({
                        ...prev,
                        images: data.images,
                    }));
                }
            });
            context.handleClickVariant('File uploaded successfully!', 'success');
        } catch (err) {
            console.error('Error uploading file:', err);
            context.handleClickVariant('File upload failed!', 'error');
        }
    };

    const addCategory = (e) => {
        e.preventDefault();
        if (!formFields.name.trim() || !formFields.subCat.length === 0 || !formFields.color.trim()) {
            context.handleClickVariant('Please fill all fields!', 'warning');
            return;
        }

        if (formFields.images.length === 0) {
            context.handleClickVariant('Please upload at least one image!', 'warning');
            return;
        }

        formData.append('name', formFields.name);
        formData.append('subCat', formFields.subCat);
        formData.append('color', formFields.color);

        console.log(formFields);

        isLoad(true);
        postData('/api/category/create', formFields)
            .then((res) => {
                isLoad(false);
                context.handleClickVariant('Create new category successful!', 'success');

                setFormFields({
                    name: '',
                    subCat: [],
                    images: [],
                    color: '',
                });
                subCatRef.current.value = '';
                setPreviews([]);
                setFiles([]);
                setImgFiles([]);
            })
            .catch((err) => {
                isLoad(false);
                context.handleClickVariant('Something went wrong!', 'error');
                console.error(err);
            });
    };

    return (
        <>
            <section className="right-content w-100">
                <form className="form" onSubmit={addCategory}>
                    <div className="row">
                        <div className="col-sm-7 mx-auto">
                            <div className="card p-4">
                                <div className="dFlexAli-center mb-3">
                                    <h5>Basic Information</h5>

                                    <Button variant="contained" className="ms-auto fw-bold">
                                        <Link to="/category">Category List</Link>
                                    </Button>
                                </div>

                                <div className="form-group">
                                    <h6>Category Name</h6>
                                    <input
                                        value={formFields.name}
                                        type="text"
                                        required
                                        name="name"
                                        onChange={changeInput}
                                    />
                                </div>

                                <div className="form-group">
                                    <h6>Sub Category</h6>
                                    <input
                                        ref={subCatRef}
                                        placeholder="Beef, Pork, Chicken, ..."
                                        type="text"
                                        required
                                        name="subCat"
                                        onChange={changeSubCat}
                                    />
                                </div>

                                <div className="form-group">
                                    <h6>Color</h6>
                                    <input
                                        value={formFields.color}
                                        type="text"
                                        placeholder="#f1f1f1"
                                        required
                                        name="color"
                                        onChange={changeInput}
                                    />
                                </div>

                                <div className="form-group">
                                    <h6 className="mb-3">Image</h6>

                                    <div className="imgUploadBox dFlexAli-center">
                                        {previews?.length > 0
                                            ? previews?.map((image, index) => (
                                                  <div className="uploadBox" key={index}>
                                                      <div className="box">
                                                          <LazyLoadImage
                                                              className="w-100"
                                                              alt="Image"
                                                              effect="blur"
                                                              src={image}
                                                          />
                                                      </div>
                                                  </div>
                                              ))
                                            : ''}
                                        <div className="uploadBox d-flex flex-column">
                                            <input
                                                name="images"
                                                multiple
                                                className="fileInput"
                                                type="file"
                                                onChange={(e) => onChangeFile(e, '/api/category/upload')}
                                            />
                                            <div className="info">
                                                <FaRegImages />
                                                <h5>Image Upload</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" className="mt-3 btn-blue w-100 btn-big">
                                    <MdCloudUpload className="me-2" />
                                    <span className="me-2">Publish and View</span>
                                    {load === true && <CircularProgress className="loader" color="inherit" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </>
    );
};

export default CategoryAdd;
