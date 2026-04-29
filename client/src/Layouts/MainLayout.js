// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { Outlet } from 'react-router-dom';
import ScrollToTopButton from '../Components/ScrollToTopButton/ScrollToTopButton';

export default function MainLayout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
            <ScrollToTopButton />
        </>
    );
}
