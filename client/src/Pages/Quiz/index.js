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
import QuizItem from '../../Components/QuizItem';

// CSS
import styles from './QuizIndex.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Quiz = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [sortBy, setSortBy] = useState('');
    const [productView, setProductView] = useState('four');
    const act = cx('act');

    const openDrop = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const closeDrop = () => {
        setAnchorEl(null);
    };

    const handleSortBy = (value) => {
        setSortBy(value);
        closeDrop();
    };

    return (
        <>
            <section className={cx('product_Listing_Page')}>
                <div className="container">
                    <div className={`${cx('productListing')} d-flex`}>
                        <Sidebar className={cx('sidebar')} />

                        <div className={cx('content_right')}>
                            <img
                                className="w-100"
                                src="https://klbtheme.com/bacola/wp-content/uploads/2021/08/bacola-banner-18.jpg"
                                alt="Banner"
                                style={{ borderRadius: '10px' }}
                            />

                            <div className={`${cx('showBy')} mt-3 mb-3 d-flex align-items-center`}>
                                <div className={`d-flex align-items-center ${cx('btnWrapper')}`}>
                                    <Button
                                        className={productView === 'one' ? act : ''}
                                        onClick={() => setProductView('one')}
                                    >
                                        <TiThMenu />
                                    </Button>
                                    <Button
                                        className={productView === 'three' ? act : ''}
                                        onClick={() => setProductView('three')}
                                    >
                                        <BsGrid3X3GapFill />
                                    </Button>
                                    <Button
                                        className={productView === 'four' ? act : ''}
                                        onClick={() => setProductView('four')}
                                    >
                                        <TfiLayoutGrid4Alt />
                                    </Button>
                                </div>

                                <div className={`ms-auto ${cx('showByFilter')}`}>
                                    <Button className="text-capitalize" onClick={handleClick}>
                                        Sort {sortBy} <FaAngleDown />
                                    </Button>

                                    <Menu
                                        className={`w-100 ${cx('showPerPage')}`}
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
                                        <MenuItem onClick={() => handleSortBy('')}>Show All</MenuItem>
                                        <MenuItem onClick={() => handleSortBy('by Lastest')}>By Lastest</MenuItem>
                                        <MenuItem onClick={() => handleSortBy('by Popularity')}>By Popularity</MenuItem>
                                        <MenuItem onClick={() => handleSortBy('by Rate: low to high')}>
                                            By Rate: low to high
                                        </MenuItem>
                                        <MenuItem onClick={() => handleSortBy('By Rate: high to low')}>
                                            By Rate: high to low
                                        </MenuItem>
                                    </Menu>
                                </div>
                            </div>

                            <div className={cx('productListing')}>
                                <QuizItem itemView={productView} />
                                <QuizItem itemView={productView} />
                                <QuizItem itemView={productView} />
                                <QuizItem itemView={productView} />
                                <QuizItem itemView={productView} />
                                <QuizItem itemView={productView} />
                                <QuizItem itemView={productView} />
                                <QuizItem itemView={productView} />
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

export default Quiz;
