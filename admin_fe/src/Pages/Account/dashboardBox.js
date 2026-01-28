// Icons
import { FaArrowTrendUp } from 'react-icons/fa6';
import { FaArrowTrendDown } from 'react-icons/fa6';
import { HiDotsVertical } from 'react-icons/hi';
import { IoIosTimer } from 'react-icons/io';

// Material UI
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// React
import { useState } from 'react';

const DashboardBox = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Button
            className="dashboardBox"
            style={{
                backgroundImage: `linear-gradient(to right, ${props.color?.[0]}, ${props.color?.[1]})`,
            }}
        >
            <span className="chart">{props.chart === true ? <FaArrowTrendUp /> : <FaArrowTrendDown />}</span>

            <div className="d-flex w-100">
                <div className="col1">
                    <h4 className="text-white mb-0">{props.title}</h4>
                    <span className="text-white">277</span>
                </div>

                <div className="ms-auto">{props.icon ? <div className="icon">{props.icon}</div> : ''}</div>
            </div>

            <div className="dFlexAli-center bottomEle w-100">
                <h6 className="text-white mb-0">Last Month</h6>
                <div className="ms-auto toggleIcon ps-3" size="small" onClick={handleClick}>
                    <HiDotsVertical />
                </div>

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
        </Button>
    );
};

export default DashboardBox;
