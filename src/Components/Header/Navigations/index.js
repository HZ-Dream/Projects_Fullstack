import { IoIosMenu } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { useState } from "react";


const Navigation = () => {
    const [isOpenSidebarNav, setIsOpenSidebarNav] = useState(false);

    return ( 
        <nav>
            <div className="container">
                <div className="row">
                    <div className="col-sm-2 navPart1">
                        <div className="catWrapper">
                            <Button className="allCatTab align-items-center" onClick={() => setIsOpenSidebarNav(!isOpenSidebarNav)}>
                                <span className="icon1"><IoIosMenu /></span>
                                <span className="text ms-2 me-2">all categories</span>
                                <span className="icon2"><FaAngleDown /></span>
                            </Button>

                            <div className={`sidebarNav ${isOpenSidebarNav ? "open" : ""}`}>
                                <ul>
                                    <li><Link to="/"><Button>Fruits &amp; Vegetables</Button></Link></li>
                                    <li><Link to="/"><Button>Meats &amp; Seafood</Button></Link></li>
                                    <li><Link to="/"><Button>Breakfast &amp; Dairy</Button></Link></li>
                                    <li><Link to="/"><Button>Beverages</Button></Link></li>
                                    <li><Link to="/"><Button>Frozen Foods</Button></Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-10 navPart2 d-flex align-items-center">
                        <ul className="list list-inline ms-auto">
                            <li className="list-inline-item">
                                <Link to="/"><Button>Home</Button></Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/"><Button>Shop</Button></Link>
                                <div className="submenu shadow">
                                    <Link to="/"><Button>Cart</Button></Link>
                                    <Link to="/"><Button>Checkout</Button></Link>
                                    <Link to="/"><Button>Wishlist</Button></Link>
                                    <Link to="/"><Button>Order Tracking</Button></Link>
                                    <Link to="/"><Button>Featured Products</Button></Link>
                                </div>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/"><Button>MEATS & SEAFOOD</Button></Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/"><Button>Bakery</Button></Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/"><Button>Beverages</Button></Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/"><Button>Blog</Button></Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/"><Button>Contact</Button></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;