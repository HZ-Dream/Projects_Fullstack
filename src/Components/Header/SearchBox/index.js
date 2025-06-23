import { IoIosSearch } from "react-icons/io";
import Button from '@mui/material/Button';


const SearchBox = () => {
    return ( 
        <div className="headerSearch ms-3 me-3">
            <input type="text" placeholder="Search for products..." spellCheck="false"/>
            <Button><IoIosSearch /></Button>
        </div>
    );
}

export default SearchBox;