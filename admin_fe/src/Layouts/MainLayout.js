// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

// Components
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';

// React
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { MyContext } from '../App';

export default function MainLayout() {
    const context = useContext(MyContext);
    return (
        <>
            <Header />
            <div className="main d-flex">
                <div
                    className={`sidebarOverlay ${context.menuBtn ? 'd-one' : 'toggle'}`}
                    onClick={() => context.setMenuBtn(true)}
                ></div>

                <div className={`sidebarWrapper ${context.menuBtn === true ? '' : 'toggle'}`}>
                    <Sidebar />
                </div>

                <div className={`content ${context.menuBtn === true ? '' : 'toggle'}`}>
                    <Outlet />
                </div>
            </div>
        </>
    );
}
