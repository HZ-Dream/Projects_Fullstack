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

const HomeBannerList = () => {
    const context = useContext(MyContext);

    // Open Modal
    const [openDel, setOpenDel] = useState(false);
    // Set load
    const [load, isLoad] = useState(false);
    // Set Data Category
    const [homeBannerData, setHomeBannerData] = useState([]);
    // Set ID edit
    const [deleteId, setDeleteId] = useState('');
    // Set Page
    const [currentPage, setCurrentPage] = useState(1);

    const getBannerData = (page) => {
        fetchDataFromApi(`/api/homeBanner?page=${page}`).then((res) => {
            setHomeBannerData(res);
            setCurrentPage(page);
        });
    };

    const handleChangePage = (e, value) => {
        e.preventDefault();
        getBannerData(value);
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        getBannerData(currentPage);
    }, []);

    const handleCloseDel = () => {
        setOpenDel(false);
    };

    const openDeleteBanner = (id) => {
        setDeleteId(id);
        setOpenDel(true);
    };

    const deleteBanner = (e) => {
        e.preventDefault();
        isLoad(true);

        deleteData('/api/homeBanner/', deleteId)
            .then((res) => {
                fetchDataFromApi('/api/homeBanner').then((res) => {
                    getBannerData(currentPage);
                    setHomeBannerData(res);
                    setOpenDel(false);
                    isLoad(false);
                    context.handleClickVariant('Delete banner successful!', 'success');
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
                        <h3 className="hd">Banner List</h3>
                        <Button variant="contained" className="ms-auto fw-bold">
                            <Link to="/homeBanner/add">Add Home Banner</Link>
                        </Button>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="theadDesign">
                                <tr>
                                    <th>UID</th>
                                    <th>PAGE</th>
                                    <th>IMAGE</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {homeBannerData?.bannerList?.length !== 0 &&
                                    homeBannerData?.bannerList?.map((item, index) => (
                                        <tr key={item.id}>
                                            <td># {index + 1}</td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{item.page}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="imgWrapper">
                                                    <div className="img card m-0">
                                                        <img className="w-100" src={item.images[0]} alt="Image" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="actions dFlexAliJus-center">
                                                    <Button className="edit me-2">
                                                        <Link to={`/homeBanner/edit/${item.id}`}>
                                                            <MdEdit />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        className="delete"
                                                        onClick={() => openDeleteBanner(item.id)}
                                                    >
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
                            <form onSubmit={deleteBanner}>
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
                                Totals <b>{homeBannerData?.totalBanners}</b> banners
                            </p>

                            <Pagination
                                page={currentPage}
                                count={homeBannerData?.totalPages}
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

export default HomeBannerList;
