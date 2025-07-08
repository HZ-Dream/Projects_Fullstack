// Icons, Button
import { TiThMenu } from 'react-icons/ti';
import { BsGrid3X3GapFill } from 'react-icons/bs';
import { TfiLayoutGrid4Alt } from 'react-icons/tfi';
import { FaAngleDown } from 'react-icons/fa6';
import Button from '@mui/material/Button';

// Menu
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// Pagination
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

// React
import { useState } from 'react';

// Components
import Sidebar from '../../Components/Sidebar';
import ProductItem from '../../Components/ProductItem';

const Listing = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [productView, setProductView] = useState('four');

    const openDrop = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const closeDrop = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <section className="product_Listing_Page">
                <div className="container">
                    <div className="productListing d-flex">
                        <Sidebar />

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

                                <div className="ms-auto showByFilter">
                                    <Button onClick={handleClick}>
                                        Show 12 <FaAngleDown />
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
                                        <MenuItem onClick={closeDrop}>12</MenuItem>
                                        <MenuItem onClick={closeDrop}>24</MenuItem>
                                        <MenuItem onClick={closeDrop}>36</MenuItem>
                                    </Menu>
                                </div>
                            </div>

                            <div className="productListing">
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                            </div>

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
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Listing;
