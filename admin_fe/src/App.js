import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// React
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, createContext } from 'react';

// Components
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';

// Pages
import Dashboard from './Pages/Dashboard';

const MyContext = createContext();

function App() {
    const [menuBtn, setMenuBtn] = useState(true);

    const values = {
        menuBtn,
        setMenuBtn,
    };

    return (
        <BrowserRouter>
            <MyContext.Provider value={values}>
                <Header />
                <div className="main d-flex">
                    <div className={`sidebarWrapper ${menuBtn === true ? '' : 'toggle'}`}>
                        <Sidebar />
                    </div>

                    <div className={`content ${menuBtn === true ? '' : 'toggle'}`}>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Routes>
                    </div>
                </div>
            </MyContext.Provider>
        </BrowserRouter>
    );
}

export default App;
export { MyContext };
