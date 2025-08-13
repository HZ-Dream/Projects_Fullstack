// Icons
import { FaUserCircle } from 'react-icons/fa';
import { FaShoppingCart } from 'react-icons/fa';
import { FaBagShopping } from 'react-icons/fa6';
import { GiStarsStack } from 'react-icons/gi';
import { HiDotsHorizontal } from 'react-icons/hi';
import { IoIosTimer } from 'react-icons/io';
import { FaEye } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

// Material UI
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Pagination from '@mui/material/Pagination';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useState, useEffect, useContext } from 'react';
import { Chart } from 'react-google-charts';
import { Link } from 'react-router-dom';

// Components
import DashboardBox from './components/dashboardBox';

// Utils
import { fetchDataFromApi, deleteData } from '../../utils/api';

// Context
import { MyContext } from '../../App';

const data = [
    ['Task', 'Hours per Day'],
    ['Work', 9],
    ['Eat', 2],
    ['Commute', 2],
    ['Watch TV', 2],
    ['Sleep', 7],
];

const options = {
    backgroundColor: 'transparent',
    chartArea: {
        width: '100%',
        height: '90%',
    },
};

const Dashboard = () => {
    const context = useContext(MyContext);

    const [showBy, setShowBy] = useState('');
    const [catBy, setCatBy] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    // Set Product Data
    const [proData, setProData] = useState([]);
    // Delete Modal
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState('');
    // Set load
    const [load, isLoad] = useState(false);

    // Set Page
    const [currentPage, setCurrentPage] = useState(1);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const getCategoryData = (page) => {
        fetchDataFromApi(`/api/product?page=${page}`).then((res) => {
            setProData(res);
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

    const deleteProductModal = (id) => {
        setDeleteProductId(id);
        setDeleteModal(true);
    };

    const handleCloseDel = () => {
        setDeleteModal(false);
    };

    const deleteProduct = (e) => {
        e.preventDefault();
        isLoad(true);

        deleteData('/api/product/', deleteProductId)
            .then((res) => {
                fetchDataFromApi('/api/product').then((res) => {
                    getCategoryData(currentPage);
                    setProData(res);
                    setDeleteModal(false);
                    isLoad(false);
                    context.handleClickVariant('Delete product successful!', 'success');
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
                <div className="row dashboardBoxWrapperRow">
                    <div className="col-md-8">
                        <div className="dashboardBoxWrapper d-flex">
                            <DashboardBox
                                color={['rgb(29, 162, 86)', 'rgb(72, 212, 131)']}
                                icon={<FaUserCircle />}
                                chart={true}
                            />
                            <DashboardBox
                                color={['rgb(192, 18, 226)', 'rgb(235, 100, 254)']}
                                icon={<FaShoppingCart />}
                                chart={false}
                            />
                            <DashboardBox
                                color={['rgb(44, 120, 229)', 'rgb(96, 175, 245)']}
                                icon={<FaBagShopping />}
                                chart={false}
                            />
                            <DashboardBox
                                color={['rgb(225, 149, 14)', 'rgb(243, 205, 41)']}
                                icon={<GiStarsStack />}
                                chart={true}
                            />
                        </div>
                    </div>

                    <div className="col-md-4 ps-0 topPart2">
                        <div className="box graphBox">
                            <div className="dFlexAli-center bottomEle w-100">
                                <h6 className="text-white mb-0">Total Sales</h6>
                                <IconButton className="ms-auto text-white fw-bold" size="medium" onClick={handleClick}>
                                    <HiDotsHorizontal />
                                </IconButton>

                                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                                    <MenuItem onClick={handleClose}>
                                        <IoIosTimer className="me-1" /> Last Day
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        <IoIosTimer className="me-1" /> Last Week
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        <IoIosTimer className="me-1" /> Last Month
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        <IoIosTimer className="me-1" /> Last Year
                                    </MenuItem>
                                </Menu>
                            </div>
                            <h3 className="text-white fw-bold">$3,787,681.00</h3>
                            <p>$3,578.90 in last month</p>

                            <Chart chartType="PieChart" data={data} options={options} width={'100%'} height={'170px'} />
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Best Selling Products</h3>

                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>SHOW BY</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    className="w-100"
                                    value={showBy}
                                    onChange={(e) => setShowBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div className="col-md-3">
                            <h4>CATEGORY BY</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    className="w-100"
                                    value={catBy}
                                    onChange={(e) => setCatBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="theadDesign">
                                <tr>
                                    <th>UID</th>
                                    <th>PRODUCT</th>
                                    <th>CATEGORY</th>
                                    <th>BRAND</th>
                                    <th>PRICE</th>
                                    <th>STOCK</th>
                                    <th>RATING</th>
                                    <th>ORDER</th>
                                    <th>SALES</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {proData?.productList?.length > 0
                                    ? proData?.productList?.map((product, index) => (
                                          <tr key={product.id}>
                                              <td># {index + 1}</td>
                                              <td>
                                                  <div className="dFlexAli-center productBox">
                                                      <div className="imgWrapper">
                                                          <div className="img card m-0">
                                                              <img
                                                                  className="w-100"
                                                                  src={`${process.env.REACT_APP_BASE_URL}/uploads/products/${product.images[0]}`}
                                                                  alt="Image"
                                                              />
                                                          </div>
                                                      </div>

                                                      <div className="info ps-2">
                                                          <h6>{product.name}</h6>
                                                          <p>{product.desciption}</p>
                                                      </div>
                                                  </div>
                                              </td>
                                              <td>{product.category.name}</td>
                                              <td>{product.brand}</td>
                                              <td>
                                                  <del className="old">${product.priceInit}.00</del>
                                                  <span className="new text-danger">${product.priceDiscount}.00</span>
                                              </td>
                                              <td>{product.quantity}</td>
                                              <td>4.9 (15)</td>
                                              <td>355</td>
                                              <td>$38K</td>
                                              <td>
                                                  <div className="actions dFlexAli-center justify-content-around">
                                                      <Button className="detail">
                                                          <Link to="/product/detail/1">
                                                              <FaEye />
                                                          </Link>
                                                      </Button>
                                                      <Button className="edit">
                                                          <MdEdit />
                                                      </Button>
                                                      <Button
                                                          onClick={() => deleteProductModal(product.id)}
                                                          className="delete"
                                                      >
                                                          <FaTrash />
                                                      </Button>
                                                  </div>
                                              </td>
                                          </tr>
                                      ))
                                    : null}
                            </tbody>
                        </table>

                        <Dialog className="editCategoryModal" open={deleteModal} onClose={handleCloseDel}>
                            <DialogTitle className="dFlexAli-center">
                                <span className="me-2 text-danger fw-bold">Delete Product</span>
                                {load === true && <CircularProgress className="loader" color="inherit" />}
                            </DialogTitle>
                            <form onSubmit={deleteProduct}>
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
                                showing <b>6</b> of <b>60</b> results
                            </p>

                            <Pagination
                                page={currentPage}
                                count={proData?.totalPages}
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

export default Dashboard;
