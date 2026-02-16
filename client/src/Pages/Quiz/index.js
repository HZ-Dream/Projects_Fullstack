// Icons, Button
import { TiThMenu } from 'react-icons/ti';
import { BsGrid3X3GapFill } from 'react-icons/bs';
import { TfiLayoutGrid4Alt } from 'react-icons/tfi';
import { FaSort } from 'react-icons/fa';
import Button from '@mui/material/Button';

// Menu
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Pagination
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

// React
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Components
import Sidebar from '../../Components/Sidebar';
import QuizItem from '../../Components/QuizItem';

// API
import { fetchDataFromApi } from '../../utils/api';

// CSS
import styles from './QuizIndex.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Quiz = () => {
    const location = useLocation();
    const { searchResults } = location.state || {};

    const [anchorEl, setAnchorEl] = useState(null);
    const [sortBy, setSortBy] = useState('');
    const [quizView, setQuizView] = useState('four');
    const [quizData, setQuizData] = useState([]);
    const [showPage, setShowPage] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const act = cx('act');

    const [filters, setFilters] = useState({
        fields: [],
        most: '',
        sort: '',
    });

    useEffect(() => {
        window.scrollTo(0, 0);

        if (searchResults) {
            setQuizData(searchResults);
            setShowPage(false);
            return;
        } else {
            fetchDataFromApi(`/api/quiz/quizList?page=1`).then((res) => {
                setQuizData(res.quizzes);
                setTotalPages(res.totalPages);
                setShowPage(true);
            });
        }
    }, []);

    useEffect(() => {
        if (searchResults) {
            setQuizData(searchResults);
            setShowPage(false);
            return;
        } else {
            fetchDataFromApi(`/api/quiz/quizList?page=1`).then((res) => {
                setQuizData(res.quizzes);
                setTotalPages(res.totalPages);
                setShowPage(true);
            });
        }
    }, [searchResults]);

    useEffect(() => {
        const params = new URLSearchParams();

        params.append('page', page);

        if (filters.fields.length > 0) {
            params.append('field', filters.fields.join(','));
        }

        if (filters.most) {
            params.append('most', filters.most);
        }

        if (filters.sort) {
            params.append('sort', filters.sort);
        }

        fetchDataFromApi(`/api/quiz/quizList?${params.toString()}`).then((res) => {
            if (searchResults) {
                setQuizData(searchResults);
                setShowPage(false);
                return;
            }
            setQuizData(res.quizzes);
            setTotalPages(res.totalPages);
            setShowPage(true);
        });
    }, [page, filters]);

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

        let sortValue = '';
        if (value === 'Sort by Latest') {
            sortValue = 'latest';
        } else if (value === 'Sort by Oldest') {
            sortValue = 'oldest';
        } else if (value === 'Sort by Rate: low to high') {
            sortValue = 'rate_low';
        } else if (value === 'Sort by Rate: high to low') {
            sortValue = 'rate_high';
        }

        setFilters({
            fields: [],
            most: '',
            sort: sortValue,
        });

        setPage(1);
        setShowPage(true);
    };

    return (
        <>
            <section className={cx('product_Listing_Page')}>
                <div className="container">
                    <div className={`${cx('productListing')} d-flex`}>
                        <Sidebar
                            className={cx('sidebar')}
                            filters={filters}
                            onFilterChange={(filters) => {
                                setFilters(filters);
                                setPage(1);
                            }}
                        />

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
                                        className={quizView === 'one' ? act : ''}
                                        onClick={() => setQuizView('one')}
                                    >
                                        <TiThMenu />
                                    </Button>
                                    <Button
                                        className={quizView === 'three' ? act : ''}
                                        onClick={() => setQuizView('three')}
                                    >
                                        <BsGrid3X3GapFill />
                                    </Button>
                                    <Button
                                        className={quizView === 'four' ? act : ''}
                                        onClick={() => setQuizView('four')}
                                    >
                                        <TfiLayoutGrid4Alt />
                                    </Button>
                                </div>

                                <div className={`ms-auto ${cx('showByFilter')}`}>
                                    <Button className="text-capitalize" onClick={handleClick}>
                                        {sortBy} <FaSort />
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
                                        <MenuItem onClick={() => handleSortBy('Show All')}>Show All</MenuItem>
                                        <MenuItem onClick={() => handleSortBy('Sort by Latest')}>Latest</MenuItem>
                                        <MenuItem onClick={() => handleSortBy('Sort by Oldest')}>Oldest</MenuItem>
                                        <MenuItem onClick={() => handleSortBy('Sort by Rate: low to high')}>
                                            Rate: low to high
                                        </MenuItem>
                                        <MenuItem onClick={() => handleSortBy('Sort by Rate: high to low')}>
                                            Rate: high to low
                                        </MenuItem>
                                    </Menu>
                                </div>
                            </div>

                            <div className={cx('productListing')}>
                                {quizData.length === 0 && <h3>No quizzes found.</h3>}

                                {quizData?.length > 0 &&
                                    quizData.map((item) => {
                                        return <QuizItem key={item._id} itemView={quizView} data={item} />;
                                    })}
                            </div>

                            <div style={{ display: showPage ? 'block' : 'none' }}>
                                <div
                                    className={`d-flex align-items-center justify-content-center mt-5 ${cx('paginateQuizList')}`}
                                >
                                    <Stack spacing={2}>
                                        <Pagination
                                            onChange={(e, value) => setPage(value)}
                                            count={totalPages}
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
                </div>
            </section>
        </>
    );
};

export default Quiz;
