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
import defaultAvatar from '../../../assets/images/default.jpg';

// Material UI
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';

// React
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';

// Components
import SearchBox from '../SearchBox';
import { MyContext } from '../../../App';
import UserAvatarImgComponent from '../UserAvatarImg';

const HeaderDashboard = () => {
    const context = useContext(MyContext);

    return (
        <>
            <header className="dFlexAli-center dashboard">
                <div className="container-fluid w-100">
                    <div className="row dFlexAli-center">
                        {/* Logo Wrapper */}
                        <div className="part1 col-sm-3 ps-4">
                            <Link to={`/dashboard/${context.userData?.userId}`} className="dFlexAli-center logo">
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

                            {context.windowWidth < 992 && (
                                <Button
                                    className="rounded-circle ms-2"
                                    onClick={() => context.setMenuBtn(!context.menuBtn)}
                                >
                                    {context.menuBtn === true ? <RiMenuUnfold2Fill /> : <RiMenuLine />}
                                </Button>
                            )}

                            <Button className="myAcc dFlexAli-center">
                                <div className="userImg">
                                    <span className="rounded-circle">
                                        <img
                                            src={
                                                context.userData?.userImage === ''
                                                    ? defaultAvatar
                                                    : context.userData?.userImage
                                            }
                                            alt="Avatar"
                                        />
                                    </span>
                                </div>

                                <div className="userInfo d-flex flex-column pt-2 ps-2 res-hide">
                                    <h5 className="mb-0">{context.userData?.name}</h5>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default HeaderDashboard;
