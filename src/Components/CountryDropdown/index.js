import { FaAngleDown } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

import React, { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { MyContext } from "../../App";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const CountryDropdown = () => {
    const context = useContext(MyContext);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSelectCountry = (country) => {
        context.setSelectedCountry(country);
        setSearchTerm("");
        setIsOpenModal(false);
    }

    useEffect(() => {
        if (searchTerm === "") {
            setCountryList(context.countryList);
        } else {
            const keyWord = searchTerm.toLowerCase();
            const newList = context.countryList.filter(item =>
                item.country.toLowerCase().includes(keyWord)
            );
            setCountryList(newList);    
        }
    }, [context.countryList, searchTerm]);

    const filterList = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <Button onClick={() => setIsOpenModal(true)} className="countryDrop">
                <div className="info d-flex flex-column">
                    <span className='label'>Your Location</span>
                    <span className='name'>
                        {context.selectedCountry
                            ? context.selectedCountry.length > 10
                            ? context.selectedCountry.substring(0, 10) + '...'
                            : context.selectedCountry
                            : "Select a location"}
                    </span>
                </div>
                <span className='ms-auto'><FaAngleDown /></span>
            </Button>

            <Dialog 
                open={isOpenModal} 
                onClose={() => setIsOpenModal(false)} 
                slots={{
                transition: Transition,
                }}
                className="locationModal">
                <h4 className="mb-0">Choose your Delivery Location</h4>
                <p>Enter your address and we will specify the offer for your area.</p>
                <Button onClick={() => setIsOpenModal(false)} className="close_"><IoCloseCircleOutline /></Button>

                <div className="headerSearch w-100">
                    <Button><IoIosSearch /></Button>
                    <input onChange={filterList} type="text" placeholder="Search your area..." spellCheck="false"/>
                </div>

                <ul className="countryList mt-3">
                    {
                        countryList.length !== 0 &&
                        countryList?.map( item => (
                            <li key={item.iso3}>
                                <Button className={`${item.country === context.selectedCountry ? 'active' : ''}`} 
                                        onClick={() => handleSelectCountry(item.country)}>
                                    {item.country}
                                </Button>
                            </li>
                        ))
                    }
                </ul>
            </Dialog>   
        </div>
    )
}

export default CountryDropdown;