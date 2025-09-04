// Icons
import { FaEye } from 'react-icons/fa';

// Material UI
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// React
import { useState, useEffect, useContext } from 'react';

// Others
import { fetchDataFromApi } from '../../utils/api';

// Context
import { MyContext } from '../../App';

const Order = () => {
    const context = useContext(MyContext);

    // Set Data Category
    const [orderData, setOrderData] = useState([]);
    // Set Page
    const [currentPage, setCurrentPage] = useState(1);
    // View Detail
    const [itemData, setItemData] = useState([]);
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleTotalAmount = (arr) => {
        return arr.reduce((sum, item) => sum + item.total, 0);
    };

    const getCategoryData = (page) => {
        fetchDataFromApi(`/api/order?page=${page}`).then((res) => {
            setOrderData(res);
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

    const handleClickOpen = (data) => {
        setOpen(true);
        setItemData(data);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <section className="right-content w-100">
                <div className="card shadow border-0 p-3">
                    <div className="dFlexAli-center">
                        <h3 className="hd">Order List</h3>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="theadDesign">
                                <tr>
                                    <th>UID</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Method</th>
                                    <th>Total Amount</th>
                                    <th>Note</th>
                                    <th>Detail</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orderData?.orderList?.length !== 0 &&
                                    orderData?.orderList?.map((item, index) => (
                                        <tr key={item.id}>
                                            <td># {index + 1}</td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{item.fullName}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{item.phone}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{item.address}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{item.method}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{handleTotalAmount(item.orders)}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{item.note}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="actions dFlexAliJus-center">
                                                    <Button
                                                        className="edit me-2"
                                                        onClick={() => handleClickOpen(item.orders)}
                                                    >
                                                        <FaEye />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                        <Dialog
                            fullScreen={fullScreen}
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="responsive-dialog-title"
                        >
                            <DialogTitle id="responsive-dialog-title">Products Detail</DialogTitle>
                            <DialogContent>
                                {open === true ? (
                                    <table className="table table-striped">
                                        <thead className="table-success">
                                            <tr>
                                                <th>Image</th>
                                                <th>Id</th>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {itemData?.length !== 0 &&
                                                itemData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <img
                                                                className="w-50"
                                                                src={item.image}
                                                                alt={item.productName}
                                                            />
                                                        </td>
                                                        <td>{item.productId}</td>
                                                        <td>{item.productName}</td>
                                                        <td>{item.price}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.total}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    ''
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} autoFocus>
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <div className="dFlexAli-center tableFooter pt-1">
                            <p className="mb-0 me-auto">
                                Totals <b>{orderData?.totalOrders}</b> categories
                            </p>

                            <Pagination
                                page={currentPage}
                                count={orderData?.totalPages}
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

export default Order;
