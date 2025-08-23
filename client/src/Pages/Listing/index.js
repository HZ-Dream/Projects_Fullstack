// Icons, Button
import { TiThMenu } from 'react-icons/ti';
import { BsGrid3X3GapFill } from 'react-icons/bs';
import { TfiLayoutGrid4Alt } from 'react-icons/tfi';
import { FaAngleDown } from 'react-icons/fa6';
import { TfiReload } from 'react-icons/tfi';
import Button from '@mui/material/Button';

// Menu
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// Pagination
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

// React
import { useState, useEffect, useContext } from 'react';

// Components
import Sidebar from '../../Components/Sidebar';
import ProductItem from '../../Components/ProductItem';

// Utils
import { fetchDataFromApi } from '../../utils/api';

import { MyContext } from '../../App';

const Listing = () => {
    const context = useContext(MyContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const [productView, setProductView] = useState('four');
    const [proData, setProData] = useState(context.proDataList || []);
    const [perPage, setPerPage] = useState(8);

    const openDrop = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const closeDrop = (value) => {
        setPerPage(value);
        setAnchorEl(null);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setProData(context.proDataList || []);
    }, [context.proDataList]);

    // useEffect(() => {
    //     fetchDataFromApi(`/api/product?perPage=${perPage}`).then((res) => {
    //         setProData(res.productList);
    //     });
    // }, [perPage]);

    return (
        <>
            <section className="product_Listing_Page">
                <div className="container">
                    <div className="productListing d-flex">
                        <Sidebar proData={context.proData} catData={context.catData} />

                        <div className="content_right">
                            <img
                                className="w-100"
                                src="https://klbtheme.com/bacola/wp-content/uploads/2021/08/bacola-banner-18.jpg"
                                alt="Banner"
                                style={{ borderRadius: '10px' }}
                            />

                            <div className="showBy mt-3 mb-3 d-flex align-items-center">
                                <div className="d-flex align-items-center btnWrapper">
                                    <Button
                                        className={productView === 'one' ? 'act' : ''}
                                        onClick={() => setProductView('one')}
                                    >
                                        <TiThMenu />
                                    </Button>
                                    <Button
                                        className={productView === 'three' ? 'act' : ''}
                                        onClick={() => setProductView('three')}
                                    >
                                        <BsGrid3X3GapFill />
                                    </Button>
                                    <Button
                                        className={productView === 'four' ? 'act' : ''}
                                        onClick={() => setProductView('four')}
                                    >
                                        <TfiLayoutGrid4Alt />
                                    </Button>
                                </div>
                                <div className="d-flex align-items-center btnWrapper">
                                    <Button onClick={() => context.setProDataList(context.proData)}>
                                        <TfiReload />
                                    </Button>
                                </div>

                                <div className="ms-auto showByFilter">
                                    <Button onClick={handleClick}>
                                        Show {perPage} <FaAngleDown />
                                    </Button>

                                    <Menu
                                        className="w-100 showPerPage"
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={openDrop}
                                        onClose={closeDrop}
                                        slotProps={{
                                            list: {
                                                'aria-labelledby': 'basic-button',
                                            },
                                        }}
                                    >
                                        <MenuItem onClick={() => closeDrop(8)}>8</MenuItem>
                                        <MenuItem onClick={() => closeDrop(12)}>12</MenuItem>
                                        <MenuItem onClick={() => closeDrop(16)}>16</MenuItem>
                                    </Menu>
                                </div>
                            </div>

                            <div className="productListing">
                                {proData?.length > 0 ? (
                                    proData.map((data, index) => (
                                        <ProductItem key={index} productData={data} itemView={productView} />
                                    ))
                                ) : (
                                    <h5 className="mx-auto mt-5">There is no product you are looking for</h5>
                                )}
                            </div>

                            {proData?.length > 0 ? (
                                <div className="d-flex align-items-center justify-content-center mt-5">
                                    <Stack spacing={2}>
                                        <Pagination
                                            count={10}
                                            color="primary"
                                            size="large"
                                            showFirstButton
                                            showLastButton
                                        />
                                    </Stack>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Listing;
