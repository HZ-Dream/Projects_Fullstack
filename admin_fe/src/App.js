import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './Responsive.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// React
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';

// Components
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';

// Pages
import Dashboard from './Pages/Dashboard';
import ProductDetails from './Pages/ProductDetails';
import ProductUpload from './Pages/ProductUpload';

const MyContext = createContext();

function App() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [menuBtn, setMenuBtn] = useState(true);
    const [darkMode, setDarkMode] = useState(() => {
        const darkModeLocal = localStorage.getItem('darkMode');
        return darkModeLocal !== null ? darkModeLocal === 'true' : true;
    });

    useEffect(() => {
        if (darkMode) {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const values = {
        windowWidth,
        menuBtn,
        setMenuBtn,
        darkMode,
        setDarkMode,
    };

    return (
        <BrowserRouter>
            <MyContext.Provider value={values}>
                <Header />
                <div className="main d-flex">
                    <div
                        className={`sidebarOverlay ${menuBtn ? 'd-one' : 'toggle'}`}
                        onClick={() => setMenuBtn(true)}
                    ></div>

                    <div className={`sidebarWrapper ${menuBtn === true ? '' : 'toggle'}`}>
                        <Sidebar />
                    </div>

                    <div className={`content ${menuBtn === true ? '' : 'toggle'}`}>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/product/detail/:id" element={<ProductDetails />} />
                            <Route path="/product/upload" element={<ProductUpload />} />
                        </Routes>
                    </div>
                </div>
            </MyContext.Provider>
        </BrowserRouter>
    );
}

export default App;
export { MyContext };
