import { Link } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import Button from '@mui/material/Button';

import Logo from "../../assets/images/logo.png"
import CountryDropdown from "../CountryDropdown";

const Header = () => {
    return (
        <div>
            <div className="headerWrapper">
                <div className="top-strip bg-blue">
                    <div className="container">
                        <p className="mb-0 mt-0 text-center">Due to the demand for shopping is increasing, orders may be processed with a slight delay</p>
                    </div>
                </div>
            </div>

            <header className="header">
                <div className="container">
                    <div className="row">
                        <div className="logoWrapper d-flex align-items-center col-sm-2">
                            <Link to={'/'}><img src={Logo} alt="Logo"/></Link>
                        </div>

                        <div className="col-sm-10 d-flex align-items-center part2">
                            <CountryDropdown />

                            {/* Header Search Start here */}
                            <div className="headerSearch ms-3 me-3">
                                <input type="text" placeholder="Search for products..." spellCheck="false"/>
                                <Button><IoIosSearch /></Button>
                            </div>
                            {/* Header Search End here */}

                            <div className="d-flex align-items-center part3 ms-auto">
                                <Button className="circle"><FiUser /></Button>

                                <div className="ms-auto cartTab d-flex align-items-center">
                                    <span className="price ms-3 me-3">$12.9</span>
                                    <div className="position-relative">
                                        <Button className="circle"><IoBagOutline /></Button>
                                        <span className="count d-flex align-items-center justify-content-center">1</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header;