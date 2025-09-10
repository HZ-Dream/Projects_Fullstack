// Icons
import { IoIosSearch } from 'react-icons/io';

// Material UI
import Button from '@mui/material/Button';

// React
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// API
import { fetchDataFromApi } from '../../../utils/api';

import { MyContext } from '../../../App';

const SearchBox = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [searchFields, setSearchFields] = useState('');

    useEffect(() => {
        setSearchFields('');
    }, []);

    const onChangeValue = (e) => {
        setSearchFields(e.target.value);
    };

    const searchProducts = () => {
        if (searchFields === '') {
            context.handleClickVariant('At least 1 letter!', 'warning');
            return;
        }
        fetchDataFromApi(`/api/search?q=${searchFields}`).then((res) => {
            context.setProDataList(res);

            navigate('/productList', {
                state: {
                    searchResults: res,
                    searchQuery: searchFields,
                },
            });
        });
    };

    return (
        <div className="headerSearch ms-3 me-3">
            <input onChange={onChangeValue} type="text" placeholder="Search for products..." spellCheck="false" />
            <Button onClick={searchProducts}>
                <IoIosSearch />
            </Button>
        </div>
    );
};

export default SearchBox;
