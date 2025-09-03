// Icons
import { RiDeleteBin5Line } from 'react-icons/ri';

// Material UI
import Rating from '@mui/material/Rating';

// React
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Utils
import { fetchDataFromApi, deleteData } from '../../utils/api';

import { MyContext } from '../../App';

const MyList = () => {
    const context = useContext(MyContext);
    const [listData, setListData] = useState([]);

    useEffect(() => {
        if (Object.keys(context.userData).length === 0) {
            context.handleClickVariant('You need sign in!', 'error');
            return;
        }

        fetchDataFromApi(`/api/myList/${context.userData.userId}`).then((res) => {
            setListData(res);
        });
    }, []);

    useEffect(() => {
        fetchDataFromApi(`/api/myList/${context.userData.userId}`).then((res) => {
            setListData(res);
        });
    }, [context.wishlistData]);

    const removeItem = (id) => {
        deleteData('/api/myList/', id).then((res) => {
            context.handleClickVariant('Delete item success!', 'success');

            fetchDataFromApi(`/api/myList/${context.userData.userId}`).then((res) => {
                setListData(res);
            });
        });
    };

    return (
        <>
            <section className="section cartPage">
                <div className="container">
                    <div className="row">
                        <h2 className="hd mb-0">Your Wishlist</h2>
                        <p>
                            There are &nbsp;
                            <b className="text-red">{listData.length > 0 ? listData.length : 0}</b>
                            &nbsp; products in your cart
                        </p>
                        <div className="col-md-12 pe-5">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th width="30%">Product</th>
                                            <th width="15%">Unit Price</th>
                                            <th width="15%">Dis Price</th>
                                            <th width="10%">Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listData?.length > 0 &&
                                            listData.map((item, index) => (
                                                <tr key={index}>
                                                    <td width="30%">
                                                        <Link to={`/product/${item.productId}`}>
                                                            <div className="dFlexAli-center cartItemWrapper">
                                                                <div className="imgWrapper">
                                                                    <img
                                                                        className="w-100"
                                                                        src={item.image}
                                                                        alt={item.productTitle}
                                                                    />
                                                                </div>

                                                                <div className="info px-3">
                                                                    <h6>{item.productTitle}</h6>
                                                                    <Rating
                                                                        name="read-only"
                                                                        value={item.rating}
                                                                        readOnly
                                                                        size="small"
                                                                        precision={0.5}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </td>
                                                    <td width="15%">${item.priceInit}</td>
                                                    <td className="text-danger" width="15%">
                                                        ${item.priceDiscount}
                                                    </td>
                                                    <td width="10%">
                                                        <span className="remove" onClick={() => removeItem(item.id)}>
                                                            <RiDeleteBin5Line />
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default MyList;
