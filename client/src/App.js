// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Material UI
import { useSnackbar } from 'notistack';

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
import MyList from './Pages/MyList';
import Checkout from './Pages/Checkout';
import Order from './Pages/Order';
import MyAccount from './Pages/MyAccount';
import VerifyOtp from './Pages/VerifyOtp';

// Utils
import { fetchDataFromApi, postData } from './utils/api';

const MyContext = createContext();

function App() {
    // Notice
    const { enqueueSnackbar } = useSnackbar();

    // User
    const [userData, setUserData] = useState({});
    const [tokenData, setTokenData] = useState('');
    const [isUserLogin, setIsUserLogin] = useState(false);

    // Product, Category
    const [proData, setProData] = useState([]);
    const [proDataList, setProDataList] = useState([]);
    const [featuredProData, setFeaturedProData] = useState([]);
    const [catData, setCatData] = useState([]);

    // Cart
    const [myCart, setMyCart] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [cartData, setCartData] = useState({
        productTitle: '',
        images: '',
        rating: '',
        flavor: '',
        weight: '',
        priceInit: 0,
        priceDiscount: 0,
        quantity: 0,
        subTotal: 0,
        productId: '',
        userId: '',
    });

    // Other
    const [wishlistData, setWishlistData] = useState({
        productId: '',
        productTitle: '',
        image: '',
        rating: 0,
        priceInit: 0,
        priceDiscount: 0,
        userId: '',
    });
    const [countryList, setCountryList] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [isHeaderFooterShow, setIsHeaderFooterShow] = useState(true);
    const [searchData, setSearchData] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (token !== null && token !== '') {
            setUserData(user);
            setTokenData(token);
            setIsUserLogin(true);
        } else {
            setIsUserLogin(false);
        }

        // Country
        getCountry('https://countriesnow.space/api/v0.1/countries/');

        // Fetch Category Data
        fetchDataFromApi('/api/category/all').then((res) => {
            setCatData(res.categoryList);
        });

        // Fetch Product Data
        if (!proDataList || proDataList.length === 0) {
            fetchDataFromApi('/api/product/all').then((res) => {
                setProData(res.productList);
                setProDataList(res.productList);
            });
        }

        // Fetch Featured Product Data
        fetchDataFromApi(`/api/product/featured`).then((res) => {
            setFeaturedProData(res.productList);
        });
    }, []);

    useEffect(() => {
        if (tokenData) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                setUserData(user);
                setIsUserLogin(true);

                fetchDataFromApi(`/api/cart/${user.userId}`).then((res) => {
                    if (res !== null && res !== undefined && res !== '') {
                        setMyCart(res);
                    }
                });
            } else {
                setIsUserLogin(false);
            }
        } else {
            setIsUserLogin(false);
        }
    }, [tokenData]);

    useEffect(() => {
        if (userData.userId) {
            fetchDataFromApi(`/api/cart/${userData.userId}`).then((res) => {
                setMyCart(res);
            });
        }
    }, [cartData]);

    const getCountry = async (url) => {
        await axios.get(url).then((res) => {
            setCountryList(res.data.data);
        });
    };

    const handleClickVariant = (message, variant) => {
        console.log(`Message: ${message}, Variant: ${variant}`);

        enqueueSnackbar(message, { variant });
    };

    const addToCart = (data) => {
        if (tokenData !== null && tokenData !== '') {
            postData('/api/cart/add', data).then((res) => {
                if (res !== null && res !== undefined && res !== '') {
                    setCartData(data);
                    handleClickVariant('Successfully added to cart!', 'success');
                }
            });
        } else {
            handleClickVariant('You need sign in!', 'warning');
        }
    };

    const addWishlist = (data) => {
        console.log(data);

        postData('/api/myList/add', data).then((res) => {
            if (res !== null && res !== undefined && res !== '') {
                setWishlistData(data);
                handleClickVariant('Successfully added to wishlist!', 'success');
            }
        });
    };

    const values = {
        userData,
        tokenData,
        setTokenData,
        countryList,
        selectedCountry,
        setSelectedCountry,
        isHeaderFooterShow,
        setIsHeaderFooterShow,
        isUserLogin,
        setIsUserLogin,
        handleClickVariant,
        addToCart,
        catData,
        featuredProData,
        proData,
        proDataList,
        setProDataList,
        myCart,
        setMyCart,
        cartData,
        setCartData,
        quantity,
        setQuantity,
        wishlistData,
        setWishlistData,
        addWishlist,
        searchData,
        setSearchData,
    };

    return (
        <BrowserRouter>
            <MyContext.Provider value={values}>
                {isHeaderFooterShow && <Header />}
                <Routes>
                    <Route path="/" exact={true} element={<Home />} />
                    <Route path="/productList" exact={true} element={<Listing />} />
                    <Route path="/product/:id" exact={true} element={<ProductDetails />} />
                    <Route path="/cart" exact={true} element={<Cart />} />
                    <Route path="/signIn" exact={true} element={<SignIn />} />
                    <Route path="/signUp" exact={true} element={<SignUp />} />
                    <Route path="/myList" exact={true} element={<MyList />} />
                    <Route path="/checkout" exact={true} element={<Checkout />} />
                    <Route path="/order" exact={true} element={<Order />} />
                    <Route path="/myAccount" exact={true} element={<MyAccount />} />
                    <Route path="/verifyOtp" exact={true} element={<VerifyOtp />} />
                </Routes>
                {isHeaderFooterShow && <Footer />}
            </MyContext.Provider>
        </BrowserRouter>
    );
}

export default App;

export { MyContext };
