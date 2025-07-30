// Icons
import { FaUserCircle } from 'react-icons/fa';
import { FaShoppingCart } from 'react-icons/fa';
import { FaBagShopping } from 'react-icons/fa6';
import { GiStarsStack } from 'react-icons/gi';
import { HiDotsHorizontal } from 'react-icons/hi';
import { IoIosTimer } from 'react-icons/io';

// Material UI
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

// React
import { useState } from 'react';
import React from 'react';
import { Chart } from 'react-google-charts';

// Components
import DashboardBox from './components/dashboardBox';

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
    const [anchorEl, setAnchorEl] = useState(null);
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

                    <div className="col-md-4 ps-0">
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

                    <div className="row">
                        <div className="col">
                            <h4>SHOW BY</h4>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Dashboard;
