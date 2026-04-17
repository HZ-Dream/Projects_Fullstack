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

const CreateKey = () => {
    const context = useContext(MyContext);
    // Set load
    const [load, isLoad] = useState(false);
    const [formKeys, setFormKeys] = useState({
        name: '',
    });

    const changeInput = (e) => {
        setFormKeys(() => ({
            ...formKeys,
            [e.target.name]: e.target.value,
        }));
    };

    const addKey = (e) => {
        e.preventDefault();
        if (!formKeys.name.trim()) {
            context.handleClickVariant('Please fill all fields!', 'warning');
            return;
        }
        isLoad(true);

        postData('/api/key/createKey', formKeys)
            .then((res) => {
                isLoad(false);
                context.handleClickVariant('Create new key successful!', 'success');
                setFormKeys({
                    name: '',
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
                <form className="form" onSubmit={addKey}>
                    <div className="row">
                        <div className="col-sm-7 mx-auto">
                            <div className="card p-4">
                                <div className="dFlexAli-center mb-3">
                                    <h5 className="mb-0">Basic Information</h5>

                                    <Button variant="contained" className="ms-auto">
                                        <Link to="/key/list">Key List</Link>
                                    </Button>
                                </div>

                                <div className="form-group">
                                    <h6>Key Name</h6>
                                    <input value={formKeys.name} type="text" name="name" onChange={changeInput} />
                                </div>

                                <Button type="submit" className="mt-3 btn-blue w-100 btn-big">
                                    <MdCloudUpload className="me-2" />
                                    <span className="me-2">Create</span>
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

export default CreateKey;
