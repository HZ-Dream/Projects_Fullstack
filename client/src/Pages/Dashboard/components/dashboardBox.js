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
            <div className="d-flex w-100">
                <div className="col1">
                    <h4 className="text-white mb-0 fw-bold">{props.title || 'Dashboard Box'}</h4>
                    <span className="text-white">{props.data || 0}</span>
                </div>

                <div className="ms-auto">{props.icon ? <div className="icon">{props.icon}</div> : ''}</div>
            </div>
        </Button>
    );
};

export default DashboardBox;
