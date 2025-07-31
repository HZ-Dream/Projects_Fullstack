// Icons
import { IoSearchOutline } from 'react-icons/io5';

const SearchBox = () => {
    return (
        <div className="searchBox position-relative px-2">
            <IoSearchOutline />
            <input className="ms-2" type="text" placeholder="Search here..." spellCheck="false" />
        </div>
    );
};

export default SearchBox;
