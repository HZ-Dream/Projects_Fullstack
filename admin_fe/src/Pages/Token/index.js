// Icons
import { MdEdit } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

// Material UI
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

// Others
import { fetchDataFromApi, deleteData } from '../../utils/api';

// Context
import { MyContext } from '../../App';

const TokenList = () => {
    const context = useContext(MyContext);

    // Open Modal
    const [openDel, setOpenDel] = useState(false);
    // Set load
    const [load, isLoad] = useState(false);
    // Set Data Token
    const [tokenData, setTokenData] = useState([]);
    // Set ID
    const [deleteId, setDeleteId] = useState('');
    // Set Page
    const [currentPage, setCurrentPage] = useState(1);

    const getTokenData = (page) => {
        fetchDataFromApi(`/api/token/list?page=${page}`).then((res) => {
            setTokenData(res);
            setCurrentPage(page);
        });
    };

    const handleChangePage = (e, value) => {
        e.preventDefault();
        getTokenData(value);
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        getTokenData(currentPage);
    }, []);

    const handleCloseDel = () => {
        setOpenDel(false);
    };

    const openDeleteField = (id) => {
        setDeleteId(id);
        setOpenDel(true);
    };

    const deleteField = (e) => {
        e.preventDefault();
        isLoad(true);

        deleteData('/api/token/deleteToken/', deleteId)
            .then((res) => {
                fetchDataFromApi('/api/token/all').then((res) => {
                    getTokenData(currentPage);
                    setTokenData(res);
                    setOpenDel(false);
                    isLoad(false);
                    context.handleClickVariant('Delete token successful!', 'success');
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
                        <h3 className="hd">Token List</h3>
                        <Button variant="contained" className="ms-auto">
                            <Link to="/token/create">Create Token</Link>
                        </Button>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="theadDesign">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Token</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {tokenData?.tokenList?.length !== 0 &&
                                    tokenData?.tokenList?.map((item, index) => (
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
                                                        {item.priceDiscount > 0 ? (
                                                            <h6>{item.priceDiscount}</h6>
                                                        ) : (
                                                            <h6>{item.priceInit}</h6>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{item.token}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="actions dFlexAliJus-center">
                                                    <Button className="edit me-2">
                                                        <Link to={`/token/edit/${item._id}`}>
                                                            <MdEdit />
                                                        </Link>
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

                        <Dialog className="editFieldModal" open={openDel} onClose={handleCloseDel}>
                            <DialogTitle className="dFlexAli-center">
                                <span className="me-2 text-danger fw-bold">Delete Token</span>
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
                                Totals <b>{tokenData?.totalTokens}</b> tokens
                            </p>

                            <Pagination
                                page={currentPage}
                                count={tokenData?.totalPages}
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

export default TokenList;
