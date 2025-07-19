import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Listing from './Pages/Listing';
import ProductDetails from './Pages/ProductDetails';
import Cart from './Pages/Cart';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';

const MyContext = createContext();

function App() {
    const [countryList, setCountryList] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [isHeaderFooterShow, setIsHeaderFooterShow] = useState(true);
    const [isUserLogin, setIsUserLogin] = useState(true);

    useEffect(() => {
        getCountry('https://countriesnow.space/api/v0.1/countries/');
    }, []);

    const getCountry = async (url) => {
        await axios.get(url).then((res) => {
            setCountryList(res.data.data);
        });
    };

    const values = {
        countryList,
        selectedCountry,
        setSelectedCountry,
        isHeaderFooterShow,
        setIsHeaderFooterShow,
        isUserLogin,
        setIsUserLogin,
    };

    return (
        <BrowserRouter>
            <MyContext.Provider value={values}>
                {isHeaderFooterShow && <Header />}
                <Routes>
                    <Route path="/" exact={true} element={<Home />} />
                    <Route path="/cat" exact={true} element={<Listing />} />
                    <Route path="/product/:id" exact={true} element={<ProductDetails />} />
                    <Route path="/cart" exact={true} element={<Cart />} />
                    <Route path="/signIn" exact={true} element={<SignIn />} />
                    <Route path="/signUp" exact={true} element={<SignUp />} />
                </Routes>
                {isHeaderFooterShow && <Footer />}
            </MyContext.Provider>
        </BrowserRouter>
    );
}

export default App;

export { MyContext };
