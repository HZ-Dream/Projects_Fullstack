// Icons
import { IoIosMenu } from 'react-icons/io';
import { FaAngleDown } from 'react-icons/fa6';
import { FaAngleRight } from 'react-icons/fa6';
import Button from '@mui/material/Button';

// React
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navigation = (props) => {
    const [isOpenSidebarNav, setIsOpenSidebarNav] = useState(false);
    const catData = props.catData;

    return (
        <nav>
            <div className="container">
                <div className="row">
                    <div className="col-sm-2 navPart1">
                        <div className="catWrapper">
                            <Button
                                className="allCatTab align-items-center"
                                onClick={() => setIsOpenSidebarNav(!isOpenSidebarNav)}
                            >
                                <span className="icon1">
                                    <IoIosMenu />
                                </span>
                                <span className="text ms-2 me-2">all categories</span>
                                <span className="icon2">
                                    <FaAngleDown />
                                </span>
                            </Button>

                            <div className={`sidebarNav ${isOpenSidebarNav ? 'open' : ''}`}>
                                <ul>
                                    {catData?.length > 0 &&
                                        catData.map((cat) => (
                                            <li key={cat.id}>
                                                <Link to="/">
                                                    <Button>
                                                        {cat.name}
                                                        {cat.subCat?.length > 0 && <FaAngleRight className="ms-auto" />}
                                                    </Button>
                                                </Link>

                                                {cat.subCat?.length > 0 && (
                                                    <div className="submenu">
                                                        {cat.subCat.map((sub, index) => (
                                                            <Link to="/" key={index}>
                                                                <Button>{sub}</Button>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-10 navPart2 d-flex align-items-center">
                        <ul className="list list-inline ms-auto">
                            <li className="list-inline-item">
                                <Link to="/">
                                    <Button>Home</Button>
                                </Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/">
                                    <Button>Shop</Button>
                                </Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/">
                                    <Button>Wishlist</Button>
                                </Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/">
                                    <Button>Compare</Button>
                                </Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/cat">
                                    <Button>Pages</Button>
                                </Link>
                                <div className="submenu shadow">
                                    <Link to="/">
                                        <Button>Policy Customer</Button>
                                    </Link>
                                    <Link to="/">
                                        <Button>Hotline</Button>
                                    </Link>
                                    <Link to="/">
                                        <Button>Report</Button>
                                    </Link>
                                </div>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/">
                                    <Button>Blog</Button>
                                </Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/">
                                    <Button>Contact</Button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
