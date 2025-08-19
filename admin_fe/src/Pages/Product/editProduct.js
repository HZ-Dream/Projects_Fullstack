// Icons
import { FaRegImages } from 'react-icons/fa';
import { MdCloudUpload } from 'react-icons/md';

// Material UI
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Utils
import { editData, fetchDataFromApi, postData } from '../../utils/api';

// Context
import { MyContext } from '../../App';

const ProductEdit = () => {
    const context = useContext(MyContext);
    let { id } = useParams();

    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState({});
    const [catData, setCatData] = useState([]);
    const [load, isLoad] = useState(false);
    const [imgFiles, setImgFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loadImg, setLoadImg] = useState(false);

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
        let value = e.target.value;
        if (e.target.name === 'isFeatured') {
            value = value === 'true';
        }
        setFormFields({
            ...formFields,
            [e.target.name]: value,
        });
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
            setLoadImg(true);
            const formData = new FormData();
            const files = e.target.files;
            const imgArr = [];

            if (files.length > 5) {
                context.handleClickVariant('Max 5 images!', 'warning');
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

            const data = await postData(url, formData);

            if (data && data.length > 0) {
                const appendedArray = [...previews, ...data];
                setFormFields((prev) => ({
                    ...prev,
                    images: appendedArray,
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                window.scrollTo(0, 0);

                const product = await fetchDataFromApi(`/api/product/${id}`);
                if (product) {
                    setFormFields({
                        name: product.name,
                        description: product.description,
                        images: product.images,
                        category: product.category,
                        subCat: product.subCat,
                        brand: product.brand,
                        priceInit: product.priceInit,
                        priceDiscount: product.priceDiscount,
                        quantity: product.quantity,
                        flavor: product.flavor.join(', '),
                        weight: product.weight.join(', '),
                        tag: product.tag.join(', '),
                        isFeatured: product.isFeatured,
                    });

                    if (product.category) {
                        const sub = await fetchDataFromApi(`/api/category/${product.category}`);
                        setSubCategory(sub);
                    }
                }

                const categories = await fetchDataFromApi('/api/category/all');
                setCatData(categories);
            } catch (err) {
                console.error('Error fetching data:', err);
                context.handleClickVariant('Failed to load data!', 'error');
            }
        };

        fetchData();
    }, [id]);

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

        for (let i = 0; i < objectUrls.length; i++) {
            return () => {
                URL.revokeObjectURL(objectUrls[i]);
            };
        }
    }, [imgFiles]);

    const editProduct = (e) => {
        e.preventDefault();
        if (formFields.images.length === 0) {
            context.handleClickVariant('Please add at least one product image!', 'warning');
            return;
        }
        isLoad(true);

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

        console.log(formFields);

        editData(`/api/product/${id}`, formFields)
            .then((res) => {
                isLoad(false);
                context.handleClickVariant('Edit product successfully!', 'success');
                setTimeout(() => {
                    window.location.href = '/product';
                }, 1000);
            })
            .catch((err) => {
                console.error(err);
                context.handleClickVariant('Failed to edit product!', 'error');
            });
    };
    return (
        <>
            <section className="right-content w-100">
                <form className="form" onSubmit={editProduct}>
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
                                                value={formFields.category || ''}
                                                onChange={changeInput}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                required
                                            >
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
                                            checked={formFields.isFeatured === true}
                                            onChange={changeInput}
                                        />
                                        <h6 className="mb-0">Yes</h6>

                                        <input
                                            className="radioBtn ms-2"
                                            type="radio"
                                            name="isFeatured"
                                            value="false"
                                            checked={formFields.isFeatured === false}
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
                                {loadImg === true ? (
                                    <div className="uploadBox d-flex flex-column">
                                        <input name="images" multiple className="fileInput" type="file" />
                                        <div className="info">
                                            <FaRegImages />
                                            <CircularProgress className="loader" color="inherit" />
                                        </div>
                                    </div>
                                ) : formFields?.images?.length > 0 ? (
                                    formFields?.images?.map((item, index) => (
                                        <div className="uploadBox" key={index}>
                                            <div className="box">
                                                <LazyLoadImage className="w-100" alt="Image" effect="blur" src={item} />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    ''
                                )}
                                <div className="uploadBox d-flex flex-column">
                                    <input
                                        name="images"
                                        multiple
                                        className="fileInput"
                                        type="file"
                                        onChange={(e) => onChangeFile(e, `/api/product/${id}/upload`)}
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

export default ProductEdit;
