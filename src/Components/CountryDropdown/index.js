import { FaAngleDown } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

import React from "react";
import { useState } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const CountryDropdown = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);


    return (
        <div>
            <Button onClick={() => setIsOpenModal(true)} className="countryDrop">
                <div className="info d-flex flex-column">
                    <span className='label'>Your Location</span>
                    <span className='name'>Select a location</span>
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
                    <input type="text" placeholder="Search your area..." spellCheck="false"/>
                </div>

                <ul className="countryList mt-3">
                    <li><Button>VietNam</Button></li>
                    <li><Button>USA</Button></li>
                    <li><Button>UK</Button></li>
                    <li><Button>China</Button></li>
                    <li><Button>Japan</Button></li>
                    <li><Button>Korea</Button></li>
                    <li><Button>Taiwan</Button></li>
                    <li><Button>India</Button></li>
                    <li><Button>Russia</Button></li>
                    <li><Button>Germany</Button></li>
                </ul>
            </Dialog>   
        </div>
    )
}

export default CountryDropdown;