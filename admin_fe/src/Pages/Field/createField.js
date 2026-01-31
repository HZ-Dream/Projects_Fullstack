// Icons
import { MdCloudUpload } from 'react-icons/md';

// Material UI
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

// Other
import { postData } from '../../utils/api';

// Context
import { MyContext } from '../../App';

const CreateField = () => {
    const context = useContext(MyContext);
    // Set load
    const [load, isLoad] = useState(false);
    const [formFields, setFormFields] = useState({
        name: '',
        description: '',
    });

    const changeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value,
        }));
    };

    const addField = (e) => {
        e.preventDefault();
        if (!formFields.name.trim() || !formFields.description.trim()) {
            context.handleClickVariant('Please fill all fields!', 'warning');
            return;
        }
        isLoad(true);
        console.log(formFields);

        postData('/api/field/createField', formFields)
            .then((res) => {
                isLoad(false);
                context.handleClickVariant('Create new field successful!', 'success');
                setFormFields({
                    name: '',
                    description: '',
                });
            })
            .catch((err) => {
                isLoad(false);
                context.handleClickVariant(err.response.data.msg, 'error');
            });
    };

    return (
        <>
            <section className="right-content w-100">
                <form className="form" onSubmit={addField}>
                    <div className="row">
                        <div className="col-sm-7 mx-auto">
                            <div className="card p-4">
                                <div className="dFlexAli-center mb-3">
                                    <h5 className="mb-0">Basic Information</h5>

                                    <Button variant="contained" className="ms-auto">
                                        <Link to="/field/list">Field List</Link>
                                    </Button>
                                </div>

                                <div className="form-group">
                                    <h6>Field Name</h6>
                                    <input value={formFields.name} type="text" name="name" onChange={changeInput} />
                                </div>

                                <div className="form-group">
                                    <h6>Field Description</h6>
                                    <textarea
                                        value={formFields.description}
                                        name="description"
                                        placeholder="Write your description..."
                                        onChange={changeInput}
                                    ></textarea>
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

export default CreateField;
