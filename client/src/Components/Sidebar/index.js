// Tools
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import 'react-range-slider-input/dist/style.css';

// React
import { useContext } from 'react';
import { Link } from 'react-router-dom';

// CSS
import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';

// My Context
import { MyContext } from '../../App';

const cx = classNames.bind(styles);

const Sidebar = ({ className, filters, onFilterChange }) => {
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
            </div>
        </>
    );
};

export default Sidebar;
