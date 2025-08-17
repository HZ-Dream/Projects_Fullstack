// Icons
import { CiCircleRemove } from 'react-icons/ci';
import { FaRegImages } from 'react-icons/fa';
import { MdCloudUpload } from 'react-icons/md';

// Material UI
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useState, useEffect, useContext } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Utils
import { fetchDataFromApi, postData } from '../../utils/api';

// Context
import { MyContext } from '../../App';

const ProductUpload = () => {
    const context = useContext(MyContext);

    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState({});
    const [files, setFiles] = useState([]);
    const [catData, setCatData] = useState([]);
    const [load, isLoad] = useState(false);
    const [imgFiles, setImgFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    const [formFields, setFormFields] = useState({
        name: '',
        description: '',
        images: [],
        category: '',
        subCat: '',
        brand: '',
        priceInit: 0,
        priceDiscount: 0,
        quantity: 0,
        flavor: '',
        weight: '',
        tag: '',
        isfeatured: false,
    });

    const formData = new FormData();

    const changeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value,
        }));
    };

    const changeInputArr = (e) => {
        const arr = [];
        arr.push(e.target.value);
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: arr,
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

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi('/api/category/all')
            .then((res) => {
                setCatData(res);
            })
            .catch((err) => {
                context.handleClickVariant('Fetch Catagory fail!', 'error');
                console.error(err);
            });
    }, []);

    useEffect(() => {
        if (!category) return;

        console.log('Fetching subcategories for category:', category);

        fetchDataFromApi(`/api/category/${category}`)
            .then((res) => {
                console.log('Subcategories fetched:', res);
                setSubCategory(res);
            })
            .catch((err) => {
                context.handleClickVariant('Fetch Sub Category fail!', 'error');
                console.error(err);
            });
    }, [category]);

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

    const removeProductImage = (index) => {
        const updatedImages = files.filter((_, i) => i !== index);
        setFormFields((prev) => ({
            ...prev,
            images: updatedImages,
        }));
        setImgFiles(updatedImages);
    };

    const addProduct = (e) => {
        e.preventDefault();
        if (files.length === 0) {
            context.handleClickVariant('Please add at least one product image!', 'warning');
            return;
        }
        isLoad(true);
        console.log(formFields);

        formData.append('name', formFields.name);
        formData.append('description', formFields.description);
        formData.append('category', formFields.category);
        formData.append('subCat', formFields.subCat);
        formData.append('brand', formFields.brand);
        formData.append('priceInit', formFields.priceInit);
        formData.append('priceDiscount', formFields.priceDiscount);
        formData.append('quantity', formFields.quantity);
        formData.append('flavor', formFields.flavor);
        formData.append('weight', formFields.weight);
        formData.append('tag', formFields.tag);
        formData.append('isFeatured', formFields.isFeatured);

        postData('/api/product/create', formFields)
            .then((res) => {
                isLoad(false);
                context.handleClickVariant('Product added successfully!', 'success');

                setFormFields({
                    name: '',
                    description: '',
                    images: [],
                    category: '',
                    subCat: '',
                    brand: '',
                    priceInit: 0,
                    priceDiscount: 0,
                    quantity: 0,
                    flavor: '',
                    weight: '',
                    tag: '',
                    isFeatured: false,
                });
                setFiles([]);
                setImgFiles([]);
                setPreviews([]);
            })
            .catch((err) => {
                console.error(err);
                context.handleClickVariant('Failed to add product!', 'error');
            });
    };
    return (
        <>
            <section className="right-content w-100">
                <form className="form" onSubmit={addProduct}>
                    <div className="row">
                        <div className="col-sm-7">
                            <div className="card p-4">
                                <h5 className="mb-4">Basic Information</h5>

                                <div className="form-group">
                                    <h6>Product Name</h6>
                                    <input
                                        value={formFields.name}
                                        type="text"
                                        name="name"
                                        required
                                        onChange={changeInput}
                                    />
                                </div>

                                <div className="form-group">
                                    <h6>Description</h6>
                                    <textarea
                                        value={formFields.description}
                                        name="description"
                                        rows={5}
                                        cols={20}
                                        required
                                        onChange={changeInput}
                                    ></textarea>
                                </div>

                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <h6>Category</h6>
                                            <Select
                                                name="category"
                                                className="w-100"
                                                value={formFields.category}
                                                onChange={changeInput}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                required
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {catData?.categoryList?.map((category) => (
                                                    <MenuItem
                                                        className="text-capitalize"
                                                        key={category.id}
                                                        value={category.id}
                                                        onClick={() => setCategory(category.id)}
                                                    >
                                                        {category.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <h6>Sub Category</h6>
                                            <Select
                                                name="subCat"
                                                className="w-100"
                                                value={formFields.subCat}
                                                onChange={changeInput}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {subCategory?.subCat?.map((item, index) => (
                                                    <MenuItem className="text-capitalize" key={index} value={item}>
                                                        {item}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <h6>Initial Price</h6>
                                            <input
                                                value={formFields.priceInit}
                                                name="priceInit"
                                                type="text"
                                                required
                                                onChange={changeInput}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <h6>Discount Price</h6>
                                            <input
                                                value={formFields.priceDiscount}
                                                name="priceDiscount"
                                                type="text"
                                                required
                                                onChange={changeInput}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-5">
                            <div className="card p-4">
                                <h5 className="mb-4">Additional information</h5>

                                <div className="form-group">
                                    <h6>Brand</h6>
                                    <input
                                        value={formFields.brand}
                                        placeholder="Nike, Adidas, Puma, ..."
                                        type="text"
                                        name="brand"
                                        required
                                        onChange={changeInput}
                                    />
                                </div>

                                <div className="form-group">
                                    <h6>Quantity</h6>
                                    <input
                                        value={formFields.quantity}
                                        required
                                        name="quantity"
                                        type="text"
                                        onChange={changeInput}
                                    />
                                </div>

                                <div className="form-group">
                                    <h6>Flavor</h6>
                                    <input
                                        value={formFields.flavor}
                                        required
                                        name="flavor"
                                        type="text"
                                        placeholder="Grape, Apple, Mint,..."
                                        onChange={changeInputArr}
                                    />
                                </div>

                                <div className="form-group">
                                    <h6>Weight</h6>
                                    <input
                                        value={formFields.weight}
                                        required
                                        name="weight"
                                        type="text"
                                        placeholder="50g, 60g, 70g,..."
                                        onChange={changeInputArr}
                                    />
                                </div>

                                <div className="form-group">
                                    <h6>Tag</h6>
                                    <input
                                        value={formFields.tag}
                                        required
                                        name="tag"
                                        type="text"
                                        placeholder="Nutrition, Diet Food, Healthy,..."
                                        onChange={changeInputArr}
                                    />
                                </div>

                                <div className="form-group">
                                    <h6>Is Featured</h6>
                                    <div className="dFlexAli-center">
                                        <input
                                            className="radioBtn"
                                            type="radio"
                                            name="isFeatured"
                                            value="true"
                                            required
                                            onChange={changeInput}
                                        />
                                        <h6 className="mb-0">Yes</h6>
                                        <input
                                            className="radioBtn ms-2"
                                            type="radio"
                                            name="isFeatured"
                                            value="false"
                                            required
                                            onChange={changeInput}
                                        />
                                        <h6 className="mb-0">No</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card p-4">
                        <div className="imagesUploadSec">
                            <h5 className="mb-4">Media And Published</h5>

                            <div className="imgUploadBox dFlexAli-center">
                                {previews?.length > 0
                                    ? previews?.map((image, index) => (
                                          <div className="uploadBox" key={index}>
                                              <div className="remove" onClick={() => removeProductImage(index)}>
                                                  <CiCircleRemove />
                                              </div>
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
                                        onChange={(e) => onChangeFile(e, '/api/product/upload')}
                                    />
                                    <div className="info">
                                        <FaRegImages />
                                        <h5>Image Upload</h5>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button className="mt-5 btn-blue w-100 btn-big" type="submit">
                            <MdCloudUpload className="me-2" />
                            <span className="me-2">Publish and View</span>
                            {load === true && <CircularProgress className="loader" color="inherit" />}
                        </Button>
                    </div>
                </form>
            </section>
        </>
    );
};

export default ProductUpload;
