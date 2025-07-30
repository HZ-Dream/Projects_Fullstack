import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// React
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';

// Pages
import Dashboard from './Pages/Dashboard';

function App() {
    return (
        <BrowserRouter>
            <Header />
            <div className="main d-flex">
                <div className="sidebarWrapper">
                    <Sidebar />
                </div>

                <div className="content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
