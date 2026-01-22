// Material UI
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@mui/lab';

// React
import { useContext, useEffect, useState } from 'react';

// Pagination
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

// Utils
import { fetchDataFromApi, postData, editData } from '../../utils/api';

// CSS
import styles from './Profile.module.scss';
import classNames from 'classnames/bind';

import { MyContext } from '../../App';
import QuizItem from '../../Components/QuizItem';

const cx = classNames.bind(styles);

const MyQuizzes = () => {
    const context = useContext(MyContext);
    const [value, setValue] = useState('1');
    const [wishlistData, setWishlistData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const userData = JSON.parse(localStorage.getItem('user'));

    const fetchWishlist = async (pageNumber = page) => {
        const res = await fetchDataFromApi(`/api/user/getUserWishlist/${userData.userId}?page=${pageNumber}`);

        // ⬅️ nếu page hiện tại > totalPages mới → lùi page
        if (pageNumber > res.totalPages && res.totalPages > 0) {
            setPage(res.totalPages);
            return;
        }

        setWishlistData(res.wishlist);
        setTotalPages(res.totalPages);
    };

    useEffect(() => {
        fetchWishlist(page);
    }, [page]);

    const handleRemoveWishlist = async (quizId) => {
        // 1️⃣ Optimistic UI
        setWishlistData((prev) => prev.filter((item) => item._id !== quizId));

        // 2️⃣ Sync lại với backend (QUAN TRỌNG)
        await fetchWishlist(page);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="container">
            <h2 className="hd text-capitalize mb-3">My Quizzes</h2>
            <Box className="myAccBox card" sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example" variant="fullWidth">
                            <Tab label="Wishlist" value="1" />
                            <Tab label="Save for later" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        {wishlistData.length > 0 ? (
                            <div className={`${cx('quizList_row')} mt-4`}>
                                {wishlistData.map((quiz) => (
                                    <QuizItem
                                        key={quiz._id}
                                        className={`${cx('quizItem')} itemRow_4 ms-2`}
                                        data={quiz}
                                        onRemoveFromWishlist={handleRemoveWishlist}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p>No quizzes in your wishlist.</p>
                        )}

                        {wishlistData.length > 0 && (
                            <div className="d-flex align-items-center justify-content-center mt-5">
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
                        )}
                    </TabPanel>
                    <TabPanel value="2"></TabPanel>
                </TabContext>
            </Box>
        </div>
    );
};

export default MyQuizzes;
