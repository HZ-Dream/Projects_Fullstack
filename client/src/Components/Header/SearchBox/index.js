// Icons, Button
import { IoIosSearch } from 'react-icons/io';
import Button from '@mui/material/Button';

// CSS
import styles from './SearchBox.module.scss';
import classNames from 'classnames/bind';

// React
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// API
import { fetchDataFromApi } from '../../../utils/api';

// Context
import { MyContext } from '../../../App';
import SearchList from './SearchList';

const cx = classNames.bind(styles);

const SearchBox = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();

    const [searchValue, setSearchValue] = useState('');
    const [recommendList, setRecommendList] = useState([]);
    const [showList, setShowList] = useState(false);

    const onChangeValue = (e) => {
        const value = e.target.value;
        setSearchValue(value);

        if (!value.trim()) {
            setRecommendList([]);
            return;
        }

        // debounce recommend
        clearTimeout(window.__searchDebounce);
        window.__searchDebounce = setTimeout(() => {
            fetchDataFromApi(`/api/search/recommendQuiz?q=${value}`).then((res) => {
                setRecommendList(res);
                setShowList(true);
            });
        }, 300);
    };

    // CLICK BUTTON SEARCH → FIND QUIZ
    const searchQuiz = () => {
        if (!searchValue.trim()) {
            context.handleClickVariant('At least 1 letter!', 'warning');
            return;
        }

        fetchDataFromApi(`/api/search/findQuiz?q=${searchValue}`).then((res) => {
            setShowList(false);
            navigate('/quiz', {
                state: {
                    searchResults: res,
                    searchQuery: searchValue,
                },
            });
        });
    };

    const handleSelectQuiz = (quizId) => {
        setShowList(false);
        setSearchValue('');
        navigate(`/quiz/${quizId}`);
    };

    return (
        <div className={cx('searchBox')}>
            <IoIosSearch className={cx('searchIcon')} />
            <input
                value={searchValue}
                onChange={onChangeValue}
                placeholder="Search quiz..."
                spellCheck="false"
                onFocus={() => recommendList.length && setShowList(true)}
                onBlur={() => setTimeout(() => setShowList(false), 150)}
            />

            <Button onClick={searchQuiz} className={cx('searchBtn')}>
                Search
            </Button>

            {showList && recommendList.length > 0 && <SearchList data={recommendList} onSelect={handleSelectQuiz} />}
        </div>
    );
};

export default SearchBox;
