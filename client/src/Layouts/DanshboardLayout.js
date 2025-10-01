import '../Dashboard.css';

// React
import { Outlet } from 'react-router-dom';
import { useContext } from 'react';

// Components
import HeaderDashboard from '../Components/Dashboard/Header';
import Sidebar from '../Components/Dashboard/Sidebar';

import { MyContext } from '../App';

export default function DashboardLayout() {
    const context = useContext(MyContext);

    return (
        <>
            <HeaderDashboard />
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
