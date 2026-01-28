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

// React
import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

// API
import { fetchDataFromApi } from '../../utils/api';

// Components
import DashboardBox from './dashboardBox';

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

const Account = () => {
    const [showBy, setShowBy] = useState('');
    const [catBy, setCatBy] = useState('admin');
    const [anchorEl, setAnchorEl] = useState(null);
    const [adminData, setAdminData] = useState([]);
    const [currentPageAdmin, setCurrentPageAdmin] = useState(1);
    const [totalPageAdmin, setTotalPageAdmin] = useState(1);
    const [userData, setUserData] = useState([]);
    const [currentPageUser, setCurrentPageUser] = useState(1);
    const [totalPageUser, setTotalPageUser] = useState(1);

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi('/api/admin/getAccount?page=1')
            .then((res) => {
                setAdminData(res.adminList);
                setCurrentPageAdmin(res.currentPage);
                setTotalPageAdmin(res.totalPages);
            })
            .catch((err) => {
                console.error(err);
            });

        fetchDataFromApi('/api/user/getAccount?page=1')
            .then((res) => {
                setUserData(res.users);
                setCurrentPageUser(res.currentPage);
                setTotalPageUser(res.totalPages);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        if (catBy === 'admin') {
            fetchDataFromApi(`/api/admin/getAccount?page=${currentPageAdmin}`)
                .then((res) => {
                    setAdminData(res.adminList);
                    setCurrentPageAdmin(res.currentPage);
                    setTotalPageAdmin(res.totalPages);
                })
                .catch((err) => {
                    console.error(err);
                });
        } else if (catBy === 'user') {
            fetchDataFromApi(`/api/user/getAccount?page=${currentPageUser}`)
                .then((res) => {
                    setUserData(res.users);
                    setCurrentPageUser(res.currentPage);
                    setTotalPageUser(res.totalPages);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [catBy, currentPageAdmin, currentPageUser]);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <section className="right-content w-100">
                <div className="row dashboardBoxWrapperRow">
                    <div className="col-md-8">
                        <div className="dashboardBoxWrapper d-flex">
                            <DashboardBox
                                title="Total None-Accepts"
                                color={['rgb(29, 162, 86)', 'rgb(72, 212, 131)']}
                                icon={<FaUserCircle />}
                                chart={true}
                            />
                            <DashboardBox
                                title="Total Accepted"
                                color={['rgb(192, 18, 226)', 'rgb(235, 100, 254)']}
                                icon={<FaShoppingCart />}
                                chart={false}
                            />
                            <DashboardBox
                                title="Total Managers"
                                color={['rgb(44, 120, 229)', 'rgb(96, 175, 245)']}
                                icon={<FaBagShopping />}
                                chart={false}
                            />
                            <DashboardBox
                                title="Total Admins"
                                color={['rgb(225, 149, 14)', 'rgb(243, 205, 41)']}
                                icon={<GiStarsStack />}
                                chart={true}
                            />
                        </div>
                    </div>

                    <div className="col-md-4 ps-0">
                        <div className="box graphBox">
                            <div className="dFlexAli-center bottomEle w-100">
                                <h6 className="text-white mb-0">Total Quizzes</h6>
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
                            <h4>CATEGORY BY</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    className="w-100"
                                    value={catBy}
                                    onChange={(e) => setCatBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value={'admin'}>Admin</MenuItem>
                                    <MenuItem value={'user'}>User</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className="table-responsive mt-3">
                        {catBy === 'admin' ? (
                            <table className="table table-bordered v-align">
                                <thead className="theadDesign">
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {adminData.map((admin, index) => (
                                        <tr key={index}>
                                            <td># {index + 1}</td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{admin.name}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{admin.email}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{admin.isAdmin ? 'Admin' : 'Manager'}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="actions dFlexAliJus-center">
                                                    <Button className="edit me-2">
                                                        <MdEdit />
                                                    </Button>
                                                    <Button className="delete">
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="table table-bordered v-align">
                                <thead className="theadDesign">
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Quiz Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {userData.map((user, index) => (
                                        <tr key={index}>
                                            <td>#1</td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{user.name}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{user.email}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{user.quizCreated}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="actions dFlexAliJus-center">
                                                    <Button className="edit me-2">
                                                        <MdEdit />
                                                    </Button>
                                                    <Button className="delete">
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {/* <div className="dFlexAli-center tableFooter pt-1">
                            <p className="mb-0 me-auto">
                                Totals <b>{fieldData?.totalFields}</b> fields
                            </p>

                            <Pagination
                                page={currentPage}
                                count={fieldData?.totalPages}
                                color="primary"
                                showFirstButton
                                showLastButton
                                onChange={handleChangePage}
                            />
                        </div> */}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Account;
