import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectPage from './pages/ProjectPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ProjectPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
