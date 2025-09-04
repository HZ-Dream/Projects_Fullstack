// Icons
import { FaEye } from 'react-icons/fa';

// Material UI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// React
import { useState, useEffect, useContext } from 'react';

// API
import { fetchDataFromApi } from '../../utils/api';

import { MyContext } from '../../App';

const Order = () => {
    const context = useContext(MyContext);
    const [orderData, setOrderData] = useState([]);
    const [itemData, setItemData] = useState([]);
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi(`/api/order/${context.userData.userId}`).then((res) => {
            setOrderData(res);
        });
    }, []);

    useEffect(() => {
        fetchDataFromApi(`/api/order/${context.userData.userId}`).then((res) => {
            setOrderData(res);
        });
    }, [context.myCart]);

    const handleTotalAmount = (arr) => {
        return arr.reduce((sum, item) => sum + item.total, 0);
    };

    const handleClickOpen = (data) => {
        setOpen(true);
        setItemData(data);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <section className="section">
            <div className="container">
                <h2 className="hd text-capitalize">Orders</h2>

                <div className="table-responsive mt-4">
                    <table className="table table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>Payment Id</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Method</th>
                                <th>Total Amount</th>
                                <th>View Detail</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orderData?.length !== 0 &&
                                orderData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td>{item.phone}</td>
                                        <td>{item.address}</td>
                                        <td>{item.method}</td>
                                        <td>{handleTotalAmount(item.orders)}</td>
                                        <td>
                                            <Button className="detail" onClick={() => handleClickOpen(item.orders)}>
                                                <FaEye />
                                            </Button>
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
                                                        <img className="w-50" src={item.image} alt={item.productName} />
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
                </div>
            </div>
        </section>
    );
};

export default Order;
