// Tools
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

// React
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

// Utils
import { postData } from '../../utils/api';

import { MyContext } from '../../App';

const Sidebar = (props) => {
    const context = useContext(MyContext);

    const catData = props.catData;
    const [valuePrice, setValuePrice] = useState([1, 1000]);
    const [isPriceChanged, setIsPriceChanged] = useState(false);

    const [check, setCheck] = useState('');
    const [onSale, setOnSale] = useState('');
    const brands = [];
    props.proData?.map((pro) => brands.push(pro.brand));
    const filterBrands = [...new Set(brands)];

    const [filterMenu, setFilterMenu] = useState({
        categories: [],
        brands: [],
        inStock: '',
        prices: [],
        onSale: '',
    });

    // Category
    const filterCategory = (catId) => {
        const updatedCategories = filterMenu.categories.includes(catId)
            ? filterMenu.categories.filter((item) => item !== catId)
            : [...filterMenu.categories, catId];

        setFilterMenu((prev) => ({
            ...prev,
            categories: updatedCategories,
        }));
    };

    // Brand
    const filterBrand = (brand) => {
        const updatedBrands = filterMenu.brands.includes(brand)
            ? filterMenu.brands.filter((item) => item !== brand)
            : [...filterMenu.brands, brand];

        setFilterMenu((prev) => ({
            ...prev,
            brands: updatedBrands,
        }));
    };

    // Quantity
    const filterQuantity = (value) => {
        if (check === value) {
            setCheck('');
            setFilterMenu((prev) => ({
                ...prev,
                inStock: '',
            }));
        } else {
            setCheck(value);
            setFilterMenu((prev) => ({
                ...prev,
                inStock: value,
            }));
        }
    };

    // Sale
    const filterSale = (value) => {
        if (onSale === value) {
            setOnSale('');
            setFilterMenu((prev) => ({
                ...prev,
                onSale: '',
            }));
        } else {
            setOnSale(value);
            setFilterMenu((prev) => ({
                ...prev,
                onSale: value,
            }));
        }
    };

    // Handle Price
    const handlePriceChange = (newValue) => {
        setValuePrice(newValue);
        if (newValue[0] !== 1 || newValue[1] !== 1000) {
            setIsPriceChanged(true);
        } else {
            setIsPriceChanged(false);
        }
    };

    // Price
    useEffect(() => {
        setFilterMenu((prev) => ({
            ...prev,
            prices: isPriceChanged ? valuePrice : [],
        }));
    }, [valuePrice, isPriceChanged]);

    // Send API
    useEffect(() => {
        postData('/api/product/filterProduct', filterMenu).then((res) => {
            context.setProDataList(res.productList);
        });
    }, [filterMenu]);

    return (
        <>
            <div className="sidebar">
                <div className="filterBox">
                    <h6>Product Categories</h6>

                    <div className="scroll">
                        <ul>
                            {catData?.length > 0 &&
                                catData.map((cat, index) => (
                                    <li key={index}>
                                        <FormControlLabel
                                            onClick={() => filterCategory(cat.id)}
                                            className="w-100"
                                            control={<Checkbox />}
                                            label={cat.name}
                                        />
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>

                <div className="filterBox">
                    <h6>Filter by price init</h6>

                    <RangeSlider
                        className="mt-3"
                        value={valuePrice}
                        onInput={handlePriceChange}
                        min={1}
                        max={1000}
                        step={1}
                    />

                    <div className="d-flex pt-2 pb-2 priceRange">
                        <span>
                            <strong className="text-dark">$ {valuePrice[0]}</strong>
                        </span>

                        <span className="ms-auto">
                            <strong className="text-dark">$ {valuePrice[1]}</strong>
                        </span>
                    </div>
                </div>

                <div className="filterBox">
                    <h6>Product Status</h6>

                    <div className="scroll-2">
                        <ul>
                            <li>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={check === 'true'} onChange={() => filterQuantity('true')} />
                                    }
                                    label="In Stock"
                                />
                            </li>
                            <li>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={check === 'false'}
                                            onChange={() => filterQuantity('false')}
                                        />
                                    }
                                    label="Out Stock"
                                />
                            </li>
                            <li>
                                <FormControlLabel
                                    onClick={() => filterSale('sale')}
                                    className="w-100"
                                    control={<Checkbox />}
                                    label="On Sale"
                                />
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="filterBox">
                    <h6>Brands</h6>

                    <div className="scroll">
                        <ul>
                            {filterBrands?.length &&
                                filterBrands.map((item, index) => (
                                    <li key={index}>
                                        <FormControlLabel
                                            onClick={() => filterBrand(item)}
                                            className="w-100"
                                            control={<Checkbox />}
                                            label={item}
                                        />
                                    </li>
                                ))}
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
