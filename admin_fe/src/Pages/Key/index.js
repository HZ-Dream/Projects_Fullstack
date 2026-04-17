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

const KeyList = () => {
    const context = useContext(MyContext);

    // Open Modal
    const [open, setOpen] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    // Set load
    const [load, isLoad] = useState(false);
    // Set Data Category
    const [keyData, setKeyData] = useState([]);
    // Set ID edit
    const [editId, setEditId] = useState('');
    const [deleteId, setDeleteId] = useState('');
    // Set Page
    const [currentPage, setCurrentPage] = useState(1);

    // Set Data to edit
    const [formKeys, setFormKeys] = useState({
        name: '',
    });

    const getKeyData = (page) => {
        fetchDataFromApi(`/api/key/list?page=${page}`).then((res) => {
            setKeyData(res);
            setCurrentPage(page);
        });
    };

    const handleChangePage = (e, value) => {
        e.preventDefault();
        getKeyData(value);
    };

    const changeInput = (e) => {
        setFormKeys(() => ({
            ...formKeys,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        getKeyData(currentPage);
    }, []);

    const openEditKey = (id) => {
        setFormKeys({
            name: '',
        });

        setEditId(id);
        setOpen(true);

        console.log(id);

        fetchDataFromApi(`/api/key/getItem/${id}`).then((res) => {
            setFormKeys({
                name: res.name,
            });
        });
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseDel = () => {
        setOpenDel(false);
    };

    const editKey = (e) => {
        e.preventDefault();
        isLoad(true);

        editData(`/api/key/updateKey/${editId}`, formKeys)
            .then((res) => {
                fetchDataFromApi('/api/key/all').then((res) => {
                    getKeyData(currentPage);
                    setKeyData(res);
                    setOpen(false);
                    isLoad(false);
                    context.handleClickVariant('Edit key successful!', 'success');
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

    const deleteKey = (e) => {
        e.preventDefault();
        isLoad(true);

        deleteData('/api/key/deleteKey/', deleteId)
            .then((res) => {
                fetchDataFromApi('/api/key/all').then((res) => {
                    getKeyData(currentPage);
                    setKeyData(res);
                    setOpenDel(false);
                    isLoad(false);
                    context.handleClickVariant('Delete key successful!', 'success');
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
                        <h3 className="hd">Key List</h3>
                        <Button variant="contained" className="ms-auto">
                            <Link to="/key/create">Create Key</Link>
                        </Button>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="theadDesign">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {keyData?.keyList?.length !== 0 &&
                                    keyData?.keyList?.map((item, index) => (
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
                                                <div className="actions dFlexAliJus-center">
                                                    <Button className="edit me-2" onClick={() => openEditKey(item.id)}>
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
                                <span className="me-2">Edit Key</span>
                                {load === true && <CircularProgress className="loader" color="inherit" />}
                            </DialogTitle>
                            <form onSubmit={editKey}>
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
                                        value={formKeys.name || ''}
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
                                <span className="me-2 text-danger fw-bold">Delete Key</span>
                                {load === true && <CircularProgress className="loader" color="inherit" />}
                            </DialogTitle>
                            <form onSubmit={deleteKey}>
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
                                Totals <b>{keyData?.totalKeys}</b> fields
                            </p>

                            <Pagination
                                page={currentPage}
                                count={keyData?.totalPages}
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

export default KeyList;
