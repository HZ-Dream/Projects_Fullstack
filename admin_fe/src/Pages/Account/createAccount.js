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

const CreateAccount = () => {
    const context = useContext(MyContext);
    // Set load
    const [load, isLoad] = useState(false);
    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        password: '',
        isAdmin: 'false',
    });

    const changeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value,
        }));
    };

    const addAccount = (e) => {
        e.preventDefault();
        if (!formFields.name.trim() || !formFields.email.trim() || !formFields.password.trim()) {
            context.handleClickVariant('Please fill all fields!', 'warning');
            return;
        }
        isLoad(true);

        const form = {
            name: formFields.name,
            email: formFields.email,
            password: formFields.password,
            isAdmin: formFields.isAdmin === 'true' ? true : false,
        };

        postData('/api/admin/createAccount', formFields)
            .then((res) => {
                isLoad(false);
                if (form.isAdmin) {
                    context.handleClickVariant('Create new admin successful!', 'success');
                } else {
                    context.handleClickVariant('Create new manager successful!', 'success');
                }
                setFormFields({
                    name: '',
                    email: '',
                    password: '',
                    isAdmin: 'false',
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
                <form className="form" onSubmit={addAccount}>
                    <div className="row">
                        <div className="col-sm-7 mx-auto">
                            <div className="card p-4">
                                <div className="dFlexAli-center mb-3">
                                    <h5 className="mb-0">Information</h5>

                                    <Button variant="contained" className="ms-auto">
                                        <Link to="/account/list">Account List</Link>
                                    </Button>
                                </div>

                                <div className="form-group">
                                    <h6>Name</h6>
                                    <input value={formFields.name} type="text" name="name" onChange={changeInput} />
                                </div>

                                <div className="form-group">
                                    <h6>Email</h6>
                                    <input value={formFields.email} type="text" name="email" onChange={changeInput} />
                                </div>

                                <div className="form-group">
                                    <h6>Password</h6>
                                    <input
                                        value={formFields.password}
                                        type="text"
                                        name="password"
                                        onChange={changeInput}
                                    />
                                </div>

                                <div className="form-group">
                                    <h6 className="mb-0">Admin?</h6>
                                    <div className="dFlexAli-center">
                                        <div className="dFlexAli-center me-3">
                                            <input
                                                type="radio"
                                                name="isAdmin"
                                                value="true"
                                                checked={formFields.isAdmin === 'true'}
                                                onChange={changeInput}
                                            />
                                            <h6 className="mb-0 ms-2">Yes</h6>
                                        </div>
                                        <div className="dFlexAli-center">
                                            <input
                                                type="radio"
                                                name="isAdmin"
                                                value="false"
                                                checked={formFields.isAdmin === 'false'}
                                                onChange={changeInput}
                                            />
                                            <h6 className="mb-0 ms-2">No</h6>
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" className="mt-3 btn-blue w-100 btn-big">
                                    <MdCloudUpload className="me-2" />
                                    <span className="me-2">Create Account</span>
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

export default CreateAccount;
