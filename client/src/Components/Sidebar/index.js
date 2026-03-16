// Tools
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

// React
import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

// CSS
import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';

// API
import { fetchDataFromApi } from '../../utils/api';

// My Context
import { MyContext } from '../../App';

const cx = classNames.bind(styles);

const Sidebar = ({ className, filters, onFilterChange }) => {
    const [value, setValue] = useState([1, 5]);
    const context = useContext(MyContext);

    const fieldData = context.fieldData?.fieldList || [];

    const handleMostChange = (event) => {
        const value = event.target.value;
        const newMost = value === filters.most ? '' : value;

        onFilterChange({
            fields: filters.fields,
            most: newMost,
            sort: filters.sort,
        });
    };

    const handleFilterChange = (fieldId) => {
        const updated = filters.fields.includes(fieldId)
            ? filters.fields.filter((f) => f !== fieldId)
            : [...filters.fields, fieldId];

        onFilterChange({
            fields: updated,
            most: filters.most,
            sort: filters.sort,
        });
    };

    return (
        <>
            <div className={cx('sidebar', className)}>
                <div className={cx('filterBox')}>
                    <h6>Fields Of Studdy</h6>
                    <hr />
                    <div className={cx('scroll')}>
                        <ul>
                            {fieldData?.map((field) => (
                                <li key={field.id}>
                                    <FormControlLabel
                                        className="w-100"
                                        control={
                                            <Checkbox
                                                checked={filters.fields.includes(field.id)}
                                                onChange={() => handleFilterChange(field.id)}
                                            />
                                        }
                                        label={field.name}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={cx('filterBox')}>
                    <h6>Filter by Rates</h6>
                    <hr />
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
                    <hr />
                    <RadioGroup value={filters.most} className={cx('scroll')}>
                        <FormControlLabel
                            onClick={handleMostChange}
                            value="rated"
                            control={<Radio size="small" />}
                            label="Most Rated"
                        />
                        <FormControlLabel
                            onClick={handleMostChange}
                            value="taken"
                            control={<Radio size="small" />}
                            label="Most Taken"
                        />
                    </RadioGroup>
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
