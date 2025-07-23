// Icons, Button
import { IoIosSearch } from 'react-icons/io';
import Button from '@mui/material/Button';

// CSS
import styles from './SearchBox.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const SearchBox = () => {
    return (
        <div className={cx('headerSearch')}>
            <input type="text" placeholder="Search for quizs..." spellCheck="false" />
            <Button>
                <IoIosSearch />
            </Button>
        </div>
    );
};

export default SearchBox;
