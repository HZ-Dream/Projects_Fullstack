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

const CategoryList = () => {
    const context = useContext(MyContext);

    // Open Modal
    const [openDel, setOpenDel] = useState(false);
    // Set load
    const [load, isLoad] = useState(false);
    // Set Data Category
    const [catData, setCatData] = useState([]);
    // Set ID edit
    const [deleteId, setDeleteId] = useState('');
    // Set Page
    const [currentPage, setCurrentPage] = useState(1);

    const getCategoryData = (page) => {
        fetchDataFromApi(`/api/category?page=${page}`).then((res) => {
            setCatData(res);
            setCurrentPage(page);
        });
    };

    const handleChangePage = (e, value) => {
        e.preventDefault();
        getCategoryData(value);
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        getCategoryData(currentPage);
    }, []);

    const handleCloseDel = () => {
        setOpenDel(false);
    };

    const openDeleteCat = (id) => {
        setDeleteId(id);
        setOpenDel(true);
    };

    const deleteCategory = (e) => {
        e.preventDefault();
        isLoad(true);

        deleteData('/api/category/', deleteId)
            .then((res) => {
                fetchDataFromApi('/api/category').then((res) => {
                    getCategoryData(currentPage);
                    setCatData(res);
                    setOpenDel(false);
                    isLoad(false);
                    context.handleClickVariant('Delete category successful!', 'success');
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
                        <h3 className="hd">Category List</h3>
                        <Button variant="contained" className="ms-auto fw-bold">
                            <Link to="/category/add">Add Category</Link>
                        </Button>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="theadDesign">
                                <tr>
                                    <th>UID</th>
                                    <th>CATEGORY</th>
                                    <th>SUB CATEGORY</th>
                                    <th>IMAGE</th>
                                    <th>COLOR</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {catData?.categoryList?.length !== 0 &&
                                    catData?.categoryList?.map((item, index) => (
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
                                                        <h6>{item.subCat.join(', ')}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="imgWrapper">
                                                    <div className="img card m-0">
                                                        <img
                                                            className="w-100"
                                                            src={`${process.env.REACT_APP_BASE_URL}/uploads/categories/${item.images[0]}`}
                                                            alt="Image"
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    title={item.color}
                                                    className="dot"
                                                    style={{ background: item.color }}
                                                ></div>
                                            </td>
                                            <td>
                                                <div className="actions dFlexAliJus-center">
                                                    <Button className="edit me-2">
                                                        <Link to={`/category/edit/${item.id}`}>
                                                            <MdEdit />
                                                        </Link>
                                                    </Button>
                                                    <Button className="delete" onClick={() => openDeleteCat(item.id)}>
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                        <Dialog className="editCategoryModal" open={openDel} onClose={handleCloseDel}>
                            <DialogTitle className="dFlexAli-center">
                                <span className="me-2 text-danger fw-bold">Delete Category</span>
                                {load === true && <CircularProgress className="loader" color="inherit" />}
                            </DialogTitle>
                            <form onSubmit={deleteCategory}>
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
                                Totals <b>{catData?.totalCategories}</b> categories
                            </p>

                            <Pagination
                                page={currentPage}
                                count={catData?.totalPages}
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

export default CategoryList;
