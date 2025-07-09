// Tools
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

// React
import { useState } from 'react';
import { Link } from 'react-router-dom';

// CSS
import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Sidebar = (props) => {
    const [value, setValue] = useState([1, 5]);

    return (
        <>
            <div className={cx('sidebar', props.className)}>
                <div className={cx('filterBox')}>
                    <h6>Fields Of Studdy</h6>

                    <div className={cx('scroll')}>
                        <ul>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />} label="Natural Sciences" />
                            </li>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />} label="Social Sciences" />
                            </li>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />} label="Math" />
                            </li>
                            <li>
                                <FormControlLabel
                                    className="w-100"
                                    control={<Checkbox />}
                                    label="Infomation Technology"
                                />
                            </li>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />} label="Literature" />
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={cx('filterBox')}>
                    <h6>Filter by Rates</h6>

                    <RangeSlider className="mt-3" value={value} onInput={setValue} min={1} max={5} step={0.5} />

                    <div className={`d-flex pt-2 pb-2 ${cx('priceRange')}`}>
                        <span>
                            <strong className="text-dark">Starts: {value[0]}</strong>
                        </span>

                        <span className="ms-auto">
                            <strong className="text-dark">Starts: {value[1]}</strong>
                        </span>
                    </div>
                </div>

                <div className={cx('filterBox')}>
                    <h6>Most</h6>

                    <div className={cx('scroll')}>
                        <ul>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />} label="Most Taken" />
                            </li>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />} label="Most Favorited" />
                            </li>
                        </ul>
                    </div>
                </div>

                <Link to="#">
                    <img
                        className="w-100"
                        src="https://klbtheme.com/bacola/wp-content/uploads/2021/05/sidebar-banner.gif"
                        alt="ImgPR"
                        style={{ borderRadius: '10px' }}
                    />
                </Link>
            </div>
        </>
    );
};

export default Sidebar;
