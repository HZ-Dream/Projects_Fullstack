// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// React
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

// Components
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Listing from './Pages/Listing';
import ProductDetails from './Pages/ProductDetails';
import Cart from './Pages/Cart';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';

// Utils
import { fetchDataFromApi } from './utils/api';

const MyContext = createContext();

function App() {
    const [catData, setCatData] = useState([]);
    const [proData, setProData] = useState([]);
    const [proDataList, setProDataList] = useState([]);
    const [featuredProData, setFeaturedProData] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [isHeaderFooterShow, setIsHeaderFooterShow] = useState(true);
    const [isUserLogin, setIsUserLogin] = useState(true);

    useEffect(() => {
        getCountry('https://countriesnow.space/api/v0.1/countries/');

        // Fetch Category Data
        fetchDataFromApi('/api/category/all').then((res) => {
            setCatData(res.categoryList);
        });

        // Fetch Product Data
        fetchDataFromApi('/api/product/all').then((res) => {
            setProData(res.productList);
            setProDataList(res.productList);
        });

        // Fetch Featured Product Data
        fetchDataFromApi(`/api/product/featured`).then((res) => {
            setFeaturedProData(res.productList);
        });
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
        catData,
        featuredProData,
        proData,
        proDataList,
        setProDataList,
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
