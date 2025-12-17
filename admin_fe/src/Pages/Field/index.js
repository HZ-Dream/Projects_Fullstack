// Icons
import { MdEdit } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

// Material UI
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

// Others
import { fetchDataFromApi, editData, deleteData } from '../../utils/api';

// Context
import { MyContext } from '../../App';

const FieldList = () => {
    const context = useContext(MyContext);

    // Open Modal
    const [open, setOpen] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    // Set load
    const [load, isLoad] = useState(false);
    // Set Data Category
    const [fieldData, setFieldData] = useState([]);
    // Set ID edit
    const [editId, setEditId] = useState('');
    const [deleteId, setDeleteId] = useState('');
    // Set Page
    const [currentPage, setCurrentPage] = useState(1);

    // Set Data to edit
    const [formFields, setFormFields] = useState({
        name: '',
        description: '',
    });

    const getFieldData = (page) => {
        fetchDataFromApi(`/api/field/list?page=${page}`).then((res) => {
            setFieldData(res);
            setCurrentPage(page);
        });
    };

    const handleChangePage = (e, value) => {
        e.preventDefault();
        getFieldData(value);
    };

    const changeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        getFieldData(currentPage);
    }, []);

    const openEditField = (id) => {
        setFormFields({
            name: '',
            description: '',
        });

        setEditId(id);
        setOpen(true);

        console.log(id);

        fetchDataFromApi(`/api/field/getItem/${id}`).then((res) => {
            setFormFields({
                name: res.name,
                description: res.description,
            });
        });
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseDel = () => {
        setOpenDel(false);
    };

    const editField = (e) => {
        e.preventDefault();
        isLoad(true);

        editData(`/api/field/updateField/${editId}`, formFields)
            .then((res) => {
                fetchDataFromApi('/api/field/all').then((res) => {
                    getFieldData(currentPage);
                    setFieldData(res);
                    setOpen(false);
                    isLoad(false);
                    context.handleClickVariant('Edit field successful!', 'success');
                });
            })
            .catch((err) => {
                isLoad(false);
                context.handleClickVariant(err.response.data.msg, 'error');
            });
    };

    const openDeleteField = (id) => {
        setDeleteId(id);
        setOpenDel(true);
    };

    const deleteField = (e) => {
        e.preventDefault();
        isLoad(true);

        deleteData('/api/field/deleteField/', deleteId)
            .then((res) => {
                fetchDataFromApi('/api/field/all').then((res) => {
                    getFieldData(currentPage);
                    setFieldData(res);
                    setOpenDel(false);
                    isLoad(false);
                    context.handleClickVariant('Delete field successful!', 'success');
                });
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
                <div className="card shadow border-0 p-3">
                    <div className="dFlexAli-center">
                        <h3 className="hd">Field List</h3>
                        <Button variant="contained" className="ms-auto">
                            <Link to="/field/create">Create Field</Link>
                        </Button>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="theadDesign">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Descripion</th>
                                    <th>Quantity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {fieldData?.fieldList?.length !== 0 &&
                                    fieldData?.fieldList?.map((item, index) => (
                                        <tr key={item.id}>
                                            <td># {index + 1}</td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{item.name}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{item.description}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>10</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="actions dFlexAliJus-center">
                                                    <Button
                                                        className="edit me-2"
                                                        onClick={() => openEditField(item.id)}
                                                    >
                                                        <MdEdit />
                                                    </Button>
                                                    <Button className="delete" onClick={() => openDeleteField(item.id)}>
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                        <Dialog className="editFieldModal" open={open} onClose={handleClose}>
                            <DialogTitle className="dFlexAli-center">
                                <span className="me-2">Edit Field</span>
                                {load === true && <CircularProgress className="loader" color="inherit" />}
                            </DialogTitle>
                            <form onSubmit={editField}>
                                <DialogContent>
                                    <TextField
                                        autoFocus
                                        required
                                        margin="dense"
                                        id="name"
                                        name="name"
                                        label="Name"
                                        type="text"
                                        fullWidth
                                        value={formFields.name || ''}
                                        onChange={changeInput}
                                    />
                                    <TextField
                                        required
                                        margin="dense"
                                        id="description"
                                        name="description"
                                        label="Description"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        value={formFields.description || ''}
                                        onChange={changeInput}
                                    />
                                </DialogContent>
                                <DialogActions className="mb-2">
                                    <Button onClick={handleClose} variant="outlined">
                                        Cancel
                                    </Button>
                                    <Button variant="contained" type="submit">
                                        Submit
                                    </Button>
                                </DialogActions>
                            </form>
                        </Dialog>

                        <Dialog className="editFieldModal" open={openDel} onClose={handleCloseDel}>
                            <DialogTitle className="dFlexAli-center">
                                <span className="me-2 text-danger fw-bold">Delete Field</span>
                                {load === true && <CircularProgress className="loader" color="inherit" />}
                            </DialogTitle>
                            <form onSubmit={deleteField}>
                                <DialogContent>
                                    <h3>Are you sure you want to delete?</h3>
                                </DialogContent>
                                <DialogActions className="mb-2">
                                    <Button onClick={handleCloseDel} variant="outlined">
                                        Cancel
                                    </Button>
                                    <Button variant="contained" type="submit">
                                        Delete
                                    </Button>
                                </DialogActions>
                            </form>
                        </Dialog>

                        <div className="dFlexAli-center tableFooter pt-1">
                            <p className="mb-0 me-auto">
                                Totals <b>{fieldData?.totalFields}</b> fields
                            </p>

                            <Pagination
                                page={currentPage}
                                count={fieldData?.totalPages}
                                color="primary"
                                showFirstButton
                                showLastButton
                                onChange={handleChangePage}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default FieldList;
