import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Outlet } from 'react-router-dom';

export default function NoneLayout() {
    return (
        <>
            <Outlet />
        </>
    );
}
