// Icons
import { MdCloudUpload } from 'react-icons/md';

// Material UI
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

// Other
import { postData } from '../../../utils';

// Context
import { MyContext } from '../../../App';

const CategoryAdd = () => {
    const context = useContext(MyContext);
    // Set load
    const [load, isLoad] = useState(false);
    const [formFields, setFormFields] = useState({
        name: '',
        images: [],
        color: '',
    });

    const changeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value,
        }));
    };

    const addImgUrl = (e) => {
        const arr = [];
        arr.push(e.target.value);
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: arr,
        }));
    };

    const addCategory = (e) => {
        e.preventDefault();
        if (!formFields.name.trim() || !formFields.images[0].trim() || !formFields.color.trim()) {
            context.handleClickVariant('Please fill all fields!', 'warning');
            return;
        }
        isLoad(true);
        postData('/api/category/create', formFields)
            .then((res) => {
                isLoad(false);
                context.handleClickVariant('Create new category successful!', 'success');
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

                                    <Button variant="contained" className="ms-auto">
                                        <Link to="/category">Category List</Link>
                                    </Button>
                                </div>

                                <div className="form-group">
                                    <h6>Category Name</h6>
                                    <input type="text" required name="name" onChange={changeInput} />
                                </div>

                                <div className="form-group">
                                    <h6>Image Url</h6>
                                    <input type="text" required name="images" onChange={addImgUrl} />
                                </div>

                                <div className="form-group">
                                    <h6>Color</h6>
                                    <input
                                        type="text"
                                        placeholder="#f1f1f1"
                                        required
                                        name="color"
                                        onChange={changeInput}
                                    />
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
