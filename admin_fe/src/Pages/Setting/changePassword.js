// Icons
import { MdCloudUpload } from 'react-icons/md';

// Material UI
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Other
import { editData } from '../../utils/api';

// Context
import { MyContext } from '../../App';

const ChangePassword = () => {
    const context = useContext(MyContext);

    // Set load
    const [load, isLoad] = useState(false);
    const [adminId, setAdminId] = useState('');
    const [formFields, setFormFields] = useState({
        password: '',
        newPassword: '',
        newPasswordAgain: '',
    });

    useEffect(() => {
        window.scrollTo(0, 0);

        const loginInfo = JSON.parse(localStorage.getItem('adminInfo'));

        if (loginInfo) {
            setAdminId(loginInfo._id);
        }
    }, []);

    const changeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value,
        }));
    };

    const changePassword = (e) => {
        e.preventDefault();
        if (!formFields.password.trim() || !formFields.newPassword.trim() || !formFields.newPasswordAgain.trim()) {
            context.handleClickVariant('Please fill all fields!', 'warning');
            return;
        }

        if (formFields.newPasswordAgain !== formFields.newPassword) {
            context.handleClickVariant('The password entered again is incorrect.!', 'warning');
            return;
        }

        isLoad(true);

        const form = {
            password: formFields.password,
            newPassword: formFields.newPassword,
        };

        console.log(adminId);

        editData(`/api/admin/changePassword/${adminId}`, form)
            .then((res) => {
                isLoad(false);
                context.handleClickVariant('Create new field successful!', 'success');
                localStorage.setItem('adminInfo', JSON.stringify(res.user));
                setFormFields({
                    password: '',
                    newPassword: '',
                    newPasswordAgain: '',
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
                <form className="form" onSubmit={changePassword}>
                    <div className="row">
                        <div className="col-sm-7 mx-auto">
                            <div className="card p-4">
                                <div className="dFlexAli-center mb-3">
                                    <h5 className="mb-0">Change Password</h5>
                                </div>

                                <div className="form-group">
                                    <h6>Your Password</h6>
                                    <input
                                        value={formFields.password}
                                        type="text"
                                        name="password"
                                        onChange={changeInput}
                                    />
                                </div>

                                <div className="form-group">
                                    <h6>New Password</h6>
                                    <input
                                        value={formFields.newPassword}
                                        type="text"
                                        name="newPassword"
                                        onChange={changeInput}
                                    />
                                </div>

                                <div className="form-group">
                                    <h6>New Password Again</h6>
                                    <input
                                        value={formFields.newPasswordAgain}
                                        type="text"
                                        name="newPasswordAgain"
                                        onChange={changeInput}
                                    />
                                </div>

                                <Button type="submit" className="mt-3 btn-blue w-100 btn-big">
                                    <MdCloudUpload className="me-2" />
                                    <span className="me-2">Change Password</span>
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

export default ChangePassword;
