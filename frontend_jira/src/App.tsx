// React
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';
import ProjectPage from './pages/Project/index';
import TaskBoard from './pages/Task';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Main Routes */}
                <Route path="/" element={<ProjectPage />} />
                <Route path="/task" element={<TaskBoard />} />
                
                {/* Redirect nếu vào link lạ */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
