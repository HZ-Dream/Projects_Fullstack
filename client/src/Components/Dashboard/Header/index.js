// Icons
import { RiMenuUnfold2Fill } from 'react-icons/ri';
import { RiMenuLine } from 'react-icons/ri';
import { IoSunnyOutline } from 'react-icons/io5';
import { FaMoon } from 'react-icons/fa';
import { FaRegBell } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';

// Images
import Logo from '../../../assets/images/logo.png';
import avatarImg from '../../../assets/images/avatar.jpg';

// Material UI
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';

// React
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';

// Components
import SearchBox from '../SearchBox';
import { MyContext } from '../../../App';
import UserAvatarImgComponent from '../UserAvatarImg';

const HeaderDashboard = () => {
    const context = useContext(MyContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationDrop, setNotificationDrop] = useState(null);
    const open = Boolean(anchorEl);
    const open2 = Boolean(notificationDrop);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenNotice = () => {
        setNotificationDrop(true);
    };
    const handleCloseNotice = () => {
        setNotificationDrop(false);
    };

    return (
        <>
            <header className="dFlexAli-center dashboard">
                <div className="container-fluid w-100">
                    <div className="row dFlexAli-center">
                        {/* Logo Wrapper */}
                        <div className="part1 col-sm-3 ps-4">
                            <Link to="/" className="dFlexAli-center logo">
                                <img src={Logo} alt="Logo" />
                                <span className="ms-2">Dream</span>
                            </Link>
                        </div>

                        {context.windowWidth > 992 && (
                            <div className="part2 col-sm-3 dFlexAli-center me-5 res-hide">
                                <Button
                                    className="rounded-circle me-3"
                                    onClick={() => context.setMenuBtn(!context.menuBtn)}
                                >
                                    {context.menuBtn === true ? <RiMenuUnfold2Fill /> : <RiMenuLine />}
                                </Button>

                                <SearchBox />
                            </div>
                        )}

                        <div className="part3 col-sm-5 dFlexAli-center justify-content-end ms-5">
                            <Button
                                className="rounded-circle me-2"
                                onClick={() => context.setDarkMode(!context.darkMode)}
                            >
                                {context.darkMode === false ? <IoSunnyOutline /> : <FaMoon />}
                            </Button>

                            <div className="dropdownWrapper me-3 position-relative">
                                <Button onClick={handleOpenNotice} className="rounded-circle">
                                    <FaRegBell />
                                </Button>

                                <Menu
                                    className="notifications dropdown_list"
                                    anchorEl={anchorEl}
                                    id="notifications"
                                    open={open2}
                                    onClose={handleCloseNotice}
                                    onClick={handleCloseNotice}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <div className="head ps-3 pt-2">
                                        <h4>Orders (12)</h4>
                                    </div>
                                    <hr className="m-0" />
                                    <div className="scrollList">
                                        <MenuItem onClick={handleCloseNotice}>
                                            <div className="dFlexAli-center">
                                                <UserAvatarImgComponent Img={avatarImg} />

                                                <div className="dropdownInfo">
                                                    <h4 className="limiTwoLine">
                                                        <span>
                                                            <b>Dream </b>
                                                            added to his favorite list
                                                            <b> Leather belt steve madden</b>
                                                        </span>
                                                    </h4>
                                                    <p className="text-time mb-0">few seconds ago</p>
                                                </div>
                                            </div>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseNotice}>
                                            <div className="dFlexAli-center">
                                                <div className="userImg">
                                                    <span className="rounded-circle">
                                                        <img src={avatarImg} alt="Avatar" />
                                                    </span>
                                                </div>

                                                <div className="dropdownInfo">
                                                    <h4 className="limiTwoLine">
                                                        <span>
                                                            <b>Dream </b>
                                                            added to his favorite list
                                                            <b> Leather belt steve madden</b>
                                                        </span>
                                                    </h4>
                                                    <p className="text-time mb-0">few seconds ago</p>
                                                </div>
                                            </div>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseNotice}>
                                            <div className="dFlexAli-center">
                                                <div className="userImg">
                                                    <span className="rounded-circle">
                                                        <img src={avatarImg} alt="Avatar" />
                                                    </span>
                                                </div>

                                                <div className="dropdownInfo">
                                                    <h4 className="limiTwoLine">
                                                        <span>
                                                            <b>Dream </b>
                                                            added to his favorite list
                                                            <b> Leather belt steve madden</b>
                                                        </span>
                                                    </h4>
                                                    <p className="text-time mb-0">few seconds ago</p>
                                                </div>
                                            </div>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseNotice}>
                                            <div className="dFlexAli-center">
                                                <div className="userImg">
                                                    <span className="rounded-circle">
                                                        <img src={avatarImg} alt="Avatar" />
                                                    </span>
                                                </div>

                                                <div className="dropdownInfo">
                                                    <h4 className="limiTwoLine">
                                                        <span>
                                                            <b>Dream </b>
                                                            added to his favorite list
                                                            <b> Leather belt steve madden</b>
                                                        </span>
                                                    </h4>
                                                    <p className="text-time mb-0">few seconds ago</p>
                                                </div>
                                            </div>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseNotice}>
                                            <div className="dFlexAli-center">
                                                <div className="userImg">
                                                    <span className="rounded-circle">
                                                        <img src={avatarImg} alt="Avatar" />
                                                    </span>
                                                </div>

                                                <div className="dropdownInfo">
                                                    <h4 className="limiTwoLine">
                                                        <span>
                                                            <b>Dream </b>
                                                            added to his favorite list
                                                            <b> Leather belt steve madden</b>
                                                        </span>
                                                    </h4>
                                                    <p className="text-time mb-0">few seconds ago</p>
                                                </div>
                                            </div>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseNotice}>
                                            <div className="dFlexAli-center">
                                                <div className="userImg">
                                                    <span className="rounded-circle">
                                                        <img src={avatarImg} alt="Avatar" />
                                                    </span>
                                                </div>

                                                <div className="dropdownInfo">
                                                    <h4 className="limiTwoLine">
                                                        <span>
                                                            <b>Dream </b>
                                                            added to his favorite list
                                                            <b> Leather belt steve madden</b>
                                                        </span>
                                                    </h4>
                                                    <p className="text-time mb-0">few seconds ago</p>
                                                </div>
                                            </div>
                                        </MenuItem>
                                    </div>

                                    <div className="w-100 p-1">
                                        <Button className="w-100 btn-blue">View all notifications</Button>
                                    </div>
                                </Menu>
                            </div>

                            {context.windowWidth < 992 && (
                                <Button
                                    className="rounded-circle ms-2"
                                    onClick={() => context.setMenuBtn(!context.menuBtn)}
                                >
                                    {context.menuBtn === true ? <RiMenuUnfold2Fill /> : <RiMenuLine />}
                                </Button>
                            )}

                            <Button onClick={handleClick} className="myAcc dFlexAli-center">
                                <div className="userImg">
                                    <span className="rounded-circle">
                                        <img src={avatarImg} alt="Avatar" />
                                    </span>
                                </div>

                                <div className="userInfo d-flex flex-column pt-2 ps-2 res-hide">
                                    <h5 className="mb-0">Dream</h5>
                                    <p className="mb-0">@dream1209</p>
                                </div>
                            </Button>

                            <Menu
                                className="optionsAcc"
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <FaUser fontSize="medium" />
                                    </ListItemIcon>
                                    My Account
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <IoSettingsSharp fontSize="medium" />
                                    </ListItemIcon>
                                    Settings
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <Logout fontSize="medium" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default HeaderDashboard;
