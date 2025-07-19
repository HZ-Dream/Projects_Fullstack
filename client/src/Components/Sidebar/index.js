// Tools
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

// React
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [value, setValue] = useState([100, 1000]);
    const [value2, setValue2] = useState(0);

    return (
        <>
            <div className="sidebar">
                <div className="filterBox">
                    <h6>Product Categories</h6>

                    <div className="scroll">
                        <ul>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />} label="Beverages" />
                            </li>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />} label="Biscuits & Snacks" />
                            </li>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />} label="Breads & Bakery" />
                            </li>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />} label="Breakfast & Dairy" />
                            </li>
                            <li>
                                <FormControlLabel
                                    className="w-100"
                                    control={<Checkbox />}
                                    label="Fruits & Vegetables"
                                />
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="filterBox">
                    <h6>Filter by price</h6>

                    <RangeSlider className="mt-3" value={value} onInput={setValue} min={100} max={1000} step={5} />

                    <div className="d-flex pt-2 pb-2 priceRange">
                        <span>
                            <strong className="text-dark">Rs: {value[0]}</strong>
                        </span>

                        <span className="ms-auto">
                            <strong className="text-dark">Rs: {value[1]}</strong>
                        </span>
                    </div>
                </div>

                <div className="filterBox">
                    <h6>Product Status</h6>

                    <div className="scroll">
                        <ul>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />} label="In Stock" />
                            </li>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />} label="On Sale" />
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="filterBox">
                    <h6>Brands</h6>

                    <div className="scroll">
                        <ul>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />} label="Frito Lay" />
                            </li>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />} label="Nespresso" />
                            </li>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />} label="Oreo" />
                            </li>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />} label="Quaker" />
                            </li>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />} label="Welch's" />
                            </li>
                        </ul>
                    </div>
                </div>

                <Link to="#">
                    <img
                        className="w-100"
                        src="https://klbtheme.com/bacola/wp-content/uploads/2021/05/sidebar-banner.gif"
                        alt="ImgPR"
                    />
                </Link>
            </div>
        </>
    );
};

export default Sidebar;
