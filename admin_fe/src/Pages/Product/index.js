// Icons
import { FaUserCircle } from 'react-icons/fa';
import { FaShoppingCart } from 'react-icons/fa';
import { FaBagShopping } from 'react-icons/fa6';
import { FaEye } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

// Material UI
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Pagination from '@mui/material/Pagination';

// React
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Components
import DashboardBox from '../Dashboard/components/dashboardBox';

const ProductList = () => {
    const [showBy, setShowBy] = useState('');
    const [catBy, setCatBy] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <section className="right-content w-100">
                <div className="row dashboardBoxWrapperRow">
                    <div className="col-md-12 list">
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
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Best Selling Products</h3>

                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>SHOW BY</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    className="w-100"
                                    value={showBy}
                                    onChange={(e) => setShowBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div className="col-md-3">
                            <h4>CATEGORY BY</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    className="w-100"
                                    value={catBy}
                                    onChange={(e) => setCatBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="theadDesign">
                                <tr>
                                    <th>UID</th>
                                    <th>PRODUCT</th>
                                    <th>CATEGORY</th>
                                    <th>BRAND</th>
                                    <th>PRICE</th>
                                    <th>STOCK</th>
                                    <th>RATING</th>
                                    <th>ORDER</th>
                                    <th>SALES</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>#1</td>
                                    <td>
                                        <div className="dFlexAli-center productBox">
                                            <div className="imgWrapper">
                                                <div className="img card m-0">
                                                    <img
                                                        className="w-100"
                                                        src="https://mironcoder-hotash.netlify.app/images/product/01.webp"
                                                        alt="Image"
                                                    />
                                                </div>
                                            </div>

                                            <div className="info ps-2">
                                                <h6>Tops and skirt set for Female</h6>
                                                <p>
                                                    Women's exclusive summer Tops and skirt set for Female Tops and
                                                    skirt set
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Womans</td>
                                    <td>Richman</td>
                                    <td>
                                        <del className="old">$23.00</del>
                                        <span className="new text-danger">$21.00</span>
                                    </td>
                                    <td>23</td>
                                    <td>4.9 (15)</td>
                                    <td>355</td>
                                    <td>$38K</td>
                                    <td>
                                        <div className="actions dFlexAli-center justify-content-around">
                                            <Button className="detail">
                                                <Link to="/product/detail/1">
                                                    <FaEye />
                                                </Link>
                                            </Button>
                                            <Button className="edit">
                                                <MdEdit />
                                            </Button>
                                            <Button className="delete">
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td>#2</td>
                                    <td>
                                        <div className="dFlexAli-center productBox">
                                            <div className="imgWrapper">
                                                <div className="img card m-0">
                                                    <img
                                                        className="w-100"
                                                        src="https://mironcoder-hotash.netlify.app/images/product/01.webp"
                                                        alt="Image"
                                                    />
                                                </div>
                                            </div>

                                            <div className="info ps-2">
                                                <h6>Tops and skirt set for Female</h6>
                                                <p>
                                                    Women's exclusive summer Tops and skirt set for Female Tops and
                                                    skirt set
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Womans</td>
                                    <td>Richman</td>
                                    <td>
                                        <del className="old">$23.00</del>
                                        <span className="new text-danger">$21.00</span>
                                    </td>
                                    <td>23</td>
                                    <td>4.9 (15)</td>
                                    <td>355</td>
                                    <td>$38K</td>
                                    <td>
                                        <div className="actions dFlexAli-center justify-content-around">
                                            <Button className="detail">
                                                <FaEye />
                                            </Button>
                                            <Button className="edit">
                                                <MdEdit />
                                            </Button>
                                            <Button className="delete">
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td>#3</td>
                                    <td>
                                        <div className="dFlexAli-center productBox">
                                            <div className="imgWrapper">
                                                <div className="img card m-0">
                                                    <img
                                                        className="w-100"
                                                        src="https://mironcoder-hotash.netlify.app/images/product/01.webp"
                                                        alt="Image"
                                                    />
                                                </div>
                                            </div>

                                            <div className="info ps-2">
                                                <h6>Tops and skirt set for Female</h6>
                                                <p>
                                                    Women's exclusive summer Tops and skirt set for Female Tops and
                                                    skirt set
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Womans</td>
                                    <td>Richman</td>
                                    <td>
                                        <del className="old">$23.00</del>
                                        <span className="new text-danger">$21.00</span>
                                    </td>
                                    <td>23</td>
                                    <td>4.9 (15)</td>
                                    <td>355</td>
                                    <td>$38K</td>
                                    <td>
                                        <div className="actions dFlexAli-center justify-content-around">
                                            <Button className="detail">
                                                <FaEye />
                                            </Button>
                                            <Button className="edit">
                                                <MdEdit />
                                            </Button>
                                            <Button className="delete">
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td>#4</td>
                                    <td>
                                        <div className="dFlexAli-center productBox">
                                            <div className="imgWrapper">
                                                <div className="img card m-0">
                                                    <img
                                                        className="w-100"
                                                        src="https://mironcoder-hotash.netlify.app/images/product/01.webp"
                                                        alt="Image"
                                                    />
                                                </div>
                                            </div>

                                            <div className="info ps-2">
                                                <h6>Tops and skirt set for Female</h6>
                                                <p>
                                                    Women's exclusive summer Tops and skirt set for Female Tops and
                                                    skirt set
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Womans</td>
                                    <td>Richman</td>
                                    <td>
                                        <del className="old">$23.00</del>
                                        <span className="new text-danger">$21.00</span>
                                    </td>
                                    <td>23</td>
                                    <td>4.9 (15)</td>
                                    <td>355</td>
                                    <td>$38K</td>
                                    <td>
                                        <div className="actions dFlexAli-center justify-content-around">
                                            <Button className="detail">
                                                <FaEye />
                                            </Button>
                                            <Button className="edit">
                                                <MdEdit />
                                            </Button>
                                            <Button className="delete">
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td>#5</td>
                                    <td>
                                        <div className="dFlexAli-center productBox">
                                            <div className="imgWrapper">
                                                <div className="img card m-0">
                                                    <img
                                                        className="w-100"
                                                        src="https://mironcoder-hotash.netlify.app/images/product/01.webp"
                                                        alt="Image"
                                                    />
                                                </div>
                                            </div>

                                            <div className="info ps-2">
                                                <h6>Tops and skirt set for Female</h6>
                                                <p>
                                                    Women's exclusive summer Tops and skirt set for Female Tops and
                                                    skirt set
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Womans</td>
                                    <td>Richman</td>
                                    <td>
                                        <del className="old">$23.00</del>
                                        <span className="new text-danger">$21.00</span>
                                    </td>
                                    <td>23</td>
                                    <td>4.9 (15)</td>
                                    <td>355</td>
                                    <td>$38K</td>
                                    <td>
                                        <div className="actions dFlexAli-center justify-content-around">
                                            <Button className="detail">
                                                <FaEye />
                                            </Button>
                                            <Button className="edit">
                                                <MdEdit />
                                            </Button>
                                            <Button className="delete">
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td>#6</td>
                                    <td>
                                        <div className="dFlexAli-center productBox">
                                            <div className="imgWrapper">
                                                <div className="img card m-0">
                                                    <img
                                                        className="w-100"
                                                        src="https://mironcoder-hotash.netlify.app/images/product/01.webp"
                                                        alt="Image"
                                                    />
                                                </div>
                                            </div>

                                            <div className="info ps-2">
                                                <h6>Tops and skirt set for Female</h6>
                                                <p>
                                                    Women's exclusive summer Tops and skirt set for Female Tops and
                                                    skirt set
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Womans</td>
                                    <td>Richman</td>
                                    <td>
                                        <del className="old">$23.00</del>
                                        <span className="new text-danger">$21.00</span>
                                    </td>
                                    <td>23</td>
                                    <td>4.9 (15)</td>
                                    <td>355</td>
                                    <td>$38K</td>
                                    <td>
                                        <div className="actions dFlexAli-center justify-content-around">
                                            <Button className="detail">
                                                <FaEye />
                                            </Button>
                                            <Button className="edit">
                                                <MdEdit />
                                            </Button>
                                            <Button className="delete">
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="dFlexAli-center tableFooter pt-1">
                            <p className="mb-0 me-auto">
                                showing <b>6</b> of <b>60</b> results
                            </p>

                            <Pagination count={10} color="primary" showFirstButton showLastButton />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProductList;
